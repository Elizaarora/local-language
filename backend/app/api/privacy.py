from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..services.firebase_service import firebase_service
from ..core.logging_config import logger

router = APIRouter(prefix="/privacy", tags=["Privacy"])

@router.post("/block/{user_id}")
async def block_user(blocker_id: str, blocked_id: str):
    """Block a user"""
    try:
        user_ref = firebase_service.db.collection('users').document(blocker_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        blocked_users = user_data.get('blocked_users', [])
        
        if blocked_id not in blocked_users:
            blocked_users.append(blocked_id)
            user_ref.update({'blocked_users': blocked_users})
        
        return {"status": "success", "blocked_user_id": blocked_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Block user error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/unblock/{user_id}")
async def unblock_user(unblocker_id: str, unblocked_id: str):
    """Unblock a user"""
    try:
        user_ref = firebase_service.db.collection('users').document(unblocker_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        blocked_users = user_data.get('blocked_users', [])
        
        if unblocked_id in blocked_users:
            blocked_users.remove(unblocked_id)
            user_ref.update({'blocked_users': blocked_users})
        
        return {"status": "success", "unblocked_user_id": unblocked_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unblock user error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/blocked/{user_id}")
async def get_blocked_users(user_id: str):
    """Get list of blocked users"""
    try:
        user = await firebase_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        blocked_ids = user.get('blocked_users', [])
        
        # Get user details for blocked users
        blocked_users = []
        for blocked_id in blocked_ids:
            blocked_user = await firebase_service.get_user_by_id(blocked_id)
            if blocked_user:
                blocked_users.append({
                    'id': blocked_user['id'],
                    'name': blocked_user.get('name', 'Unknown'),
                    'email': blocked_user.get('email', ''),
                    'phone_number': blocked_user.get('phone_number', '')
                })
        
        return {"blocked_users": blocked_users}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get blocked users error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/settings/{user_id}")
async def update_privacy_settings(user_id: str, settings: dict):
    """Update user privacy settings"""
    try:
        user_ref = firebase_service.db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Allowed privacy settings
        allowed_settings = [
            'show_online_status',
            'show_last_seen',
            'allow_read_receipts',
            'allow_typing_indicators',
            'profile_visibility',
            'who_can_message_me'
        ]
        
        update_data = {k: v for k, v in settings.items() if k in allowed_settings}
        user_ref.update(update_data)
        
        return {"status": "success", "settings": update_data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update privacy settings error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/settings/{user_id}")
async def get_privacy_settings(user_id: str):
    """Get user privacy settings"""
    try:
        user = await firebase_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        settings = {
            'show_online_status': user.get('show_online_status', True),
            'show_last_seen': user.get('show_last_seen', True),
            'allow_read_receipts': user.get('allow_read_receipts', True),
            'allow_typing_indicators': user.get('allow_typing_indicators', True),
            'profile_visibility': user.get('profile_visibility', 'everyone'),
            'who_can_message_me': user.get('who_can_message_me', 'everyone')
        }
        
        return settings
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get privacy settings error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

