from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.security import hash_password

class MongoDB:
    client: AsyncIOMotorClient = None

mongo = MongoDB()

def get_database():
    """Returns the active MongoDB database instance."""
    return mongo.client[settings.MONGODB_DB_NAME]

async def init_db():
    """
    Initializes the MongoDB connection and creates indexes.
    """
    print(f"[INFO] Connecting to MongoDB at {settings.MONGODB_URL}...")
    mongo.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = get_database()
    
    # Ping to verify connection
    await mongo.client.admin.command('ping')
    print(f"[INFO] Successfully connected to MongoDB database: '{settings.MONGODB_DB_NAME}'")
    
    # Create unique index on email
    await db.users.create_index("email", unique=True)
    print("[INFO] MongoDB collections & indexes initialized.")

async def close_db():
    """Closes MongoDB connection pool gracefully on shutdown."""
    if mongo.client:
        mongo.client.close()
        print("[INFO] MongoDB connection pool closed.")

async def get_user_by_email(email: str):
    db = get_database()
    doc = await db.users.find_one({"email": email.strip().lower()})
    if doc:
        doc.pop("_id", None)
    return doc

async def get_user_by_id(user_id: str):
    db = get_database()
    doc = await db.users.find_one({"id": user_id})
    if doc:
        doc.pop("_id", None)
    return doc

async def create_user(user_id: str, name: str, email: str, hashed_password: str, phone: str = "", avatar: str = ""):
    db = get_database()
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    user_doc = {
        "id": user_id,
        "name": name.strip(),
        "email": email.strip().lower(),
        "hashed_password": hashed_password,
        "phone": phone,
        "avatar": avatar,
        "role": "Citizen Researcher",
        "created_at": now_str
    }
    await db.users.insert_one(user_doc)
    user_doc.pop("_id", None)
    return user_doc

async def update_user_profile(user_id: str, name: str = None, phone: str = None, avatar: str = None):
    db = get_database()
    update_fields = {}
    if name is not None:
        update_fields["name"] = name
    if phone is not None:
        update_fields["phone"] = phone
    if avatar is not None:
        update_fields["avatar"] = avatar
        
    if update_fields:
        await db.users.update_one({"id": user_id}, {"$set": update_fields})
        
    return await get_user_by_id(user_id)

async def update_user_password(user_id: str, new_hashed_password: str):
    db = get_database()
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"hashed_password": new_hashed_password}}
    )
    return True
