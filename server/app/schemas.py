from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[str] = "Citizen Researcher"
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    status: str = "success"
    message: str
    user: UserResponse
    # STRICTLY NO tokens in response body!

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirmPassword: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    rememberMe: Optional[bool] = True

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    avatar: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    currentPassword: str = Field(..., min_length=1)
    newPassword: str = Field(..., min_length=6)

class ChatMessageRequest(BaseModel):
    chatId: str
    message: str = Field(..., min_length=1)
    documentContext: Optional[str] = None

class SourceCitation(BaseModel):
    title: str
    link: str

class CivicAIResponse(BaseModel):
    id: str
    sender: str = "ai"
    intro: str
    points: list[str]
    legalSummary: str
    sources: list[SourceCitation]
    relatedQuestions: list[str]
    timestamp: str

class ChatMessageResponse(BaseModel):
    status: str = "success"
    aiResponse: CivicAIResponse

