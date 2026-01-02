import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { getLanguageName, getLanguageEmoji, getLanguageColor } from '../utils/languageUtils';
import { 
  ArrowLeft, BarChart3, MessageSquare, Users, Languages, 
  TrendingUp, Clock, Globe, Activity, Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalConversations: 0,
    languagesUsed: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get user conversations
      const convsResponse = await api.get(`/chat/conversations/user/${user.id}`);
      const conversations = convsResponse.data || [];
      
      // Count messages for each conversation
      let totalMessages = 0;
      const languageCount = {};
      
      for (const conv of conversations) {
        try {
          const messagesResponse = await api.get(`/chat/messages/${conv.id}`);
          const messages = messagesResponse.data || [];
          totalMessages += messages.length;
          
          messages.forEach(msg => {
            const lang = msg.language || 'unknown';
            languageCount[lang] = (languageCount[lang] || 0) + 1;
          });
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }
      
      // Only show Indian languages (14 languages)
      const indianLanguageCodes = ['hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'ur', 'as', 'sa', 'en', 'hindi', 'tamil', 'telugu', 'bengali', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi', 'odia', 'urdu', 'assamese', 'sanskrit', 'english', 'hinglish'];
      
      const languagesUsed = Object.entries(languageCount)
        .filter(([lang]) => {
          const lowerLang = lang.toLowerCase();
          return indianLanguageCodes.includes(lowerLang) || 
                 indianLanguageCodes.some(code => lowerLang.includes(code));
        })
        .map(([lang, count]) => ({ 
          language: lang, 
          languageName: getLanguageName(lang),
          count 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 14); // Show top 14 Indian languages
      
      setStats({
        totalMessages,
        totalConversations: conversations.length,
        languagesUsed,
        recentActivity: conversations
          .sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0))
          .slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center md:ml-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#1a1b23] dark:via-[#1f2029] dark:to-[#1a1b23] md:ml-64 animate-fade-in">
      {/* Header - Professional */}
      <header className="bg-white/90 dark:bg-[#242530]/90 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-[#2d2e3a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 dark:text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold dark:text-white">Dashboard & Statistics</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards - Vibrant & Professional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl p-6 text-white hover:shadow-2xl hover-lift transition-all animate-scale-in transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Messages</p>
                <p className="text-4xl font-bold mt-2">{stats.totalMessages}</p>
                <p className="text-blue-200 text-xs mt-1">Across all conversations</p>
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl p-6 text-white hover:shadow-2xl hover-lift transition-all animate-scale-in transform hover:scale-105" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Conversations</p>
                <p className="text-4xl font-bold mt-2">{stats.totalConversations}</p>
                <p className="text-purple-200 text-xs mt-1">Active chats</p>
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl p-6 text-white hover:shadow-2xl hover-lift transition-all animate-scale-in transform hover:scale-105" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Languages Used</p>
                <p className="text-4xl font-bold mt-2">{stats.languagesUsed.length}</p>
                <p className="text-emerald-200 text-xs mt-1">Different languages</p>
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Usage - Beautiful Design */}
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-[#242530] dark:to-[#2a2b38] rounded-3xl shadow-xl p-8 border border-blue-100 dark:border-[#2d2e3a] hover:shadow-2xl transition-all animate-fade-in">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Languages className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white">Language Analytics</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your multilingual communication breakdown</p>
              </div>
            </div>
            {stats.languagesUsed.length > 0 ? (
              <div className="space-y-5">
                {stats.languagesUsed.map(({ language, languageName, count }, index) => {
                  const percentage = (count / stats.totalMessages) * 100;
                  const colorClass = getLanguageColor(language);
                  const emoji = getLanguageEmoji(language);
                  
                  return (
                    <div 
                      key={language} 
                      className="bg-white/60 dark:bg-[#2d2e3a]/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 dark:border-[#353642] hover:shadow-lg transition-all hover-lift animate-fade-in interactive-card transform hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-md text-2xl`}>
                            {emoji}
                          </div>
                          <div>
                            <p className="font-bold dark:text-white text-lg">{languageName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{count} messages • {percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold dark:text-white">{count}</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-700 ease-out shadow-sm`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No language data yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Start chatting to see your language analytics!</p>
              </div>
            )}
          </div>

          {/* Recent Activity - Beautiful Design */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-[#242530] dark:to-[#2a2b38] rounded-3xl shadow-xl p-8 border border-purple-100 dark:border-[#2d2e3a] hover:shadow-2xl transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white">Recent Activity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your latest conversations</p>
              </div>
            </div>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((conv, index) => (
                  <div
                    key={conv.id || index}
                    onClick={() => navigate(`/chat/${conv.id}`)}
                    className="p-5 bg-white/80 dark:bg-[#2d2e3a]/80 backdrop-blur-sm rounded-2xl hover:bg-white dark:hover:bg-[#353642] cursor-pointer transition-all hover-lift border border-purple-100 dark:border-[#353642] shadow-sm hover:shadow-md animate-fade-in interactive-card transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-white text-lg">Conversation</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {conv.last_message_at
                              ? new Date(conv.last_message_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'No messages yet'}
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No recent activity</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Start a conversation to see activity here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

