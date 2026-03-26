import firebase_admin
from firebase_admin import credentials, firestore, auth
from typing import Optional, Dict, Any
from datetime import datetime
import os

class FirebaseService:
    def __init__(self):
        # Initialize Firebase Admin
        from ..core.config import settings
        
        if not firebase_admin._apps:
            # Check if credentials are provided as JSON string or base64 (Render/Fly.io secrets)
            if settings.FIREBASE_CREDENTIALS_JSON:
                import json, base64
                raw = settings.FIREBASE_CREDENTIALS_JSON.strip()
                # Try direct JSON first; fall back to base64 decoding
                try:
                    cred_dict = json.loads(raw)
                except (json.JSONDecodeError, ValueError):
                    try:
                        cred_dict = json.loads(base64.b64decode(raw).decode('utf-8'))
                    except Exception as e:
                        raise ValueError(f"FIREBASE_CREDENTIALS must be valid JSON or base64-encoded JSON: {e}")
                cred = credentials.Certificate(cred_dict)
            else:
                # Use file path (local development)
                cred_path = os.path.join(os.path.dirname(__file__), '../../firebase-credentials-local-language.json')
                if os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                else:
                    raise FileNotFoundError(f"Firebase credentials not found at {cred_path}. Please set FIREBASE_CREDENTIALS environment variable.")
            
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
    
    # User operations
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            user_ref = self.db.collection('users').document()
            user_data['id'] = user_ref.id
            user_ref.set(user_data)
            return user_data
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        try:
            users_ref = self.db.collection('users')
            query = users_ref.where('email', '==', email).limit(1)
            docs = query.stream()
            
            for doc in docs:
                user_data = doc.to_dict()
                # Ensure document ID is included
                if user_data and 'id' not in user_data:
                    user_data['id'] = doc.id
                return user_data
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            import traceback
            traceback.print_exc()
            return None
   
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            doc = self.db.collection('users').document(user_id).get()
            if doc.exists:
                user_data = doc.to_dict()
                # Ensure document ID is included
                if user_data and 'id' not in user_data:
                    user_data['id'] = doc.id
                return user_data
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    async def update_user_language(self, user_id: str, language: str) -> bool:
        try:
            self.db.collection('users').document(user_id).update({
                'preferred_language': language
            })
            return True
        except Exception as e:
            print(f"Error updating user language: {e}")
            return False
    
    # Conversation operations
    async def create_conversation(self, conversation_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            conv_ref = self.db.collection('conversations').document()
            conversation_data['id'] = conv_ref.id
            conv_ref.set(conversation_data)
            return conversation_data
        except Exception as e:
            print(f"Error creating conversation: {e}")
            return None
    
    async def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        try:
            doc = self.db.collection('conversations').document(conversation_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return None
    
    async def update_conversation_timestamp(self, conversation_id: str) -> bool:
        try:
            self.db.collection('conversations').document(conversation_id).update({
                'last_message_at': datetime.utcnow()
            })
            return True
        except Exception as e:
            print(f"Error updating conversation timestamp: {e}")
            return False
    
    # Message operations
    async def create_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            msg_ref = self.db.collection('messages').document()
            message_data['id'] = msg_ref.id
            msg_ref.set(message_data)
            return message_data
        except Exception as e:
            print(f"Error creating message: {e}")
            return None
    
    async def get_messages(self, conversation_id: str, limit: int = 50):
        try:
            messages_ref = self.db.collection('messages')
            query = messages_ref.where('conversation_id', '==', conversation_id)\
                               .order_by('timestamp')\
                               .limit(limit)
            docs = query.stream()
            
            messages = []
            for doc in docs:
                messages.append(doc.to_dict())
            return messages
        except Exception as e:
            print(f"Error getting messages: {e}")
            return []
    
    async def mark_message_read(self, message_id: str) -> bool:
        """Mark a message as read"""
        try:
            self.db.collection('messages').document(message_id).update({
                'read': True,
                'read_at': datetime.utcnow()
            })
            return True
        except Exception as e:
            print(f"Error marking message read: {e}")
            return False
    
    # Notification operations
    async def create_notification(self, notification_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a notification"""
        try:
            notif_ref = self.db.collection('notifications').document()
            notification_data['id'] = notif_ref.id
            notif_ref.set(notification_data)
            return notification_data
        except Exception as e:
            print(f"Error creating notification: {e}")
            return None

    # Password reset token operations
    async def create_reset_token(self, email: str, token: str, expires_at: datetime) -> bool:
        try:
            self.db.collection('password_reset_tokens').document(token).set({
                'email': email,
                'token': token,
                'expires_at': expires_at,
                'used': False,
                'created_at': datetime.utcnow(),
            })
            return True
        except Exception as e:
            print(f"Error creating reset token: {e}")
            return False

    async def get_reset_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            doc = self.db.collection('password_reset_tokens').document(token).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting reset token: {e}")
            return None

    async def mark_reset_token_used(self, token: str) -> bool:
        try:
            self.db.collection('password_reset_tokens').document(token).update({'used': True})
            return True
        except Exception as e:
            print(f"Error marking token used: {e}")
            return False

    async def update_user_password(self, email: str, hashed_password: str) -> bool:
        try:
            users_ref = self.db.collection('users')
            query = users_ref.where('email', '==', email).limit(1)
            docs = list(query.stream())
            if not docs:
                return False
            docs[0].reference.update({'hashed_password': hashed_password})
            return True
        except Exception as e:
            print(f"Error updating password: {e}")
            return False

# Create singleton instance
firebase_service = FirebaseService()