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

  joinConversation(conversationId, userId) {
    if (this.socket) {
      this.socket.emit('join_conversation', {
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
}

export default new SocketService();