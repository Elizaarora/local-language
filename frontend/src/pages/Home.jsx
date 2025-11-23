import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import { Languages, LogOut, MessageSquare, Plus, User } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuthStore();
  const { createConversation } = useChatStore();
  const navigate = useNavigate();
  const [showNewChat, setShowNewChat] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartChat = async () => {
    if (partnerEmail.trim()) {
      // For demo, we'll use a mock partner ID
      // In production, you'd search for the user by email first
      const conversation = await createConversation(user.id, 'partner-id');
      if (conversation) {
        navigate(`/chat/${conversation.id}`);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Local Language Integrator
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">Language: {user.preferred_language}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start New Conversation Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Start New Chat</h3>
            <p className="text-gray-600 mb-6">
              Connect with someone and start translating in real-time
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              New Conversation
            </button>
          </div>

          {/* Voice Call Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Voice Call</h3>
            <p className="text-gray-600 mb-6">
              Make a voice call with live translation
            </p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Start Call
            </button>
          </div>

          {/* Recent Conversations Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your Profile</h3>
            <p className="text-gray-600 mb-6">
              View and edit your profile settings
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              View Profile
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Supported Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🗣️</div>
              <p className="font-semibold">Voice Translation</p>
              <p className="text-sm text-gray-600">Real-time speech</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="font-semibold">Text Chat</p>
              <p className="text-sm text-gray-600">Instant messaging</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎙️</div>
              <p className="font-semibold">Voice Messages</p>
              <p className="text-sm text-gray-600">Send & receive</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🇮🇳</div>
              <p className="font-semibold">10+ Languages</p>
              <p className="text-sm text-gray-600">Indian languages</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Start New Conversation</h3>
            <p className="text-gray-600 mb-6">
              Enter the email of the person you want to chat with
            </p>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
              placeholder="partner@email.com"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartChat}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
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