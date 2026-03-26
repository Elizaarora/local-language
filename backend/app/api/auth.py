import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from ..models.user import UserCreate, UserLogin, Token
from ..services.auth_service import auth_service
from ..services.firebase_service import firebase_service
from ..services.email_service import send_password_reset_email
from ..core.security import get_password_hash
from ..core.config import settings
from ..core.logging_config import logger

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        result = await auth_service.register_user(user_data)
        
        if not result:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        logger.info(f"User registered: {user_data.email}")
        return result
    except Exception as e:
        logger.error(f"Registration error: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user"""
    try:
        logger.info(f"=== LOGIN ATTEMPT ===")
        logger.info(f"Email: {login_data.email}")
        logger.info(f"Login endpoint called")
        
        result = await auth_service.login_user(login_data)
        
        if not result:
            logger.warning(f"Login failed for email: {login_data.email}")
            # Check if user exists to give better error message
            user = await firebase_service.get_user_by_email(login_data.email)
            if not user:
                logger.error(f"User does not exist: {login_data.email}")
                raise HTTPException(status_code=401, detail="User not found. Please register first.")
            elif not user.get('hashed_password'):
                logger.error(f"User has no password hash: {login_data.email}")
                raise HTTPException(status_code=401, detail="Account setup incomplete. Please contact support.")
            else:
                logger.error(f"Password verification failed for: {login_data.email}")
                raise HTTPException(status_code=401, detail="Invalid password. Please try again.")
        
        logger.info(f"✅ Login successful for: {login_data.email}")
        logger.info(f"User ID: {result.user.id}")
        logger.info(f"Token generated: {result.access_token[:20]}...")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login endpoint error: {e}", exc_info=True)
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error during login")

@router.get("/test")
async def test_auth():
    """Test authentication endpoint"""
    return {"message": "Auth API is working!"}

@router.get("/check-user/{email}")
async def check_user(email: str):
    """Check if user exists (for debugging)"""
    try:
        user = await firebase_service.get_user_by_email(email)
        
        if not user:
            return {
                "exists": False,
                "email": email,
                "message": "User not found"
            }
        
        return {
            "exists": True,
            "email": user.get('email'),
            "name": user.get('name'),
            "has_id": bool(user.get('id')),
            "has_password": bool(user.get('hashed_password')),
            "password_hash_length": len(user.get('hashed_password', '')) if user.get('hashed_password') else 0,
            "created_at": str(user.get('created_at')) if user.get('created_at') else None
        }
    except Exception as e:
        logger.error(f"Check user error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/{email}")
async def search_user(email: str):
    """Search for a user by email"""
    user = await firebase_service.get_user_by_email(email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.get('id'),
        "name": user.get('name'),
        "email": user.get('email'),
        "preferred_language": user.get('preferred_language')
    }

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    """Send password reset email. Always returns 200 to avoid leaking whether email exists."""
    user = await firebase_service.get_user_by_email(data.email)
    if user:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)
        await firebase_service.create_reset_token(data.email, token, expires_at)
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        background_tasks.add_task(send_password_reset_email, data.email, reset_link)
    return {"message": "If that email exists, a reset link has been sent."}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    """Reset password using a valid token."""
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    record = await firebase_service.get_reset_token(data.token)
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    if record.get("used"):
        raise HTTPException(status_code=400, detail="This reset link has already been used")

    expires_at = record.get("expires_at")
    if expires_at:
        # Firestore stores timestamps as DatetimeWithNanoseconds (timezone-aware).
        # Plain datetime objects (from tests / direct storage) are naive UTC.
        if not isinstance(expires_at, datetime):
            # Non-datetime object with .timestamp() — convert from unix epoch
            if hasattr(expires_at, "timestamp"):
                expires_at = datetime.utcfromtimestamp(expires_at.timestamp())
        elif expires_at.tzinfo is not None:
            # Timezone-aware datetime (e.g. Firestore) → strip tz for UTC comparison
            expires_at = expires_at.replace(tzinfo=None)
        if datetime.utcnow() > expires_at:
            raise HTTPException(status_code=400, detail="Reset link has expired")

    hashed = get_password_hash(data.new_password)
    updated = await firebase_service.update_user_password(record["email"], hashed)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update password")

    await firebase_service.mark_reset_token_used(data.token)
    logger.info(f"Password reset successful for {record['email']}")
    return {"message": "Password updated successfully"}

@router.get("/user/{user_id}")
async def get_user(user_id: str):
    """Get user by ID"""
    from ..core.logging_config import logger
    try:
        logger.debug(f"Getting user by ID: {user_id}")
        user = await firebase_service.get_user_by_id(user_id)
        
        if not user:
            logger.warning(f"User not found with ID: {user_id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.debug(f"User found: {user.get('email')}")
        return {
            "id": user.get('id'),
            "name": user.get('name'),
            "email": user.get('email'),
            "preferred_language": user.get('preferred_language')
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user by ID: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
