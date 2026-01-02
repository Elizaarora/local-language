from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

# Configure bcrypt with proper settings
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    try:
        if not plain_password or not hashed_password:
            return False
        
        # Bcrypt automatically handles passwords up to 72 bytes
        # No need to truncate manually - passlib handles this
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        import traceback
        traceback.print_exc()
        return False

def get_password_hash(password: str) -> str:
    """Hash a password"""
    try:
        if not password:
            raise ValueError("Password cannot be empty")
        # Passlib automatically handles password length limits
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Password hashing error: {e}")
        import traceback
        traceback.print_exc()
        raise

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decode JWT access token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None