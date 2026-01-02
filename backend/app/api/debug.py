from fastapi import APIRouter, HTTPException
from ..services.firebase_service import firebase_service
from ..core.security import verify_password, get_password_hash
from ..core.logging_config import logger

router = APIRouter(prefix="/debug", tags=["Debug"])

@router.post("/test-password")
async def test_password(email: str, password: str):
    """Test password verification for debugging (REMOVE IN PRODUCTION)"""
    try:
        user = await firebase_service.get_user_by_email(email)
        
        if not user:
            return {"error": "User not found", "email": email}
        
        hashed = user.get('hashed_password')
        if not hashed:
            return {"error": "User has no password hash", "email": email}
        
        is_valid = verify_password(password, hashed)
        
        return {
            "email": email,
            "has_password_hash": bool(hashed),
            "password_valid": is_valid,
            "hash_length": len(hashed) if hashed else 0,
            "hash_prefix": hashed[:20] if hashed else None
        }
    except Exception as e:
        logger.error(f"Debug password test error: {e}", exc_info=True)
        return {"error": str(e)}

