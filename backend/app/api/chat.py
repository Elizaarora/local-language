from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from ..models.message import Message, MessageCreate, Conversation, ConversationCreate
from ..services.firebase_service import firebase_service
from ..services.translation_service import translation_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/conversations", response_model=Conversation)
async def create_conversation(conv_data: ConversationCreate):
    """Create a new conversation or return existing one"""
    try:
        convs_ref = firebase_service.db.collection('conversations')
        
        # Check if conversation already exists (both directions)
        query1 = convs_ref.where('participant1_id', '==', conv_data.participant1_id)\
                         .where('participant2_id', '==', conv_data.participant2_id)\
                         .limit(1).stream()
        
        query2 = convs_ref.where('participant1_id', '==', conv_data.participant2_id)\
                         .where('participant2_id', '==', conv_data.participant1_id)\
                         .limit(1).stream()
        
        # Return existing conversation
        for doc in query1:
            return doc.to_dict()
        
        for doc in query2:
            return doc.to_dict()
        
        # Create new conversation
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
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get conversation details"""
    result = await firebase_service.get_conversation(conversation_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return result

@router.get("/conversations/user/{user_id}")
async def get_user_conversations(user_id: str):
    """Get all conversations for a user"""
    try:
        convs_ref = firebase_service.db.collection('conversations')
        
        # Get conversations where user is participant1
        query1 = convs_ref.where('participant1_id', '==', user_id).stream()
        conversations1 = [doc.to_dict() for doc in query1]
        
        # Get conversations where user is participant2
        query2 = convs_ref.where('participant2_id', '==', user_id).stream()
        conversations2 = [doc.to_dict() for doc in query2]
        
        # Combine and remove duplicates
        all_conversations = conversations1 + conversations2
        
        return all_conversations
    except Exception as e:
        print(f"Error getting conversations: {e}")
        return []

@router.post("/messages", response_model=Message)
async def send_message(message_data: MessageCreate):
    """Send a message with translation"""
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