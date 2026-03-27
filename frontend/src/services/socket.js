import { io } from 'socket.io-client';

// Auto-detect production URL — works even when env vars are not set in Vercel
const IS_LOCAL = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const PRODUCTION_BACKEND = 'https://local-language-backend.onrender.com';

function resolveUrl(envVar) {
  if (envVar && !envVar.includes('your-backend-url') && !envVar.includes('placeholder')) {
    return envVar;
  }
  return IS_LOCAL ? 'http://localhost:8000' : PRODUCTION_BACKEND;
}

const SOCKET_URL = resolveUrl(import.meta.env.VITE_SOCKET_URL);
console.log('🔧 Socket URL:', SOCKET_URL);

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    // stored for auto-rejoin after reconnect
    this._userId = null;
    this._conversationId = null;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    console.log('Connecting to socket server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    // On reconnect, re-announce presence and re-join the room
    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconnected — rejoining room');
      if (this._userId) {
        this.socket.emit('user_online', { user_id: this._userId });
      }
      if (this._conversationId && this._userId) {
        this.socket.emit('join_conversation', {
          conversation_id: this._conversationId,
          user_id: this._userId,
        });
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this._conversationId = null;
      this._userId = null;
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  userOnline(userId) {
    // Store for reconnect; socket.io buffers the emit until connected
    this._userId = userId;
    if (this.socket) {
      this.socket.emit('user_online', { user_id: userId });
    }
  }

  joinConversation(conversationId, userId) {
    // Store for reconnect; socket.io buffers the emit until connected
    this._conversationId = conversationId;
    this._userId = userId;
    if (this.socket) {
      this.socket.emit('join_conversation', {
        conversation_id: conversationId,
        user_id: userId,
      });
    }
  }

  leaveConversation(conversationId, userId) {
    this._conversationId = null;
    if (this.socket) {
      this.socket.emit('leave_conversation', {
        conversation_id: conversationId,
        user_id: userId,
      });
    }
  }

  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      console.log('Sending message via socket:', messageData);
      this.socket.emit('send_message', messageData);
    }
  }

  sendTyping(conversationId, userId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        conversation_id: conversationId,
        user_id: userId,
        is_typing: isTyping,
      });
    }
  }

  markMessageRead(conversationId, messageId, userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_read', {
        conversation_id: conversationId,
        message_id: messageId,
        user_id: userId,
      });
    }
  }

  requestVoiceCall(conversationId, callerId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('voice_call_request', {
        conversation_id: conversationId,
        caller_id: callerId,
      });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onJoinedConversation(callback) {
    if (this.socket) {
      this.socket.on('joined_conversation', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on('message_read', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  onIncomingCall(callback) {
    if (this.socket) {
      this.socket.on('incoming_call', callback);
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Remove specific event listeners
  offNewMessage() {
    if (this.socket) {
      this.socket.off('new_message');
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();