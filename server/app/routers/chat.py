import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import ChatMessageRequest, ChatMessageResponse, CivicAIResponse
from app.dependencies import get_current_user
from app.database import get_database
from app.services.gemini_service import generate_civic_guidance
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Civic AI Chat"])

@router.post("/message", response_model=ChatMessageResponse)
async def send_chat_message(
    req: ChatMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Receives user query, calls Gemini with grounded civic system prompt,
    saves chat record in MongoDB, and returns structured citation-backed response.
    """
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Gemini API key is not configured. Please get a free API key at "
                "https://aistudio.google.com/ and set GEMINI_API_KEY in server/.env"
            )
        )

    try:
        # Call Google Gemini
        ai_data = generate_civic_guidance(
            query=req.message,
            document_context=req.documentContext or ""
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Error querying Gemini: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate civic response: {str(e)}"
        )

    # Persist message and response in MongoDB
    try:
        db = get_database()
        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        await db.chat_history.insert_one({
            "user_id": current_user["id"],
            "chat_id": req.chatId,
            "user_query": req.message,
            "ai_response": ai_data,
            "created_at": timestamp_str,
        })
    except Exception as dbe:
        logger.warning(f"Could not log chat message to MongoDB: {str(dbe)}")

    return ChatMessageResponse(
        status="success",
        aiResponse=CivicAIResponse(**ai_data)
    )

