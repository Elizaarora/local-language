import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import socketService from '../services/socket';
import { Send, Mic, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, loadMessages, sendMessage, addMessage } = useChatStore();
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to socket
    const socket = socketService.connect();
    setIsConnected(true);

    // Join conversation
    socketService.joinConversation(conversationId, user.id);

    // Load existing messages
    loadMessages(conversationId);

    // Listen for new messages
    socketService.onNewMessage((data) => {
      console.log('New message received:', data);
      addMessage(data);
    });

    socketService.onJoinedConversation((data) => {
      console.log('Joined conversation:', data);
    });

    return () => {
      socketService.disconnect();
    };
  }, [conversationId, user, navigate]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        text: messageText,
        language: user.preferred_language,
        translated_language: 'english', // Will be dynamic based on partner's language
      };

      // Send via API
      await sendMessage(messageData);

      // Send via socket for real-time update
      socketService.sendMessage({
        ...messageData,
        timestamp: new Date().toISOString(),
      });

      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <h3 className="font-semibold">Partner</h3>
                  <p className="text-xs text-gray-500">
                    {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isSender = msg.sender_id === user?.id;
              return (
                <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md rounded-2xl p-4 shadow-md ${
                      isSender
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="font-medium mb-1">{msg.text}</p>
                    {msg.translated_text && msg.translated_text !== msg.text && (
                      <p
                        className={`text-sm italic border-t pt-2 mt-2 ${
                          isSender ? 'border-blue-400 text-blue-100' : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        → {msg.translated_text}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{msg.language}</span>
                      <span>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Now'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-end space-x-2">
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-all">
              <Mic className="w-6 h-6 text-gray-600" />
            </button>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="1"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Messages are automatically translated to your partner's language
          </p>
        </div>
      </div>
    </div>
  );
}