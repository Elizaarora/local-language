from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from firebase_admin import firestore
from ..services.firebase_service import firebase_service
from ..core.logging_config import logger

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/user/{user_id}")
async def get_user_notifications(user_id: str, limit: int = 50):
    """Get notifications for a user"""
    try:
        notifications_ref = firebase_service.db.collection('notifications')
        # Query without order_by to avoid index requirement
        # Just filter by user_id - no ordering in query
        query = notifications_ref.where('user_id', '==', user_id)
        
        docs = query.stream()
        notifications = []
        
        for doc in docs:
            try:
                notif_data = doc.to_dict()
                notif_data['id'] = doc.id
                notifications.append(notif_data)
            except Exception as doc_error:
                logger.warning(f"Error processing notification doc {doc.id}: {doc_error}")
                continue
        
        # Sort by created_at in Python (descending - newest first)
        # Handle Firestore Timestamp objects
        try:
            from google.cloud.firestore import Timestamp as FirestoreTimestamp
            
            def get_sort_key(notif):
                created_at = notif.get('created_at')
                if created_at is None:
                    return datetime.min
                # Convert Firestore Timestamp to datetime if needed
                if hasattr(created_at, 'to_datetime'):
                    return created_at.to_datetime()
                elif isinstance(created_at, datetime):
                    return created_at
                elif isinstance(created_at, (int, float)):
                    # Handle Unix timestamp
                    return datetime.fromtimestamp(created_at)
                else:
                    return datetime.min
            
            notifications.sort(key=get_sort_key, reverse=True)
        except Exception as sort_error:
            logger.warning(f"Error sorting notifications: {sort_error}")
            # If sorting fails, just return as-is
        
        # Limit after sorting
        notifications = notifications[:limit]
        
        # Return in format expected by frontend
        return {
            "notifications": notifications,
            "count": len(notifications)
        }
    except Exception as e:
        error_str = str(e).lower()
        logger.error(f"Get notifications error: {e}", exc_info=True)
        # If it's an index error, return empty list instead of error
        if 'index' in error_str or 'failedprecondition' in error_str:
            logger.warning("Firestore index not created. Returning empty notifications list.")
            return []
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark a notification as read"""
    try:
        notification_ref = firebase_service.db.collection('notifications').document(notification_id)
        notification_ref.update({
            'read': True,
            'read_at': datetime.utcnow()
        })
        return {"status": "success", "notification_id": notification_id}
    except Exception as e:
        logger.error(f"Mark notification read error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mark-all-read/{user_id}")
async def mark_all_read(user_id: str):
    """Mark all notifications as read for a user"""
    try:
        notifications_ref = firebase_service.db.collection('notifications')
        query = notifications_ref.where('user_id', '==', user_id)\
                               .where('read', '==', False)
        
        docs = query.stream()
        batch = firebase_service.db.batch()
        count = 0
        
        for doc in docs:
            doc_ref = firebase_service.db.collection('notifications').document(doc.id)
            batch.update(doc_ref, {
                'read': True,
                'read_at': datetime.utcnow()
            })
            count += 1
        
        if count > 0:
            batch.commit()
        
        return {"status": "success", "marked_read": count}
    except Exception as e:
        logger.error(f"Mark all read error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/unread-count/{user_id}")
async def get_unread_count(user_id: str):
    """Get count of unread notifications"""
    try:
        notifications_ref = firebase_service.db.collection('notifications')
        query = notifications_ref.where('user_id', '==', user_id)\
                               .where('read', '==', False)
        
        docs = query.stream()
        count = sum(1 for _ in docs)
        
        return {"unread_count": count}
    except Exception as e:
        logger.error(f"Get unread count error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str):
    """Delete a notification"""
    try:
        firebase_service.db.collection('notifications').document(notification_id).delete()
        return {"status": "success", "notification_id": notification_id}
    except Exception as e:
        logger.error(f"Delete notification error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

