from fastapi import APIRouter, HTTPException
from ..models.user import UserCreate, UserLogin, Token
from ..services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    result = await auth_service.register_user(user_data)
    
    if not result:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return result

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user"""
    result = await auth_service.login_user(login_data)
    
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return result

@router.get("/test")
async def test_auth():
    """Test authentication endpoint"""
    return {"message": "Auth API is working!"}