from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from firebase_admin import firestore
from ..models.message import Message, MessageCreate, Conversation, ConversationCreate
from ..services.firebase_service import firebase_service
from ..services.translation_service import translation_service
from ..services.sentiment_service import sentiment_service
from ..core.logging_config import logger

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/conversations", response_model=Conversation)
async def create_conversation(conv_data: ConversationCreate):
    """Create a new conversation or return existing one"""
    try:
        convs_ref = firebase_service.db.collection('conversations')
        
        query1 = convs_ref.where('participant1_id', '==', conv_data.participant1_id)\
                         .where('participant2_id', '==', conv_data.participant2_id)\
                         .limit(1).stream()
        
        query2 = convs_ref.where('participant1_id', '==', conv_data.participant2_id)\
                         .where('participant2_id', '==', conv_data.participant1_id)\
                         .limit(1).stream()
        
        for doc in query1:
            return doc.to_dict()
        
        for doc in query2:
            return doc.to_dict()
        
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
    """Get all conversations for a user (excluding archived ones)"""
    try:
        convs_ref = firebase_service.db.collection('conversations')
        
        query1 = convs_ref.where('participant1_id', '==', user_id).stream()
        conversations1 = []
        for doc in query1:
            conv_data = doc.to_dict()
            conv_data['id'] = doc.id
            # Filter out archived conversations
            archived_by = conv_data.get('archived_by', [])
            if user_id not in archived_by:
                conversations1.append(conv_data)
        
        query2 = convs_ref.where('participant2_id', '==', user_id).stream()
        conversations2 = []
        seen_ids = {conv['id'] for conv in conversations1}
        for doc in query2:
            conv_data = doc.to_dict()
            conv_data['id'] = doc.id
            # Skip duplicates and archived conversations
            if doc.id not in seen_ids:
                archived_by = conv_data.get('archived_by', [])
                if user_id not in archived_by:
                    conversations2.append(conv_data)
                    seen_ids.add(doc.id)
        
        all_conversations = conversations1 + conversations2
        
        # Sort by last_message_at descending
        all_conversations.sort(key=lambda x: x.get('last_message_at', datetime.min), reverse=True)
        
        return all_conversations
    except Exception as e:
        logger.error(f"Get conversations error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/messages")
async def send_message(message_data: MessageCreate):
    """Send a message with automatic translation and sentiment analysis"""
    try:
        conversation = await firebase_service.get_conversation(message_data.conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        recipient_id = conversation['participant2_id'] if conversation['participant1_id'] == message_data.sender_id else conversation['participant1_id']
        
        recipient = await firebase_service.get_user_by_id(recipient_id)
        target_language = recipient.get('preferred_language', 'english') if recipient else 'english'
        
        if message_data.translated_language:
            target_language = message_data.translated_language
        
        translation_result = await translation_service.translate_with_detection(
            message_data.text,
            target_language
        )
        
        sentiment_result = sentiment_service.analyze_sentiment(message_data.text)
        
        message = {
            'conversation_id': message_data.conversation_id,
            'sender_id': message_data.sender_id,
            'text': message_data.text,
            'language': translation_result['source_language'],
            'translated_text': translation_result['translated_text'],
            'translated_language': translation_result['target_language'],
            'sentiment': sentiment_result['sentiment'],
            'sentiment_emoji': sentiment_result['emoji'],
            'sentiment_score': sentiment_result['polarity'],
            'timestamp': datetime.utcnow(),
            'is_voice': False,
            'read': False,
            'file_url': message_data.file_url,
            'file_type': message_data.file_type,
            'reactions': {}
        }
        
        result = await firebase_service.create_message(message)
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to send message")
        
        await firebase_service.update_conversation_timestamp(message_data.conversation_id)
        
        # Create notification for recipient
        try:
            sender = await firebase_service.get_user_by_id(message_data.sender_id)
            sender_name = sender.get('name', 'Someone') if sender else 'Someone'
            
            notification = {
                'user_id': recipient_id,
                'title': f'New message from {sender_name}',
                'message': message_data.text[:50] + ('...' if len(message_data.text) > 50 else ''),
                'type': 'message',
                'conversation_id': message_data.conversation_id,
                'message_id': result['id'],
                'read': False,
                'created_at': datetime.utcnow()
            }
            notification_data = await firebase_service.create_notification(notification)
            if notification_data:
                # Emit notification via Socket.IO
                try:
                    from ..core.socketio_manager import sio, online_users
                    # Find user's socket session
                    user_sessions = [sid for sid, uid in online_users.items() if uid == recipient_id]
                    for session_id in user_sessions:
                        # Emit 'notification' event (not 'new_notification') to match frontend
                        await sio.emit('notification', notification_data, room=session_id)
                        logger.info(f"✅ Notification sent to user {recipient_id} via socket")
                except Exception as socket_error:
                    from ..core.logging_config import logger
                    logger.warning(f"Failed to emit notification via socket: {socket_error}")
        except Exception as e:
            from ..core.logging_config import logger
            logger.warning(f"Failed to create notification: {e}")
        
        return result
        
    except Exception as e:
        from ..core.logging_config import logger
        logger.error(f"Error sending message: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages/{conversation_id}")
async def get_messages(conversation_id: str, limit: int = 50):
    """Get messages for a conversation"""
    try:
        messages = await firebase_service.get_messages(conversation_id, limit)
        return messages
    except Exception as e:
        from ..core.logging_config import logger
        logger.error(f"Error getting messages: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    """Mark a message as read"""
    try:
        success = await firebase_service.mark_message_read(message_id)
        if success:
            return {"status": "success", "message_id": message_id}
        raise HTTPException(status_code=500, detail="Failed to mark message as read")
    except Exception as e:
        print(f"Error marking message read: {e}")
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
            translated = await translation_service.translate_text(text, source_lang, target_lang)
            return {
                'original_text': text,
                'source_language': source_lang,
                'translated_text': translated,
                'target_language': target_lang
            }
        else:
            result = await translation_service.translate_with_detection(text, target_lang)
            return result
            
    except Exception as e:
        print(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-sentiment")
async def analyze_sentiment(data: dict):
    """Analyze sentiment of text"""
    try:
        text = data.get('text')
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        result = sentiment_service.analyze_sentiment(text)
        suggestions = sentiment_service.get_emotion_suggestions(result['sentiment'])
        
        return {
            **result,
            'suggestions': suggestions
        }
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {
        "languages": list(translation_service.language_map.keys()),
        "language_codes": translation_service.language_map
    }

@router.get("/messages/{conversation_id}/search")
async def search_messages(conversation_id: str, query: str, limit: int = 20):
    """Search messages in a conversation"""
    try:
        messages_ref = firebase_service.db.collection('messages')
        query_filter = messages_ref.where('conversation_id', '==', conversation_id)\
                                  .order_by('timestamp', direction=firestore.Query.DESCENDING)\
                                  .limit(limit)
        
        docs = query_filter.stream()
        messages = []
        
        query_lower = query.lower()
        for doc in docs:
            msg_data = doc.to_dict()
            # Simple text search
            if query_lower in msg_data.get('text', '').lower() or \
               query_lower in msg_data.get('translated_text', '').lower():
                messages.append(msg_data)
        
        return {
            "conversation_id": conversation_id,
            "query": query,
            "results": messages,
            "count": len(messages)
        }
    except Exception as e:
        from ..core.logging_config import logger
        logger.error(f"Search error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/messages/{message_id}")
async def update_message(message_id: str, data: dict):
    """Update/edit a message"""
    try:
        message_ref = firebase_service.db.collection('messages').document(message_id)
        message_doc = message_ref.get()
        
        if not message_doc.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message_data = message_doc.to_dict()
        new_text = data.get('text')
        
        if not new_text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Update message
        message_ref.update({
            'text': new_text,
            'edited': True,
            'edited_at': datetime.utcnow()
        })
        
        # Re-translate if needed
        if message_data.get('translated_language'):
            translation_result = await translation_service.translate_with_detection(
                new_text,
                message_data['translated_language']
            )
            message_ref.update({
                'translated_text': translation_result['translated_text'],
                'language': translation_result['source_language']
            })
        
        updated_message = message_ref.get().to_dict()
        updated_message['id'] = message_id
        
        return updated_message
        
    except HTTPException:
        raise
    except Exception as e:
        from ..core.logging_config import logger
        logger.error(f"Update message error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/messages/{message_id}")
async def delete_message(message_id: str, user_id: str = Query(..., description="User ID")):
    """Delete a message (only by sender)"""
    try:
        message_ref = firebase_service.db.collection('messages').document(message_id)
        message_doc = message_ref.get()
        
        if not message_doc.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message_data = message_doc.to_dict()
        
        # Only sender can delete
        if message_data.get('sender_id') != user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own messages")
        
        # Soft delete - mark as deleted instead of actually deleting
        message_ref.update({
            'deleted': True,
            'deleted_at': datetime.utcnow(),
            'text': '[Message deleted]',
            'translated_text': '[Message deleted]'
        })
        
        logger.info(f"Message {message_id} deleted by user {user_id}")
        
        return {"status": "success", "message_id": message_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete message error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, user_id: str = Query(..., description="User ID")):
    """Archive a conversation for the user"""
    try:
        conversation = await firebase_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Check if user is a participant
        if conversation['participant1_id'] != user_id and conversation['participant2_id'] != user_id:
            raise HTTPException(status_code=403, detail="You don't have access to this conversation")
        
        # Archive conversation for this user
        conv_ref = firebase_service.db.collection('conversations').document(conversation_id)
        
        # Track archived by user
        archived_by = conversation.get('archived_by', [])
        if user_id not in archived_by:
            archived_by.append(user_id)
        
        conv_ref.update({
            'archived_by': archived_by,
            'archived_at': datetime.utcnow()
        })
        
        logger.info(f"Conversation {conversation_id} archived by user {user_id}")
        
        return {"status": "success", "conversation_id": conversation_id, "message": "Conversation archived"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Archive conversation error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/messages/{message_id}/reply")
async def reply_to_message(message_id: str, reply_data: dict):
    """Reply to a specific message"""
    try:
        original_message_ref = firebase_service.db.collection('messages').document(message_id)
        original_message = original_message_ref.get()
        
        if not original_message.exists:
            raise HTTPException(status_code=404, detail="Original message not found")
        
        original_data = original_message.to_dict()
        
        # Create reply message
        reply_message = {
            'conversation_id': original_data['conversation_id'],
            'sender_id': reply_data['sender_id'],
            'text': reply_data['text'],
            'reply_to': message_id,
            'reply_to_text': original_data.get('text', '')[:50],
            'timestamp': datetime.utcnow(),
            'is_voice': False,
            'read': False,
            'reactions': {}
        }
        
        # Translate reply
        recipient_id = original_data['conversation_id']  # Get from conversation
        recipient = await firebase_service.get_user_by_id(
            original_data['participant2_id'] if original_data['participant1_id'] == reply_data['sender_id'] 
            else original_data['participant1_id']
        )
        target_language = recipient.get('preferred_language', 'english') if recipient else 'english'
        
        translation_result = await translation_service.translate_with_detection(
            reply_data['text'],
            target_language
        )
        
        reply_message.update({
            'language': translation_result['source_language'],
            'translated_text': translation_result['translated_text'],
            'translated_language': translation_result['target_language']
        })
        
        result = await firebase_service.create_message(reply_message)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        from ..core.logging_config import logger
        logger.error(f"Reply message error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/messages/{message_id}/forward")
async def forward_message(message_id: str, forward_data: dict):
    """Forward a message to another conversation"""
    try:
        original_message_ref = firebase_service.db.collection('messages').document(message_id)
        original_message = original_message_ref.get()
        
        if not original_message.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        original_data = original_message.to_dict()
        target_conversation_id = forward_data['conversation_id']
        
        # Verify target conversation exists
        target_conv = await firebase_service.get_conversation(target_conversation_id)
        if not target_conv:
            raise HTTPException(status_code=404, detail="Target conversation not found")
        
        # Create forwarded message
        forwarded_message = {
            'conversation_id': target_conversation_id,
            'sender_id': forward_data['sender_id'],
            'text': original_data.get('text', ''),
            'forwarded_from': message_id,
            'forwarded_from_conversation': original_data['conversation_id'],
            'timestamp': datetime.utcnow(),
            'is_voice': False,
            'read': False,
            'reactions': {}
        }
        
        # Translate for target conversation
        recipient_id = target_conv['participant2_id'] if target_conv['participant1_id'] == forward_data['sender_id'] else target_conv['participant1_id']
        recipient = await firebase_service.get_user_by_id(recipient_id)
        target_language = recipient.get('preferred_language', 'english') if recipient else 'english'
        
        translation_result = await translation_service.translate_with_detection(
            original_data.get('text', ''),
            target_language
        )
        
        forwarded_message.update({
            'language': translation_result['source_language'],
            'translated_text': translation_result['translated_text'],
            'translated_language': translation_result['target_language']
        })
        
        result = await firebase_service.create_message(forwarded_message)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        from ..core.logging_config import logger
        logger.error(f"Forward message error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/messages/{message_id}/star")
async def star_message(message_id: str, user_id: str = Query(..., description="User ID")):
    """Star/unstar a message"""
    try:
        message_ref = firebase_service.db.collection('messages').document(message_id)
        message_doc = message_ref.get()
        
        if not message_doc.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message_data = message_doc.to_dict()
        starred_by = message_data.get('starred_by', [])
        
        if user_id in starred_by:
            starred_by.remove(user_id)
            is_starred = False
        else:
            starred_by.append(user_id)
            is_starred = True
        
        message_ref.update({'starred_by': starred_by})
        
        logger.info(f"Message {message_id} {'starred' if is_starred else 'unstarred'} by user {user_id}")
        
        return {"status": "success", "message_id": message_id, "starred": is_starred}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Star message error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))