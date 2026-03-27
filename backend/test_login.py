"""
Quick test script to verify login functionality
Run with: python test_login.py <email> <password>
"""
import asyncio
import sys
from app.services.firebase_service import firebase_service
from app.core.security import verify_password

async def test_login(email, password):
    print(f"Testing login for: {email}")
    
    # Get user
    user = await firebase_service.get_user_by_email(email)
    
    if not user:
        print("❌ User not found")
        return False
    
    print(f"✅ User found: {user.get('name')}")
    print(f"   ID: {user.get('id')}")
    print(f"   Has password hash: {bool(user.get('hashed_password'))}")
    
    if not user.get('hashed_password'):
        print("❌ User has no password hash")
        return False
    
    # Test password
    hash_preview = user['hashed_password'][:30] if user.get('hashed_password') else 'None'
    print(f"   Hash preview: {hash_preview}...")
    
    is_valid = verify_password(password, user['hashed_password'])
    print(f"   Password valid: {is_valid}")
    
    if is_valid:
        print("✅ Login would succeed!")
        return True
    else:
        print("❌ Password verification failed")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python test_login.py <email> <password>")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    
    result = asyncio.run(test_login(email, password))
    sys.exit(0 if result else 1)


