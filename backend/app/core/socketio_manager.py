"""Socket.IO manager to avoid circular imports"""
import socketio

# Create Socket.IO server instance
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Track online users
online_users = {}


