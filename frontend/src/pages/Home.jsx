import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useChatStore from '../store/chatStore';
import api, { authAPI, chatAPI } from '../services/api';
import { Languages, LogOut, MessageSquare, Plus, User, RefreshCw, Globe, Moon, Sun, Settings, BarChart3, HelpCircle, Info, Trash2, MoreVertical } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

export default function Home() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { createConversation } = useChatStore();
  const navigate = useNavigate();
  const [showNewChat, setShowNewChat] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadUserConversations();
    }
  }, [user, navigate]);

  const loadUserConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/chat/conversations/user/${user.id}`);
      setConversations(response.data);
      
      for (const conv of response.data) {
        const partnerId = conv.participant1_id === user.id 
          ? conv.participant2_id 
          : conv.participant1_id;
        
        try {
          const partnerData = await authAPI.getUserById(partnerId);
          setPartners(prev => ({ ...prev, [partnerId]: partnerData }));
        } catch (error) {
          // Partner might not exist or was deleted - skip silently
          console.warn(`Partner ${partnerId} not found, skipping`);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartChat = async () => {
    if (partnerEmail.trim()) {
      try {
        const partner = await authAPI.searchUser(partnerEmail);
        const conversation = await createConversation(user.id, partner.id);
        
        if (conversation) {
          setShowNewChat(false);
          setPartnerEmail('');
          await loadUserConversations();
          navigate(`/chat/${conversation.id}`);
        }
      } catch (error) {
        alert(error.response?.data?.detail || 'User not found. Please check the email.');
      }
    }
  };

  const getLanguageEmoji = (language) => {
    const emojiMap = {
      'hindi': '🇮🇳', 'tamil': '🇮🇳', 'telugu': '🇮🇳', 'bengali': '🇮🇳',
      'marathi': '🇮🇳', 'gujarati': '🇮🇳', 'kannada': '🇮🇳', 'malayalam': '🇮🇳',
      'punjabi': '🇮🇳', 'odia': '🇮🇳', 'english': '🇬🇧', 'urdu': '🇵🇰',
      'assamese': '🇮🇳', 'sanskrit': '🇮🇳',
    };
    return emojiMap[language?.toLowerCase()] || '🌐';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#1a1b23] dark:via-[#1f2029] dark:to-[#1a1b23] md:ml-64 animate-fade-in">
      {/* Header - Professional Design */}
      <header className="bg-white/90 dark:bg-[#242530]/90 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-[#2d2e3a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-3 rounded-2xl shadow-lg">
                <Languages className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
                  Local Language Integrator
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <div className="text-right">
                <p className="text-sm font-medium dark:text-white">{user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                  <span>{getLanguageEmoji(user.preferred_language)}</span>
                  <span>Language: {user.preferred_language}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Banner - Interactive & Catchy */}
        <div className="mb-8 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden animate-scale-in interactive-card">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                  <Globe className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2 tracking-tight">Welcome back, {user.name}! 👋</h2>
                  <p className="text-white/95 text-lg font-medium mb-1">
                    {getLanguageEmoji(user.preferred_language)} <span className="capitalize">{user.preferred_language}</span> • Auto-translation enabled
                  </p>
                  <p className="text-white/80 text-sm">
                    Break language barriers with real-time translation across 14+ languages
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/settings')}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover-lift transform hover:scale-105 border border-white/20"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover-lift transform hover:scale-105 border border-white/20"
                >
                  📊 Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* My Conversations Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold dark:text-white">My Conversations</h2>
            <button
              onClick={loadUserConversations}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading && conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No conversations yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start a new conversation to begin chatting!</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Your First Chat
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversations.map((conv, idx) => {
                const partnerId = conv.participant1_id === user.id 
                  ? conv.participant2_id 
                  : conv.participant1_id;
                const partner = partners[partnerId];

                return (
                  <div
                    key={conv.id}
                    className="bg-white dark:bg-[#242530] rounded-3xl shadow-lg p-6 hover:shadow-2xl hover-lift cursor-pointer border border-slate-200 dark:border-[#2d2e3a] animate-fade-in interactive-card group"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div 
                      onClick={() => navigate(`/chat/${conv.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                          {partner ? partner.name[0].toUpperCase() : '?'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {partner ? partner.name : 'Loading...'}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            {partner && (
                              <>
                                <span className="text-lg">{getLanguageEmoji(partner.preferred_language)}</span>
                                <span>Speaks {partner.preferred_language}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 dark:border-[#2d2e3a] pt-4 mb-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {conv.last_message_at 
                            ? `Last message: ${new Date(conv.last_message_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                            : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat/${conv.id}`);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl hover:shadow-xl transition-all font-semibold hover-lift transform hover:scale-105"
                      >
                        💬 Open Chat
                      </button>
                      <div className="relative group">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="px-4 py-3 bg-slate-100 dark:bg-[#2d2e3a] hover:bg-slate-200 dark:hover:bg-[#353642] text-slate-600 dark:text-slate-300 rounded-xl transition-all hover-lift"
                          title="More options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#242530] rounded-xl shadow-xl border border-slate-200 dark:border-[#2d2e3a] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 animate-fade-in">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(conv.id);
                            }}
                            className="w-full px-4 py-3 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d2e3a] rounded-xl transition-all flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                            <span>Archive Chat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Archive Confirmation Modal - Friendly Design */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-[#242530] rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in border border-slate-200 dark:border-[#2d2e3a]">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold dark:text-white mb-2">Archive Conversation?</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  This conversation will be archived. You can restore it anytime from your archived chats.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      if (!user?.id) {
                        alert('User not found. Please log in again.');
                        return;
                      }
                      await chatAPI.deleteConversation(showDeleteConfirm, user.id);
                      setShowDeleteConfirm(null);
                      await loadUserConversations();
                    } catch (error) {
                      console.error('Error archiving conversation:', error);
                      alert(error.response?.data?.detail || 'Failed to archive conversation. Please try again.');
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - Interactive & Catchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover-lift border border-blue-400/20 animate-scale-in interactive-card text-white transform hover:scale-105 transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-lg transform hover:rotate-12 transition-transform">
              <Plus className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Start New Chat</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Connect with someone and start translating in real-time
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover-lift border border-white/30 transform hover:scale-105"
            >
              ✨ New Conversation
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover-lift border border-purple-400/20 animate-scale-in interactive-card text-white transform hover:scale-105 transition-all" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-lg transform hover:rotate-12 transition-transform">
              <BarChart3 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
            <p className="text-purple-100 mb-6 text-sm">
              View your statistics and analytics
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover-lift border border-white/30 transform hover:scale-105"
            >
              📊 View Dashboard
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover-lift border border-emerald-400/20 animate-scale-in interactive-card text-white transform hover:scale-105 transition-all" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-lg transform hover:rotate-12 transition-transform">
              <Settings className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Settings</h3>
            <p className="text-emerald-100 mb-6 text-sm">
              Manage language and preferences
            </p>
            <button 
              onClick={() => navigate('/settings')}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover-lift border border-white/30 transform hover:scale-105"
            >
              ⚙️ Open Settings
            </button>
          </div>
        </div>

        {/* Quick Navigation - Interactive Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-br from-white to-blue-50 dark:from-[#242530] dark:to-[#2a2b38] rounded-2xl shadow-lg p-6 hover:shadow-xl hover-lift border border-blue-100 dark:border-[#2d2e3a] text-left group animate-fade-in interactive-card transform hover:scale-105 transition-all"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold dark:text-white mb-1 text-lg">Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Language & Preferences</p>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-br from-white to-purple-50 dark:from-[#242530] dark:to-[#2a2b38] rounded-2xl shadow-lg p-6 hover:shadow-xl hover-lift border border-purple-100 dark:border-[#2d2e3a] text-left group animate-fade-in interactive-card transform hover:scale-105 transition-all"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold dark:text-white mb-1 text-lg">Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Statistics & Analytics</p>
          </button>

          <button
            onClick={() => navigate('/help')}
            className="bg-gradient-to-br from-white to-emerald-50 dark:from-[#242530] dark:to-[#2a2b38] rounded-2xl shadow-lg p-6 hover:shadow-xl hover-lift border border-emerald-100 dark:border-[#2d2e3a] text-left group animate-fade-in interactive-card transform hover:scale-105 transition-all"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold dark:text-white mb-1 text-lg">Help</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Support & FAQ</p>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="bg-gradient-to-br from-white to-amber-50 dark:from-[#242530] dark:to-[#2a2b38] rounded-2xl shadow-lg p-6 hover:shadow-xl hover-lift border border-amber-100 dark:border-[#2d2e3a] text-left group animate-fade-in interactive-card transform hover:scale-105 transition-all"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Info className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold dark:text-white mb-1 text-lg">About</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Learn More</p>
          </button>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">Start New Conversation</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter the email of the person you want to chat with. Messages will be automatically translated!
            </p>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
              placeholder="partner@email.com"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowNewChat(false);
                  setPartnerEmail('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStartChat}
                disabled={!partnerEmail.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}