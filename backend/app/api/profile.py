from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional
from ..models.user import User
from ..services.firebase_service import firebase_service
from ..core.logging_config import logger
import aiofiles
import os
import uuid

router = APIRouter(prefix="/profile", tags=["Profile"])

AVATAR_DIR = "uploads/avatars"
if not os.path.exists(AVATAR_DIR):
    os.makedirs(AVATAR_DIR)

@router.get("/{user_id}")
async def get_profile(user_id: str):
    """Get user profile"""
    try:
        user = await firebase_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove sensitive data
        user.pop('hashed_password', None)
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get profile error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}")
async def update_profile(user_id: str, data: dict):
    """Update user profile"""
    try:
        user = await firebase_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Allowed fields to update
        allowed_fields = ['name', 'preferred_language', 'avatar_url', 'bio']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        # Update in Firebase
        user_ref = firebase_service.db.collection('users').document(user_id)
        user_ref.update(update_data)
        
        logger.info(f"Profile updated for user {user_id}")
        
        # Get updated user
        updated_user = await firebase_service.get_user_by_id(user_id)
        updated_user.pop('hashed_password', None)
        
        return updated_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update profile error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/avatar")
async def upload_avatar(user_id: str, file: UploadFile = File(...)):
    """Upload user avatar"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        content = await file.read()
        
        # Validate file size (max 2MB)
        if len(content) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size must be less than 2MB")
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
        unique_filename = f"{user_id}_{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(AVATAR_DIR, unique_filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Generate URL
        avatar_url = f"/files/avatars/{unique_filename}"
        
        # Update user profile
        user_ref = firebase_service.db.collection('users').document(user_id)
        user_ref.update({'avatar_url': avatar_url})
        
        logger.info(f"Avatar uploaded for user {user_id}")
        
        return {
            "avatar_url": avatar_url,
            "filename": unique_filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Avatar upload error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to upload avatar")

