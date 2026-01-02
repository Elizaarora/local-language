from fastapi import APIRouter, HTTPException
from typing import Dict, List
from ..services.firebase_service import firebase_service
from ..core.logging_config import logger

router = APIRouter(prefix="/reactions", tags=["Reactions"])

@router.post("/messages/{message_id}/react")
async def add_reaction(message_id: str, data: dict):
    """Add or remove reaction to a message"""
    try:
        emoji = data.get('emoji')
        user_id = data.get('user_id')
        action = data.get('action', 'add')  # 'add' or 'remove'
        
        if not emoji or not user_id:
            raise HTTPException(status_code=400, detail="emoji and user_id are required")
        
        # Get message
        message_ref = firebase_service.db.collection('messages').document(message_id)
        message_doc = message_ref.get()
        
        if not message_doc.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message_data = message_doc.to_dict()
        reactions = message_data.get('reactions', {})
        
        # Initialize emoji list if not exists
        if emoji not in reactions:
            reactions[emoji] = []
        
        # Add or remove user
        if action == 'add':
            if user_id not in reactions[emoji]:
                reactions[emoji].append(user_id)
        elif action == 'remove':
            if user_id in reactions[emoji]:
                reactions[emoji].remove(user_id)
                # Remove emoji key if empty
                if not reactions[emoji]:
                    del reactions[emoji]
        else:
            raise HTTPException(status_code=400, detail="action must be 'add' or 'remove'")
        
        # Update message
        message_ref.update({'reactions': reactions})
        
        logger.info(f"Reaction {action}ed: {emoji} by {user_id} on message {message_id}")
        
        return {
            "status": "success",
            "message_id": message_id,
            "reactions": reactions
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reaction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages/{message_id}")
async def get_message_reactions(message_id: str):
    """Get all reactions for a message"""
    try:
        message_ref = firebase_service.db.collection('messages').document(message_id)
        message_doc = message_ref.get()
        
        if not message_doc.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message_data = message_doc.to_dict()
        reactions = message_data.get('reactions', {})
        
        return {
            "message_id": message_id,
            "reactions": reactions
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get reactions error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

