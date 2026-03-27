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
import { useToast } from '../components/Toast';
import {
  Send, ArrowLeft, Languages, Moon, Sun, Search, Image as ImageIcon,
  Smile, MoreVertical, ThumbsUp, Heart, Meh, Frown, AlertCircle,
  Edit2, Trash2, X, Check, CheckCheck,
} from 'lucide-react';

const LANGUAGE_FLAGS = {
  hindi: '🇮🇳', tamil: '🇮🇳', telugu: '🇮🇳', bengali: '🇮🇳',
  marathi: '🇮🇳', gujarati: '🇮🇳', kannada: '🇮🇳', malayalam: '🇮🇳',
  punjabi: '🇮🇳', odia: '🇮🇳', assamese: '🇮🇳', sanskrit: '🇮🇳',
  hinglish: '🇮🇳', urdu: '🇵🇰', english: '🇬🇧',
};
const getFlag = (lang) => LANGUAGE_FLAGS[lang?.toLowerCase()] || '🌐';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, loadMessages, sendMessage, addMessage } = useChatStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const toast = useToast();

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
  const [uploadingFile, setUploadingFile] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const initChat = async () => {
      socketService.connect();
      setIsConnected(true);
      socketService.userOnline(user.id);
      socketService.joinConversation(conversationId, user.id);

      try {
        const conversation = await chatAPI.getConversation(conversationId);
        const pid = conversation.participant1_id === user.id
          ? conversation.participant2_id
          : conversation.participant1_id;
        try {
          const partnerData = await authAPI.getUserById(pid);
          setPartner(partnerData);
        } catch {
          setPartner({ id: pid, name: 'Unknown User', email: '', preferred_language: 'english' });
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
        if (data.user_id !== user.id) setPartnerTyping(data.is_typing);
      });
      socketService.onUserOnline((data) => {
        if (partner && data.user_id === partner.id) setPartnerOnline(true);
      });
      socketService.onUserOffline((data) => {
        if (partner && data.user_id === partner.id) setPartnerOnline(false);
      });
    };

    initChat();
    return () => socketService.disconnect();
  }, [conversationId, user, navigate]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (nearBottom || messages.length === 0) {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    }
  }, [messages]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    try {
      const res = await chatAPI.searchMessages(conversationId, searchQuery);
      setSearchResults(res.results || []);
    } catch { setSearchResults([]); }
  };

  const handleEmojiSelect = (emoji) => { setMessageText(p => p + emoji); };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const res = await filesAPI.uploadFile(file);
      const msgData = {
        conversation_id: conversationId, sender_id: user.id,
        text: res.original_filename || file.name,
        language: user.preferred_language,
        translated_language: partner?.preferred_language || 'english',
        file_url: res.url, file_type: res.content_type,
      };
      const saved = await sendMessage(msgData);
      socketService.sendMessage({ ...saved, timestamp: saved.timestamp || new Date().toISOString() });
    } catch { toast.error('Failed to upload file.'); }
    finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await reactionsAPI.addReaction(messageId, emoji, user.id);
      setTimeout(() => loadMessages(conversationId), 400);
    } catch (error) { console.error('Reaction error:', error); }
  };

  const handleEditMessage = (msg) => { setEditingMessage(msg.id); setEditText(msg.text); };

  const handleSaveEdit = async () => {
    if (!editText.trim() || !editingMessage) return;
    try {
      await chatAPI.updateMessage(editingMessage, editText);
      await loadMessages(conversationId);
    } catch { toast.error('Failed to edit message.'); }
    finally { setEditingMessage(null); setEditText(''); }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await chatAPI.deleteMessage(messageId, user.id);
      useChatStore.getState().setMessages(
        messages.map(m => m.id === messageId
          ? { ...m, deleted: true, text: '[Message deleted]', translated_text: '[Message deleted]' }
          : m)
      );
      setTimeout(() => loadMessages(conversationId), 400);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete message.');
    }
  };

  const handleTyping = (isTyping) => socketService.sendTyping(conversationId, user.id, isTyping);

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    handleTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => handleTyping(false), 1000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    setIsTranslating(true);
    handleTyping(false);
    try {
      let detectedLanguage = user.preferred_language;
      try {
        const detectRes = await api.post('/chat/translate', {
          text: messageText,
          target_language: partner?.preferred_language || 'english',
        });
        detectedLanguage = detectRes.data.source_language || user.preferred_language;
      } catch { /* fallback */ }

      const msgData = {
        conversation_id: conversationId, sender_id: user.id,
        text: messageText, language: detectedLanguage,
        translated_language: partner?.preferred_language || 'english',
      };
      setMessageText('');
      const saved = await sendMessage(msgData);
      socketService.sendMessage({ ...saved, timestamp: saved.timestamp || new Date().toISOString() });
    } catch { toast.error('Failed to send message.'); }
    finally { setIsTranslating(false); }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <div className="h-screen flex flex-col md:ml-64 bg-slate-50 dark:bg-[#0f0f14] overflow-hidden">

      {/* ── Header ── */}
      <header className="glass-strong border-b border-slate-200/60 dark:border-[#2d2e3a]/60 flex-shrink-0 z-40 shadow-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/home')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
                <ArrowLeft className="w-5 h-5 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {partner ? partner.name[0].toUpperCase() : 'P'}
                  </div>
                  {partnerOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#242530]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold dark:text-white text-sm">{partner?.name || 'Loading…'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    {partner && (
                      <>
                        <span>{getFlag(partner.preferred_language)}</span>
                        <span className="capitalize">{partner.preferred_language}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      </>
                    )}
                    <span className={partnerOnline ? 'text-green-500 font-medium' : ''}>
                      {partnerOnline ? '● Online' : '○ Offline'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              <NotificationBell />
              <button onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-xl transition-all ${showSearch ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-slate-100 dark:hover:bg-[#2d2e3a]'}`}>
                <Search className="w-5 h-5 dark:text-slate-300" />
              </button>
              <button onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button onClick={() => setShowTranslation(!showTranslation)}
                className={`p-2 rounded-xl transition-all ${showTranslation ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-[#2d2e3a] text-slate-500 dark:text-slate-400'}`}
                title={showTranslation ? 'Hide translations' : 'Show translations'}>
                <Languages className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Translation banner */}
      <div className="bg-gradient-primary text-white py-2 px-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs font-medium">
          <Languages className="w-3.5 h-3.5" />
          <span>
            Auto-translating: {getFlag(user?.preferred_language)} {user?.preferred_language}
            {' ↔ '}
            {partner ? `${getFlag(partner.preferred_language)} ${partner.preferred_language}` : '…'}
          </span>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="bg-white dark:bg-[#242530] border-b border-slate-200 dark:border-[#2d2e3a] p-3 flex-shrink-0 animate-slide-down">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text" value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); handleSearch(); }}
              placeholder="Search messages…"
              className="flex-1 bg-transparent text-sm dark:text-white focus:outline-none placeholder-slate-400"
              autoFocus
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <p className="max-w-4xl mx-auto mt-1 text-xs text-slate-500 dark:text-slate-400 pl-6">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,.04) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,.04) 0%, transparent 60%)',
        }}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl animate-float">
                <Languages className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Start the Conversation!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                Messages are automatically translated so you both understand each other perfectly.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              if (msg.deleted) {
                return (
                  <div key={msg.id || index} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-xs px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#2d2e3a] text-slate-400 dark:text-slate-500 italic text-sm">
                      This message was deleted
                    </div>
                  </div>
                );
              }

              const isSender = msg.sender_id === user?.id;
              const hasTranslation = msg.translated_text && msg.translated_text !== msg.text;

              return (
                <div
                  key={msg.id || index}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'} group animate-fade-in`}
                  style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
                >
                  {/* Receiver avatar */}
                  {!isSender && (
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-2 mt-1 shadow-sm">
                      {partner?.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                  )}

                  <div className="max-w-[78%] sm:max-w-sm md:max-w-md">
                    {/* Bubble */}
                    <div className={`relative px-4 py-3 shadow-md transition-all duration-200
                      ${isSender ? 'msg-bubble-sender' : 'msg-bubble-receiver'}
                    `}>
                      {msg.sentiment_emoji && (
                        <div className="text-xl mb-1.5">{msg.sentiment_emoji}</div>
                      )}

                      {/* Language tag */}
                      <div className={`flex items-center justify-between mb-1.5 ${isSender ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-xs flex items-center gap-1 ${isSender ? 'text-blue-200' : 'text-slate-400'}`}>
                          {getFlag(msg.language)} <span className="capitalize">{msg.language}</span>
                        </span>
                        {!isSender && <TextToSpeech text={msg.text} language={msg.language} />}
                      </div>

                      <p className="text-sm leading-relaxed font-medium">{msg.text}</p>

                      {/* File attachment */}
                      {msg.file_url && (
                        <div className="mt-2">
                          {msg.file_type?.startsWith('image/') ? (
                            <img
                              src={`http://localhost:8000${msg.file_url}`} alt="Attachment"
                              className="max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(`http://localhost:8000${msg.file_url}`, '_blank')}
                            />
                          ) : (
                            <a href={`http://localhost:8000${msg.file_url}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-black/10 dark:bg-white/10 rounded-xl hover:bg-black/20 transition-colors">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-xs truncate">{msg.text}</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Translation */}
                      {showTranslation && hasTranslation && !msg.file_url && (
                        <div className={`mt-2 pt-2 border-t text-xs italic
                          ${isSender ? 'border-white/20 text-blue-100' : 'border-slate-200 dark:border-[#353642] text-slate-500 dark:text-slate-400'}`}>
                          <div className={`flex items-center gap-1.5 mb-1 ${isSender ? 'flex-row-reverse' : ''}`}>
                            <Languages className="w-3 h-3 flex-shrink-0" />
                            <span className="capitalize">{msg.translated_language}</span>
                            {isSender && <TextToSpeech text={msg.translated_text} language={msg.translated_language} />}
                          </div>
                          <p>{msg.translated_text}</p>
                        </div>
                      )}

                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                            <button key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`text-xs px-2 py-0.5 rounded-full border transition-all
                                ${userIds.includes(user.id)
                                  ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700'
                                  : 'bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/10'
                                }`}>
                              {emoji} {userIds.length}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Edit input */}
                      {editingMessage === msg.id && (
                        <div className="mt-2 animate-slide-down">
                          <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            rows={2}
                            autoFocus
                            className="w-full px-3 py-2 rounded-xl text-sm bg-white/20 dark:bg-black/20
                              border border-white/30 dark:border-white/10 text-inherit resize-none
                              focus:outline-none focus:ring-2 focus:ring-white/40"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={handleSaveEdit}
                              className="px-3 py-1.5 bg-white text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1">
                              <Check className="w-3 h-3" /> Save
                            </button>
                            <button onClick={() => { setEditingMessage(null); setEditText(''); }}
                              className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-medium hover:bg-white/30 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message meta row */}
                    <div className={`flex items-center gap-2 mt-1 px-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
                      {/* Reaction button (hover) */}
                      <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
                          <Smile className="w-3.5 h-3.5" />
                        </button>
                        {showReactions === msg.id && (
                          <div className={`absolute bottom-full mb-1 bg-white dark:bg-[#242530] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2d2e3a] p-2 flex gap-1 z-20 animate-scale-in ${isSender ? 'right-0' : 'left-0'}`}>
                            {REACTION_EMOJIS.map(emoji => (
                              <button key={emoji}
                                onClick={() => { handleReaction(msg.id, emoji); setShowReactions(null); }}
                                className="text-lg hover:scale-125 transition-transform p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a]">
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Edit / Delete (sender only, hover) */}
                      {isSender && (
                        <>
                          <button onClick={() => handleEditMessage(msg)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Timestamp */}
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Now'}
                        {msg.edited && <span className="ml-1">(edited)</span>}
                      </span>
                      {isSender && msg.read && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {partnerTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                {partner?.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div className="bg-white dark:bg-[#242530] border border-slate-200 dark:border-[#2d2e3a] rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot bg-slate-400 dark:bg-slate-500" />
                  <span className="typing-dot bg-slate-400 dark:bg-slate-500" />
                  <span className="typing-dot bg-slate-400 dark:bg-slate-500" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Translating indicator */}
      {isTranslating && (
        <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 py-2 px-4">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Translating your message…
          </div>
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="glass-strong border-t border-slate-200/60 dark:border-[#2d2e3a]/60 flex-shrink-0 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-4 pr-20 md:pr-4">
          <div className="flex items-end gap-2">
            <VoiceRecorder
              onTranscript={(t) => { setMessageText(p => (p + ' ' + t).trim()); handleTyping(true); }}
              language={user?.preferred_language}
              autoTranslate
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl border border-slate-200 dark:border-[#2d2e3a] transition-all disabled:opacity-50 flex-shrink-0"
              title="Upload file">
              {uploadingFile
                ? <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                : <ImageIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />

            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your message in any language…"
                className="w-full px-4 py-3 pr-12 border-2 border-slate-200 dark:border-[#2d2e3a]
                  dark:bg-[#1a1b23] dark:text-white rounded-2xl
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  resize-none transition-all text-sm"
                rows={1}
                style={{ maxHeight: '120px' }}
                disabled={isTranslating}
              />
              <div className="absolute right-2 bottom-2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isTranslating}
              className="p-3.5 bg-gradient-primary hover:opacity-90 text-white rounded-2xl
                hover:shadow-lg hover:shadow-blue-500/30 transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                flex-shrink-0 btn-ripple"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 flex-shrink-0" />
            Auto-detects language · Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
