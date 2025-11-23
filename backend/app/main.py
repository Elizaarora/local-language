from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from .api import auth, chat

# Create FastAPI app
app = FastAPI(
    title="Local Language Integrator API",
    version="1.0.0",
    description="Real-time translation API for Indian languages"
)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

# Wrap with Socket.IO
socket_app = socketio.ASGIApp(sio, app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)

# Root route
@app.get("/")
async def root():
    return {
        "message": "Local Language Integrator API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Socket.IO events
@sio.event
async def connect(sid, environ):
    print(f"✅ Client connected: {sid}")
    await sio.emit('connection_response', {'status': 'connected'}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")

@sio.event
async def join_conversation(sid, data):
    """User joins a conversation room"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    
    await sio.enter_room(sid, conversation_id)
    print(f"👤 User {user_id} joined conversation {conversation_id}")
    
    await sio.emit('joined_conversation', {
        'conversation_id': conversation_id,
        'user_id': user_id
    }, room=conversation_id)

@sio.event
async def send_message(sid, data):
    """Handle real-time message"""
    conversation_id = data.get('conversation_id')
    
    # Broadcast message to conversation room
    await sio.emit('new_message', data, room=conversation_id)
    print(f"📨 Message sent to conversation {conversation_id}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000, reload=True)