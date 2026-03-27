import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { getLanguageName, getLanguageEmoji, getLanguageColor } from '../utils/languageUtils';
import {
  ArrowLeft, BarChart3, MessageSquare, Users, Languages,
  TrendingUp, Clock, Globe, Activity, Sparkles, Zap,
} from 'lucide-react';

const INDIAN_LANG_CODES = [
  'hi','ta','te','bn','mr','gu','kn','ml','pa','or','ur','as','sa','en',
  'hindi','tamil','telugu','bengali','marathi','gujarati','kannada','malayalam',
  'punjabi','odia','urdu','assamese','sanskrit','english','hinglish',
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalConversations: 0,
    languagesUsed: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const convsRes = await api.get(`/chat/conversations/user/${user.id}`);
      const conversations = convsRes.data || [];
      let totalMessages = 0;
      const langCount = {};

      for (const conv of conversations) {
        try {
          const msgsRes = await api.get(`/chat/messages/${conv.id}`);
          const msgs = msgsRes.data || [];
          totalMessages += msgs.length;
          msgs.forEach(msg => {
            const lang = msg.language || 'unknown';
            langCount[lang] = (langCount[lang] || 0) + 1;
          });
        } catch { /* skip */ }
      }

      const languagesUsed = Object.entries(langCount)
        .filter(([lang]) => INDIAN_LANG_CODES.some(c => lang.toLowerCase().includes(c)))
        .map(([lang, count]) => ({ language: lang, languageName: getLanguageName(lang), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        totalMessages,
        totalConversations: conversations.length,
        languagesUsed,
        recentActivity: conversations
          .sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0))
          .slice(0, 5),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-[#1a1b23] dark:via-[#1c1d27] dark:to-[#1a1b23] flex items-center justify-center md:ml-64">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Loading your stats…</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crunching the numbers</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Messages',
      value: stats.totalMessages,
      sub: 'Messages sent & received',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    },
    {
      label: 'Conversations',
      value: stats.totalConversations,
      sub: 'Active chats',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      label: 'Languages Used',
      value: stats.languagesUsed.length,
      sub: 'Unique languages',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-[#1a1b23] dark:via-[#1c1d27] dark:to-[#1a1b23] md:ml-64 animate-fade-in">

      {/* Header */}
      <header className="glass-strong border-b border-slate-200/60 dark:border-[#2d2e3a]/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center gap-4">
          <button onClick={() => navigate('/home')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold dark:text-white">Dashboard & Analytics</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your communication overview</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={card.label}
                className={`card-lg p-6 bg-gradient-to-br ${card.bg} border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{card.label}</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{card.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{card.sub}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                {/* Mini progress indicator */}
                <div className="mt-4 h-1.5 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${card.color} rounded-full animate-progress`}
                    style={{ width: card.value > 0 ? `${Math.min((card.value / (card.value + 5)) * 100, 95)}%` : '5%' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Language Analytics */}
          <div className="card-lg p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold dark:text-white">Language Analytics</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your multilingual breakdown</p>
              </div>
            </div>

            {stats.languagesUsed.length > 0 ? (
              <div className="space-y-4">
                {stats.languagesUsed.map(({ language, languageName, count }, i) => {
                  const percentage = stats.totalMessages > 0
                    ? Math.round((count / stats.totalMessages) * 100)
                    : 0;
                  const emoji = getLanguageEmoji(language);
                  const colorClass = getLanguageColor(language);

                  return (
                    <div key={language} className="animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{emoji}</span>
                          <span className="font-semibold text-sm dark:text-white">{languageName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{count} msgs</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-[#2d2e3a] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-700 ease-out animate-progress`}
                          style={{ width: `${percentage}%`, animationDelay: `${i * 0.1}s` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No language data yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Start chatting to see your analytics</p>
                <button onClick={() => navigate('/home')}
                  className="mt-4 px-4 py-2 bg-gradient-primary text-white text-sm rounded-xl font-medium hover:opacity-90 transition-all">
                  Start Chatting
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card-lg p-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold dark:text-white">Recent Activity</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Latest conversations</p>
              </div>
            </div>

            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((conv, i) => {
                  const ts = conv.last_message_at;
                  return (
                    <div
                      key={conv.id || i}
                      onClick={() => navigate(`/chat/${conv.id}`)}
                      className="flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer
                        hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all group animate-fade-in"
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">Conversation #{i + 1}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {ts
                            ? new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : 'No messages yet'}
                        </p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No recent activity</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Start a conversation to see activity here</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips card */}
        <div className="card-lg p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-900/30 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Pro Tip</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Use voice input for hands-free messaging in any of the 14+ supported languages.
                Messages are auto-translated so your partner always reads in their preferred language.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
