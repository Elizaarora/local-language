import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    this.socket.on('connection_response', (data) => {
      console.log('Connection response:', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  userOnline(userId) {
    if (this.socket) {
      this.socket.emit('user_online', { user_id: userId });
    }
  }

  joinConversation(conversationId, userId) {
    if (this.socket) {
      this.socket.emit('join_conversation', {
        conversation_id: conversationId,
        user_id: userId,
      });
    }
  }

  leaveConversation(conversationId, userId) {
    if (this.socket) {
      this.socket.emit('leave_conversation', {
        conversation_id: conversationId,
        user_id: userId,
      });
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  sendTyping(conversationId, userId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', {
        conversation_id: conversationId,
        user_id: userId,
        is_typing: isTyping,
      });
    }
  }

  markMessageRead(conversationId, messageId, userId) {
    if (this.socket) {
      this.socket.emit('message_read', {
        conversation_id: conversationId,
        message_id: messageId,
        user_id: userId,
      });
    }
  }

  requestVoiceCall(conversationId, callerId) {
    if (this.socket) {
      this.socket.emit('voice_call_request', {
        conversation_id: conversationId,
        caller_id: callerId,
      });
    }
  }

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
}

export default new SocketService();