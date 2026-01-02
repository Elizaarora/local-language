from datetime import datetime
from typing import Optional
from ..models.user import UserCreate, UserLogin, User, UserInDB, Token
from ..core.security import verify_password, get_password_hash, create_access_token
from .firebase_service import firebase_service

class AuthService:
    async def register_user(self, user_data: UserCreate) -> Optional[Token]:
        """Register a new user"""
        try:
            print(f"Attempting to register user: {user_data.email}")
            
            # Check if user exists
            existing_user = await firebase_service.get_user_by_email(user_data.email)
            if existing_user:
                print(f"User already exists: {user_data.email}")
                raise Exception("Email already registered")
            
            # Hash password
            print("Hashing password...")
            hashed_password = get_password_hash(user_data.password)
            
            # Create user document
            user_dict = {
                'email': user_data.email,
                'name': user_data.name,
                'preferred_language': user_data.preferred_language,
                'hashed_password': hashed_password,
                'created_at': datetime.utcnow(),
                'is_active': True
            }
            
            # Save to Firebase
            print("Saving user to Firebase...")
            created_user = await firebase_service.create_user(user_dict)
            
            if created_user:
                print(f"User created successfully: {created_user['id']}")
                
                # Create access token
                access_token = create_access_token(
                    data={"sub": created_user['email'], "id": created_user['id']}
                )
                
                # Remove password from response
                user_response = User(
                    id=created_user['id'],
                    email=created_user['email'],
                    name=created_user['name'],
                    preferred_language=created_user['preferred_language'],
                    created_at=created_user['created_at'],
                    is_active=created_user['is_active']
                )
                
                return Token(
                    access_token=access_token,
                    user=user_response
                )
            
            raise Exception("Failed to create user")
        except Exception as e:
            print(f"Registration error: {e}")
            return None
    
    async def login_user(self, login_data: UserLogin) -> Optional[Token]:
        """Login user"""
        try:
            from ..core.logging_config import logger
            logger.info(f"Attempting to login user: {login_data.email}")
            
            # Get user from database
            user = await firebase_service.get_user_by_email(login_data.email)
            
            if not user:
                logger.warning(f"User not found: {login_data.email}")
                return None
            
            logger.debug(f"User found: {user.get('email')}, has ID: {bool(user.get('id'))}, has password: {bool(user.get('hashed_password'))}")
            
            if not user.get('hashed_password'):
                logger.error(f"User {login_data.email} has no password hash")
                return None
            
            if not user.get('id'):
                logger.error(f"User {login_data.email} has no ID")
                return None
            
            logger.debug("User found, verifying password...")
            
            # Verify password
            password_valid = verify_password(login_data.password, user['hashed_password'])
            
            logger.debug(f"Password verification result: {password_valid}")
            
            if not password_valid:
                logger.warning(f"Password verification failed for user: {login_data.email}")
                # Log hash for debugging (first 20 chars only)
                hash_preview = user['hashed_password'][:20] if user.get('hashed_password') else 'None'
                logger.debug(f"Hash preview: {hash_preview}...")
                return None
            
            logger.info("Password verified successfully")
            
            # Create access token
            access_token = create_access_token(
                data={"sub": user['email'], "id": user['id']}
            )
            
            # Handle Firestore timestamp conversion
            created_at = user.get('created_at')
            if created_at:
                try:
                    # If it's a Firestore timestamp, convert it
                    if hasattr(created_at, 'timestamp'):
                        created_at = datetime.fromtimestamp(created_at.timestamp())
                    # If it's already a datetime, use it
                    elif isinstance(created_at, datetime):
                        pass
                    # If it's a timestamp number, convert to datetime
                    elif isinstance(created_at, (int, float)):
                        created_at = datetime.fromtimestamp(created_at)
                    # If it's a string, try to parse it
                    elif isinstance(created_at, str):
                        # Try ISO format first
                        try:
                            created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        except:
                            created_at = datetime.utcnow()
                    else:
                        created_at = datetime.utcnow()
                except Exception as e:
                    logger.warning(f"Error parsing created_at: {e}, using current time")
                    created_at = datetime.utcnow()
            else:
                created_at = datetime.utcnow()
            
            # Remove password from response
            try:
                user_response = User(
                    id=user['id'],
                    email=user['email'],
                    name=user['name'],
                    preferred_language=user.get('preferred_language', 'english'),
                    created_at=created_at,
                    is_active=user.get('is_active', True)
                )
            except Exception as e:
                logger.error(f"Error creating User response: {e}")
                logger.error(f"User data: {user}")
                raise
            
            logger.info(f"Login successful for user: {user['email']}")
            
            return Token(
                access_token=access_token,
                user=user_response
            )
        except Exception as e:
            from ..core.logging_config import logger
            logger.error(f"Login error: {e}", exc_info=True)
            import traceback
            traceback.print_exc()
            return None

# Create singleton instance
auth_service = AuthService()