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
    """Send a message with automatic translation"""
    try:
        # Get recipient's preferred language from the conversation
        conversation = await firebase_service.get_conversation(message_data.conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Determine recipient
        recipient_id = conversation['participant2_id'] if conversation['participant1_id'] == message_data.sender_id else conversation['participant1_id']
        
        # Get recipient's preferred language
        recipient = await firebase_service.get_user_by_id(recipient_id)
        target_language = recipient.get('preferred_language', 'english') if recipient else 'english'
        
        # If user specified a translation language, use that
        if message_data.translated_language:
            target_language = message_data.translated_language
        
        # Translate message with automatic language detection
        translation_result = await translation_service.translate_with_detection(
            message_data.text,
            target_language
        )
        
        # Create message document
        message = {
            'conversation_id': message_data.conversation_id,
            'sender_id': message_data.sender_id,
            'text': message_data.text,
            'language': translation_result['source_language'],
            'translated_text': translation_result['translated_text'],
            'translated_language': translation_result['target_language'],
            'timestamp': datetime.utcnow(),
            'is_voice': False
        }
        
        # Save message to Firebase
        result = await firebase_service.create_message(message)
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to send message")
        
        # Update conversation's last_message_at
        await firebase_service.update_conversation_timestamp(message_data.conversation_id)
        
        return result
        
    except Exception as e:
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages/{conversation_id}", response_model=List[Message])
async def get_messages(conversation_id: str, limit: int = 50):
    """Get messages for a conversation"""
    try:
        messages = await firebase_service.get_messages(conversation_id, limit)
        return messages
    except Exception as e:
        print(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate")
async def translate_text(data: dict):
    """Manual translation endpoint"""
    try:
        text = data.get('text')
        target_lang = data.get('target_language', 'english')
        source_lang = data.get('source_language')
        
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        if source_lang:
            # Translate with specified source language
            translated = await translation_service.translate_text(text, source_lang, target_lang)
            return {
                'original_text': text,
                'source_language': source_lang,
                'translated_text': translated,
                'target_language': target_lang
            }
        else:
            # Translate with automatic detection
            result = await translation_service.translate_with_detection(text, target_lang)
            return result
            
    except Exception as e:
        print(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {
        "languages": list(translation_service.language_map.keys()),
        "language_codes": translation_service.language_map
    }