from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
import socketio
from .api import auth, chat, files, reactions, profile, notifications, privacy
from .core.config import settings
from .core.logging_config import logger
from .core.socketio_manager import sio, online_users
from .middleware.rate_limit import rate_limit_middleware
import os

# Create FastAPI app
# Disable docs in production for security
docs_enabled = settings.ENVIRONMENT == "development"
app = FastAPI(
    title="Local Language Integrator API",
    version="2.0.0",
    description="Real-time translation with sentiment analysis",
    docs_url="/docs" if docs_enabled else None,
    redoc_url="/redoc" if docs_enabled else None
) 

# Wrap with Socket.IO
socket_app = socketio.ASGIApp(sio, app)

# CORS middleware - MUST be after Socket.IO wrap
cors_origins_str = os.getenv("CORS_ORIGINS", settings.CORS_ORIGINS)
cors_origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
@app.middleware("http")
async def rate_limit(request: Request, call_next):
    return await rate_limit_middleware(request, call_next)

# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail} | Path: {request.url.path} | Method: {request.method}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."}
    )

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(files.router)
app.include_router(reactions.router)
app.include_router(profile.router)
app.include_router(notifications.router)
app.include_router(privacy.router)

# Mount static files for uploads
uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
if not os.path.exists(os.path.join(uploads_dir, "avatars")):
    os.makedirs(os.path.join(uploads_dir, "avatars"))

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Debug router (only in development)
if settings.ENVIRONMENT == "development":
    try:
        from .api import debug
        app.include_router(debug.router)
    except ImportError:
        logger.warning("Debug router not available")

# online_users is imported from socketio_manager

@app.get("/")
async def root():
    return {
        "message": "Local Language Integrator API",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Real-time translation",
            "Sentiment analysis",
            "Voice input/output",
            "Read receipts",
            "Typing indicators",
            "Online status"
        ]
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "online_users": len(online_users)}

# Socket.IO events
@sio.event
async def connect(sid, environ):
    logger.info(f"✅ Client connected: {sid}")
    await sio.emit('connection_response', {'status': 'connected', 'sid': sid}, room=sid)

@sio.event
async def disconnect(sid):
    logger.info(f"❌ Client disconnected: {sid}")
    if sid in online_users:
        user_id = online_users[sid]
        del online_users[sid]
        await sio.emit('user_offline', {'user_id': user_id})

@sio.event
async def user_online(sid, data):
    """Track user online status"""
    user_id = data.get('user_id')
    online_users[sid] = user_id
    logger.info(f"👤 User {user_id} is online (sid: {sid})")
    await sio.emit('user_online', {'user_id': user_id})

@sio.event
async def join_conversation(sid, data):
    """User joins a conversation room"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    
    await sio.enter_room(sid, conversation_id)
    logger.info(f"👤 User {user_id} joined conversation {conversation_id}")
    
    await sio.emit('joined_conversation', {
        'conversation_id': conversation_id,
        'user_id': user_id
    }, room=conversation_id)

@sio.event
async def leave_conversation(sid, data):
    """User leaves a conversation room"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    
    await sio.leave_room(sid, conversation_id)
    logger.info(f"👤 User {user_id} left conversation {conversation_id}")

@sio.event
async def send_message(sid, data):
    """Handle real-time message"""
    conversation_id = data.get('conversation_id')
    logger.info(f"📨 Message sent to conversation {conversation_id}")
    await sio.emit('new_message', data, room=conversation_id)

@sio.event
async def typing(sid, data):
    """Handle typing indicator"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    is_typing = data.get('is_typing', True)
    
    await sio.emit('user_typing', {
        'conversation_id': conversation_id,
        'user_id': user_id,
        'is_typing': is_typing
    }, room=conversation_id, skip_sid=sid)
    
    logger.debug(f"⌨️ User {user_id} typing: {is_typing}")

@sio.event
async def message_read(sid, data):
    """Handle read receipt"""
    conversation_id = data.get('conversation_id')
    message_id = data.get('message_id')
    user_id = data.get('user_id')
    
    await sio.emit('message_read', {
        'message_id': message_id,
        'user_id': user_id
    }, room=conversation_id)
    
    logger.debug(f"✓✓ Message {message_id} read by {user_id}")

@sio.event
async def voice_call_request(sid, data):
    """Handle voice call request"""
    conversation_id = data.get('conversation_id')
    caller_id = data.get('caller_id')
    
    await sio.emit('incoming_call', {
        'conversation_id': conversation_id,
        'caller_id': caller_id
    }, room=conversation_id, skip_sid=sid)
    
    logger.info(f"📞 Call request from {caller_id}")

@sio.event
async def new_notification(sid, data):
    """Send notification to user"""
    user_id = data.get('user_id')
    notification = data.get('notification')
    
    # Find all sessions for this user
    user_sessions = [sid for sid, uid in online_users.items() if uid == user_id]
    
    for session_id in user_sessions:
        await sio.emit('notification', notification, room=session_id)
    
    logger.info(f"🔔 Notification sent to user {user_id}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000, reload=True)