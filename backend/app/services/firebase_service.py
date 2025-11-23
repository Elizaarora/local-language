import firebase_admin
from firebase_admin import credentials, firestore, auth
from typing import Optional, Dict, Any
import os

class FirebaseService:
    def __init__(self):
        # Initialize Firebase Admin
        cred_path = os.path.join(os.path.dirname(__file__), '../../firebase-credentials.json')
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
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
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
   
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            doc = self.db.collection('users').document(user_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
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
            query = messages_ref.where('conversation_id', '==', conversation_id).order_by('timestamp').limit(limit)
            docs = query.stream()
            
            messages = []
            for doc in docs:
                messages.append(doc.to_dict())
            return messages
        except Exception as e:
            print(f"Error getting messages: {e}")
            return []

# Create singleton instance
firebase_service = FirebaseService()