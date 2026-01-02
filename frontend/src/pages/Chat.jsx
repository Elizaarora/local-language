import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI, chatAPI, reactionsAPI, filesAPI } from '../services/api';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import useThemeStore from '../store/themeStore';
import socketService from '../services/socket';
import VoiceRecorder, { TextToSpeech } from '../components/VoiceRecorder';
import EmojiPicker from '../components/EmojiPicker';
import NotificationBell from '../components/NotificationBell';
import { Send, ArrowLeft, Languages, Moon, Sun, Search, Image as ImageIcon, Smile, MoreVertical, ThumbsUp, Heart, Meh, Frown, AlertCircle, Edit2, Trash2 } from 'lucide-react';

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, loadMessages, sendMessage, addMessage } = useChatStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [partner, setPartner] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const initChat = async () => {
      const socket = socketService.connect();
      setIsConnected(true);
      socketService.userOnline(user.id);
      socketService.joinConversation(conversationId, user.id);

      try {
        const conversation = await chatAPI.getConversation(conversationId);
        const partnerId = conversation.participant1_id === user.id 
          ? conversation.participant2_id 
          : conversation.participant1_id;
        try {
          const partnerData = await authAPI.getUserById(partnerId);
          setPartner(partnerData);
        } catch (error) {
          console.error('Error loading partner:', error);
          // Set a default partner if not found
          setPartner({
            id: partnerId,
            name: 'Unknown User',
            email: 'unknown@example.com',
            preferred_language: 'english'
          });
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
      }

      loadMessages(conversationId);

      socketService.onNewMessage((data) => {
        addMessage(data);
        if (data.sender_id !== user.id) {
          socketService.markMessageRead(conversationId, data.id, user.id);
        }
      });

      socketService.onUserTyping((data) => {
        if (data.user_id !== user.id) {
          setPartnerTyping(data.is_typing);
        }
      });

      socketService.onUserOnline((data) => {
        if (partner && data.user_id === partner.id) {
          setPartnerOnline(true);
        }
      });

      socketService.onUserOffline((data) => {
        if (partner && data.user_id === partner.id) {
          setPartnerOnline(false);
        }
      });

      socketService.onJoinedConversation((data) => {
        console.log('Joined conversation:', data);
      });
    };

    initChat();

    return () => {
      socketService.disconnect();
    };
  }, [conversationId, user, navigate, partner]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom || messages.length === 0) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [messages]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await chatAPI.searchMessages(conversationId, searchQuery);
      setSearchResults(response.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const response = await filesAPI.uploadFile(file);

      // Send message with file
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        text: response.original_filename || file.name,
        language: user.preferred_language,
        translated_language: partner?.preferred_language || 'english',
        file_url: response.url,
        file_type: response.content_type,
      };

      const savedMessage = await sendMessage(messageData);
      socketService.sendMessage({
        ...savedMessage,
        timestamp: savedMessage.timestamp || new Date().toISOString(),
      });
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await reactionsAPI.addReaction(messageId, emoji, user.id);
      // Update message in store with new reaction
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || {};
          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }
          if (!reactions[emoji].includes(user.id)) {
            reactions[emoji].push(user.id);
          }
          return { ...msg, reactions };
        }
        return msg;
      });
      // Force update - in a real app, you'd update the store properly
      setTimeout(() => loadMessages(conversationId), 500);
    } catch (error) {
      console.error('Reaction error:', error);
    }
  };

  const REACTION_EMOJIS = [
    { emoji: '👍', icon: ThumbsUp },
    { emoji: '❤️', icon: Heart },
    { emoji: '😂', icon: Smile },
    { emoji: '😮', icon: Meh },
    { emoji: '😢', icon: Frown },
    { emoji: '😡', icon: AlertCircle },
  ];

  const handleEditMessage = (message) => {
    setEditingMessage(message.id);
    setEditText(message.text);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || !editingMessage) return;
    
    try {
      const updatedMessage = await chatAPI.updateMessage(editingMessage, editText);
      // Update message in store
      const updatedMessages = messages.map(msg => 
        msg.id === editingMessage ? updatedMessage : msg
      );
      // Reload messages to get updated translation
      await loadMessages(conversationId);
      setEditingMessage(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    if (!user?.id) {
      alert('User not found. Please log in again.');
      return;
    }
    
    try {
      await chatAPI.deleteMessage(messageId, user.id);
      // Update local state immediately
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, deleted: true, text: '[Message deleted]', translated_text: '[Message deleted]' } : msg
      );
      useChatStore.getState().setMessages(updatedMessages);
      // Also reload to ensure consistency
      setTimeout(() => loadMessages(conversationId), 500);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(error.response?.data?.detail || 'Failed to delete message. Please try again.');
    }
  };

  const handleTyping = (isTyping) => {
    socketService.sendTyping(conversationId, user.id, isTyping);
  };

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    handleTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  };

  const handleVoiceTranscript = (transcript) => {
    setMessageText(prev => (prev + ' ' + transcript).trim());
    handleTyping(true);
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      setIsTranslating(true);
      handleTyping(false);

      try {
        // Auto-detect language from message text
        let detectedLanguage = user.preferred_language;
        try {
          const detectResponse = await api.post('/chat/translate', {
            text: messageText,
            target_language: partner?.preferred_language || 'english'
          });
          detectedLanguage = detectResponse.data.source_language || user.preferred_language;
        } catch (error) {
          // Fallback to user's preferred language if detection fails
          console.warn('Language detection failed, using preferred language');
        }

        const messageData = {
          conversation_id: conversationId,
          sender_id: user.id,
          text: messageText,
          language: detectedLanguage,
          translated_language: partner?.preferred_language || 'english',
        };

        setMessageText('');
        const savedMessage = await sendMessage(messageData);
        socketService.sendMessage({
          ...savedMessage,
          timestamp: savedMessage.timestamp || new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getLanguageEmoji = (language) => {
    const emojiMap = {
      'hindi': '🇮🇳', 'tamil': '🇮🇳', 'telugu': '🇮🇳', 'bengali': '🇮🇳',
      'marathi': '🇮🇳', 'gujarati': '🇮🇳', 'kannada': '🇮🇳', 'malayalam': '🇮🇳',
      'punjabi': '🇮🇳', 'odia': '🇮🇳', 'english': '🇬🇧', 'urdu': '🇵🇰',
    };
    return emojiMap[language?.toLowerCase()] || '🌐';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex flex-col md:ml-64 overflow-hidden">
      {/* Header - Professional Design */}
      <header className="bg-white/95 dark:bg-[#242530]/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-[#2d2e3a]/50 sticky top-0 z-40 flex-shrink-0">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6 dark:text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {partner ? partner.name[0].toUpperCase() : 'P'}
                  </div>
                  {partnerOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">{partner ? partner.name : 'Partner'}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {partner && (
                      <span className="flex items-center gap-1">
                        <span>{getLanguageEmoji(partner.preferred_language)}</span>
                        <span>Speaks {partner.preferred_language}</span>
                      </span>
                    )}
                    {' • '}
                    {partnerOnline ? '🟢 Online' : '⚫ Offline'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationBell />
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-lg transition-all ${showSearch ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={`p-2 rounded-lg transition-all ${showTranslation ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Languages className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Translation Info Banner - Professional */}
      <div className="bg-gradient-primary text-white py-3 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
          <Languages className="w-4 h-4" />
          <span>
            Auto-translating: You ({getLanguageEmoji(user?.preferred_language)} {user?.preferred_language}) 
            ↔️ 
            {partner && `${partner.name} (${getLanguageEmoji(partner.preferred_language)} ${partner.preferred_language})`}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
              placeholder="Search messages..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Close
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="max-w-4xl mx-auto mt-2 text-sm text-gray-600 dark:text-gray-400">
              Found {searchResults.length} result(s)
            </div>
          )}
        </div>
      )}

      {/* Messages Area - Fixed height for proper scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">Start Your Conversation!</p>
            <p className="text-gray-500 dark:text-gray-400">Messages will be automatically translated between languages</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              // Skip deleted messages
              if (msg.deleted) {
                return (
                  <div key={msg.id || index} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-md rounded-2xl p-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 italic text-sm">
                      This message was deleted
                    </div>
                  </div>
                );
              }
              
              const isSender = msg.sender_id === user?.id;
              const hasTranslation = msg.translated_text && msg.translated_text !== msg.text;
              
              return (
                <div key={msg.id || index} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01] ${
                      isSender
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                        : 'bg-white dark:bg-[#242530] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2d2e3a]'
                    }`}
                  >
                    {msg.sentiment_emoji && (
                      <div className="text-2xl mb-2">{msg.sentiment_emoji}</div>
                    )}

                    <div className="mb-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs opacity-75">
                          {getLanguageEmoji(msg.language)} {msg.language}
                        </span>
                        {!isSender && (
                          <TextToSpeech text={msg.text} language={msg.language} />
                        )}
                      </div>
                      <p className="font-medium">{msg.text}</p>
                    </div>

                    {/* File Attachment */}
                    {msg.file_url && (
                      <div className="mt-2">
                        {msg.file_type?.startsWith('image/') ? (
                          <img 
                            src={`http://localhost:8000${msg.file_url}`} 
                            alt="Attachment" 
                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                            onClick={() => window.open(`http://localhost:8000${msg.file_url}`, '_blank')}
                          />
                        ) : (
                          <a
                            href={`http://localhost:8000${msg.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 rounded-lg hover:bg-opacity-20"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm">{msg.text}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {showTranslation && hasTranslation && !msg.file_url && (
                      <div
                        className={`text-sm italic border-t pt-2 mt-2 ${
                          isSender ? 'border-blue-400 text-blue-100' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <Languages className="w-3 h-3" />
                            <span className="text-xs opacity-75">
                              {getLanguageEmoji(msg.translated_language)} {msg.translated_language}
                            </span>
                          </div>
                          {isSender && (
                            <TextToSpeech text={msg.translated_text} language={msg.translated_language} />
                          )}
                        </div>
                        <p>{msg.translated_text}</p>
                      </div>
                    )}

                    {/* Reactions */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className={`text-xs px-2 py-1 rounded-full border ${
                              userIds.includes(user.id)
                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {emoji} {userIds.length}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                          title="Add reaction"
                        >
                          <Smile className="w-4 h-4" />
                        </button>
                        {showReactions === msg.id && (
                          <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex space-x-1 z-10">
                            {REACTION_EMOJIS.map(({ emoji, icon: Icon }) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  handleReaction(msg.id, emoji);
                                  setShowReactions(null);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              >
                                <span className="text-lg">{emoji}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {isSender && (
                          <>
                            <button
                              onClick={() => handleEditMessage(msg)}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                              title="Edit message"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-xs opacity-70">
                        <span>
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Now'}
                        </span>
                        {msg.edited && <span className="ml-1 text-gray-400">(edited)</span>}
                        {isSender && msg.read && <span className="ml-1">✓✓</span>}
                      </div>
                    </div>

                    {/* Edit Message Input */}
                    {editingMessage === msg.id && (
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm resize-none"
                          rows="2"
                          autoFocus
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText('');
                            }}
                            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {partnerTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{partner?.name} is typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {isTranslating && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-t border-yellow-200 dark:border-yellow-800 py-2 px-4 flex-shrink-0">
          <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
            <span>Translating your message...</span>
          </div>
        </div>
      )}

      {/* Input Area - Enterprise Professional Design */}
      <div className="bg-white/95 dark:bg-[#242530]/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-[#2d2e3a]/50 shadow-2xl flex-shrink-0">
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-end gap-3">
            <VoiceRecorder 
              onTranscript={handleVoiceTranscript} 
              language={user?.preferred_language}
              autoTranslate={true}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="p-3 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all disabled:opacity-50 border border-slate-200 dark:border-[#2d2e3a]"
              title="Upload file"
            >
              {uploadingFile ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={handleTextChange}
                onKeyPress={handleKeyPress}
                placeholder={`Type in any of 14 Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, Assamese, Sanskrit, English)...`}
                className="w-full px-5 py-4 pr-12 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-base"
                rows="1"
                style={{ maxHeight: '150px' }}
                disabled={isTranslating}
              />
              <div className="absolute right-3 bottom-3">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isTranslating}
              className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover-lift transform hover:scale-105 disabled:transform-none"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Languages className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Auto-detects language • Supports all 14 Indian languages</span>
              <span className="sm:hidden">Auto-detects • 14 languages</span>
            </p>
            <p className="text-slate-400 dark:text-slate-500">
              <span className="hidden sm:inline">Press Enter to send • Shift+Enter for new line</span>
              <span className="sm:hidden">Enter to send</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}