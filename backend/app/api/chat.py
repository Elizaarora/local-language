from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from ..models.message import Message, MessageCreate, Conversation, ConversationCreate
from ..services.firebase_service import firebase_service
from ..services.translation_service import translation_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/conversations", response_model=Conversation)
async def create_conversation(conv_data: ConversationCreate):
    """Create a new conversation"""
    conversation = {
        'participant1_id': conv_data.participant1_id,
        'participant2_id': conv_data.participant2_id,
        'created_at': datetime.utcnow(),
        'last_message_at': None
    }
    
    result = await firebase_service.create_conversation(conversation)
    
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create conversation")
    
    return result

@router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get conversation details"""
    result = await firebase_service.get_conversation(conversation_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return result

@router.post("/messages", response_model=Message)
async def send_message(message_data: MessageCreate):
    """Send a message"""
    # Translate message
    translation = await translation_service.translate_with_detection(
        message_data.text,
        message_data.translated_language or 'english'
    )
    
    message = {
        'conversation_id': message_data.conversation_id,
        'sender_id': message_data.sender_id,
        'text': message_data.text,
        'language': translation['source_language'],
        'translated_text': translation['translated_text'],
        'translated_language': translation['target_language'],
        'timestamp': datetime.utcnow(),
        'is_voice': False
    }
    
    result = await firebase_service.create_message(message)
    
    if not result:
        raise HTTPException(status_code=500, detail="Failed to send message")
    
    return result

@router.get("/messages/{conversation_id}", response_model=List[Message])
async def get_messages(conversation_id: str, limit: int = 50):
    """Get messages for a conversation"""
    messages = await firebase_service.get_messages(conversation_id, limit)
    return messages