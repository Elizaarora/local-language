import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import api, { authAPI, chatAPI } from '../services/api';
import {
  Languages, LogOut, MessageSquare, Plus, RefreshCw, Globe,
  Moon, Sun, Settings, BarChart3, HelpCircle, Info, Trash2,
  Search, X, ArrowRight, Sparkles, Users,
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import useThemeStore from '../store/themeStore';

const LANGUAGE_FLAGS = {
  hindi: '🇮🇳', tamil: '🇮🇳', telugu: '🇮🇳', bengali: '🇮🇳',
  marathi: '🇮🇳', gujarati: '🇮🇳', kannada: '🇮🇳', malayalam: '🇮🇳',
  punjabi: '🇮🇳', odia: '🇮🇳', assamese: '🇮🇳', sanskrit: '🇮🇳',
  hinglish: '🇮🇳', urdu: '🇵🇰', english: '🇬🇧',
};

const getFlag = (lang) => LANGUAGE_FLAGS[lang?.toLowerCase()] || '🌐';

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default function Home() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { createConversation } = useChatStore();
  const navigate = useNavigate();

  const [showNewChat, setShowNewChat] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [newChatError, setNewChatError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
    else loadUserConversations();
  }, [user, navigate]);

  const loadUserConversations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/chat/conversations/user/${user.id}`);
      setConversations(response.data);
      for (const conv of response.data) {
        const pid = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
        try {
          const partnerData = await authAPI.getUserById(pid);
          setPartners(prev => ({ ...prev, [pid]: partnerData }));
        } catch { /* skip */ }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleStartChat = async () => {
    if (!partnerEmail.trim()) return;
    setStartingChat(true);
    setNewChatError('');
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
      setNewChatError(error.response?.data?.detail || 'User not found. Please check the email.');
    } finally {
      setStartingChat(false);
    }
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(conv => {
      const pid = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
      const partner = partners[pid];
      return partner?.name?.toLowerCase().includes(q) || partner?.email?.toLowerCase().includes(q);
    });
  }, [conversations, partners, searchQuery, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-[#1a1b23] dark:via-[#1c1d27] dark:to-[#1a1b23] md:ml-64 animate-fade-in">

      {/* ── Header ── */}
      <header className="glass-strong border-b border-slate-200/60 dark:border-[#2d2e3a]/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-40" />
                <div className="relative bg-gradient-primary p-2.5 rounded-xl shadow-lg">
                  <Languages className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient-primary tracking-tight">
                  Local Language Integrator
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Welcome, <span className="font-semibold text-slate-700 dark:text-slate-300">{user.name}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button onClick={() => navigate('/settings')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all"
                title="Settings">
                <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
              <button onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all"
                title="Toggle theme">
                {isDarkMode
                  ? <Sun className="w-5 h-5 text-amber-400" />
                  : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#2d2e3a] rounded-xl">
                <span className="text-sm">{getFlag(user.preferred_language)}</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">{user.preferred_language}</span>
              </div>
              <button onClick={handleLogout}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 transition-all"
                title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl animate-scale-in">
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome back, {user.name}! 👋
                  </h2>
                  <p className="text-white/80 mt-1 flex items-center gap-2 text-sm">
                    <span>{getFlag(user.preferred_language)}</span>
                    <span className="capitalize">{user.preferred_language}</span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span>Real-time translation active</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    Break language barriers — 14+ languages supported
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => navigate('/settings')}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl
                    text-sm font-semibold border border-white/20 transition-all hover:shadow-lg"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl
                    text-sm font-semibold border border-white/20 transition-all hover:shadow-lg"
                >
                  📊 Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Conversations Section ── */}
        <div>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">My Conversations</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {conversations.length} active chat{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadUserConversations}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300
                  hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowNewChat(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  bg-gradient-primary text-white shadow-lg hover:shadow-blue-500/30
                  hover:opacity-90 transition-all btn-ripple"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>
          </div>

          {/* Search bar */}
          {conversations.length > 0 && (
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations by name…"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#242530] border border-slate-200 dark:border-[#2d2e3a]
                  rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:text-white placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && conversations.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="card-lg p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="skeleton w-14 h-14 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 rounded-lg w-3/4" />
                      <div className="skeleton h-3 rounded-lg w-1/2" />
                    </div>
                  </div>
                  <div className="skeleton h-10 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 && !searchQuery ? (
            /* Empty state */
            <div className="card-lg p-12 text-center animate-scale-in">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <MessageSquare className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No conversations yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                Start a new conversation to begin chatting with auto-translation!
              </p>
              <button
                onClick={() => setShowNewChat(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white
                  rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30 hover:opacity-90
                  transition-all btn-ripple"
              >
                <Sparkles className="w-4 h-4" />
                Start Your First Chat
              </button>
            </div>
          ) : filteredConversations.length === 0 && searchQuery ? (
            <div className="card-lg p-12 text-center">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No conversations match "<strong>{searchQuery}</strong>"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredConversations.map((conv, idx) => {
                const pid = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
                const partner = partners[pid];
                return (
                  <div
                    key={conv.id}
                    className="card-lg p-5 hover:shadow-xl transition-all duration-300 group cursor-pointer animate-fade-in hover:-translate-y-1"
                    style={{ animationDelay: `${idx * 0.07}s` }}
                    onClick={() => navigate(`/chat/${conv.id}`)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl
                          flex items-center justify-center text-white font-bold text-xl shadow-lg
                          group-hover:scale-105 transition-transform">
                          {partner ? partner.name[0].toUpperCase() : '?'}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#242530]" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate
                          group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {partner ? partner.name : 'Loading…'}
                        </h3>
                        {partner && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{getFlag(partner.preferred_language)}</span>
                            <span className="capitalize">{partner.preferred_language}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {conv.last_message_at ? formatTime(conv.last_message_at) : 'No messages yet'}
                        </p>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={e => { e.stopPropagation(); setShowDeleteConfirm(conv.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50
                          dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all"
                        title="Archive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Translation badge */}
                    <div className="flex items-center gap-2 mb-4 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Languages className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                        <span className="capitalize">{user.preferred_language}</span>
                        <span className="mx-1.5 text-blue-400">↔</span>
                        <span className="capitalize">{partner?.preferred_language || '…'}</span>
                      </p>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/chat/${conv.id}`); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                        bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                        text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg
                        transition-all btn-ripple"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Open Chat
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-xl font-bold dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Plus, label: 'New Chat', sub: 'Start translating', color: 'from-blue-500 to-indigo-600', action: () => setShowNewChat(true) },
              { icon: BarChart3, label: 'Dashboard', sub: 'View analytics', color: 'from-purple-500 to-pink-600', action: () => navigate('/dashboard') },
              { icon: Settings, label: 'Settings', sub: 'Manage preferences', color: 'from-emerald-500 to-teal-600', action: () => navigate('/settings') },
              { icon: HelpCircle, label: 'Help', sub: 'Support & FAQ', color: 'from-amber-500 to-orange-600', action: () => navigate('/help') },
            ].map(({ icon: Icon, label, sub, color, action }, i) => (
              <button
                key={label}
                onClick={action}
                className="card-lg p-5 text-left hover:shadow-xl transition-all duration-300
                  hover:-translate-y-1 group animate-fade-in btn-ripple"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center
                  shadow-lg mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── Archive Confirm Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
          <div className="card-lg p-8 max-w-md w-full animate-scale-in shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Archive Conversation?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                This conversation will be archived. You can restore it anytime.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] rounded-xl
                  font-medium text-slate-700 dark:text-slate-300
                  hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await chatAPI.deleteConversation(showDeleteConfirm, user.id);
                    setShowDeleteConfirm(null);
                    await loadUserConversations();
                  } catch (error) {
                    toast.error(error.response?.data?.detail || 'Failed to archive.');
                  }
                }}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white
                  rounded-xl font-semibold hover:shadow-lg hover:opacity-90 transition-all"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Chat Modal ── */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-fast">
          <div className="card-lg p-8 max-w-md w-full animate-scale-in shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold dark:text-white">Start New Conversation</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Messages auto-translate instantly
                </p>
              </div>
              <button
                onClick={() => { setShowNewChat(false); setPartnerEmail(''); setNewChatError(''); }}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newChatError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                text-red-700 dark:text-red-300 rounded-xl text-sm animate-slide-down">
                ⚠️ {newChatError}
              </div>
            )}

            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={partnerEmail}
                onChange={e => { setPartnerEmail(e.target.value); setNewChatError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleStartChat()}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-[#2d2e3a]
                  dark:bg-[#1a1b23] dark:text-white rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="partner@example.com"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowNewChat(false); setPartnerEmail(''); setNewChatError(''); }}
                className="flex-1 py-3 border-2 border-slate-200 dark:border-[#2d2e3a] rounded-xl
                  font-medium text-slate-700 dark:text-slate-300
                  hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartChat}
                disabled={!partnerEmail.trim() || startingChat}
                className="flex-1 py-3 bg-gradient-primary text-white rounded-xl font-semibold
                  shadow-lg hover:opacity-90 transition-all disabled:opacity-50
                  disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-ripple"
              >
                {startingChat ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Finding…
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Start Chat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
