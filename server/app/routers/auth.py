import uuid
from datetime import timedelta
from fastapi import APIRouter, Response, Request, HTTPException, status, Depends
from app.config import settings
from app.schemas import (
    RegisterRequest,
    LoginRequest,
    GoogleAuthRequest,
    ProfileUpdateRequest,
    ChangePasswordRequest,
    AuthResponse,
    UserResponse,
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.database import (
    get_user_by_email,
    get_user_by_id,
    create_user,
    update_user_profile,
    update_user_password,
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def _set_auth_cookies(response: Response, user_id: str, remember_me: bool = True):
    """Utility to generate JWTs and set HTTP-only cookies on the response."""
    minutes = (24 * 60) if remember_me else settings.ACCESS_TOKEN_EXPIRE_MINUTES
    access_token = create_access_token(
        data={"sub": user_id},
        expires_delta=timedelta(minutes=minutes)
    )
    refresh_token = create_refresh_token(
        data={"sub": user_id},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    max_age_seconds = minutes * 60
    
    # Primary HTTP-only Access Cookie
    response.set_cookie(
        key=settings.ACCESS_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=max_age_seconds,
        path=settings.COOKIE_PATH,
    )
    
    # Secondary Refresh Cookie
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path=settings.COOKIE_PATH,
    )

def _clear_auth_cookies(response: Response):
    """Utility to delete HTTP-only cookies on logout."""
    response.delete_cookie(
        key=settings.ACCESS_COOKIE_NAME,
        path=settings.COOKIE_PATH,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
    )
    response.delete_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        path=settings.COOKIE_PATH,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
    )

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, response: Response):
    """
    Registers a new user in MongoDB, hashes password with Argon2,
    and issues an HTTP-only JWT cookie.
    """
    if req.confirmPassword and req.password != req.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
        
    existing = await get_user_by_email(req.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )
        
    hashed = hash_password(req.password)
    user_id = "usr_" + uuid.uuid4().hex[:12]
    avatar = ""
    
    new_user = await create_user(
        user_id=user_id,
        name=req.name,
        email=req.email,
        hashed_password=hashed,
        avatar=avatar
    )
    
    # Set HTTP-only Cookie
    _set_auth_cookies(response, user_id, remember_me=True)
    
    user_dict = dict(new_user)
    user_dict.pop("hashed_password", None)
    
    return AuthResponse(
        status="success",
        message="Account created successfully.",
        user=UserResponse(**user_dict)
    )

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, response: Response):
    """
    Verifies user credentials from MongoDB with Argon2 and issues an HTTP-only JWT cookie.
    Never exposes JWT token in response body.
    """
    user = await get_user_by_email(req.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    if not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    # Set HTTP-only Cookie
    _set_auth_cookies(response, user["id"], remember_me=req.rememberMe)
    
    user_dict = dict(user)
    user_dict.pop("hashed_password", None)
    
    return AuthResponse(
        status="success",
        message="Login successful.",
        user=UserResponse(**user_dict)
    )

@router.post("/logout")
async def logout(response: Response):
    """
    Logs out the user by explicitly clearing authentication cookies.
    """
    _clear_auth_cookies(response)
    return {"status": "success", "message": "Logged out successfully."}

@router.get("/me", response_model=AuthResponse)
async def get_me(response: Response, current_user: dict = Depends(get_current_user)):
    """
    Returns current authenticated user details from MongoDB.
    Refreshes session cookies on reload so active citizens stay authenticated.
    """
    user_dict = dict(current_user)
    user_dict.pop("hashed_password", None)
    
    _set_auth_cookies(response, current_user["id"], remember_me=True)
    
    return AuthResponse(
        status="success",
        message="Session active.",
        user=UserResponse(**user_dict)
    )

@router.post("/refresh", response_model=AuthResponse)
async def refresh_session(request: Request, response: Response):
    """
    Rotates authentication session by inspecting refresh token cookie.
    """
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token cookie found."
        )
        
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired or invalid."
        )
        
    user_id = payload.get("sub")
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )
        
    _set_auth_cookies(response, user_id, remember_me=True)
    
    user_dict = dict(user)
    user_dict.pop("hashed_password", None)
    
    return AuthResponse(
        status="success",
        message="Session refreshed successfully.",
        user=UserResponse(**user_dict)
    )

@router.post("/google", response_model=AuthResponse)
async def google_auth(req: GoogleAuthRequest, response: Response):
    """
    Secure Google OAuth endpoint with MongoDB persistence.
    Establishes the same backend-managed HTTP-only cookie session.
    """
    if not req.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is required."
        )
    email = req.email.strip().lower()
    name = req.name or email.split("@")[0].replace(".", " ").title()
    avatar = req.avatar or ""
    
    user = await get_user_by_email(email)
    if not user:
        random_pw = hash_password(uuid.uuid4().hex + "CivicSphereOAuth2026!")
        user_id = "usr_g_" + uuid.uuid4().hex[:10]
        user = await create_user(
            user_id=user_id,
            name=name,
            email=email,
            hashed_password=random_pw,
            avatar=avatar
        )
    
    _set_auth_cookies(response, user["id"], remember_me=True)
    
    user_dict = dict(user)
    user_dict.pop("hashed_password", None)
    
    return AuthResponse(
        status="success",
        message="Google authentication successful.",
        user=UserResponse(**user_dict)
    )

@router.put("/profile", response_model=AuthResponse)
async def update_profile(
    req: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Updates the authenticated user's profile information in MongoDB.
    """
    updated = await update_user_profile(
        user_id=current_user["id"],
        name=req.name,
        phone=req.phone,
        avatar=req.avatar
    )
    user_dict = dict(updated)
    user_dict.pop("hashed_password", None)
    
    return AuthResponse(
        status="success",
        message="Profile updated successfully.",
        user=UserResponse(**user_dict)
    )

@router.post("/change-password")
async def change_password(
    req: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Securely updates the authenticated user's password in MongoDB with Argon2.
    """
    if not verify_password(req.currentPassword, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )
        
    new_hash = hash_password(req.newPassword)
    await update_user_password(current_user["id"], new_hash)
    
    return {"status": "success", "message": "Password updated successfully."}
