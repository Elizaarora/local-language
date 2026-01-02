import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { authAPI } from '../services/api';
import api from '../services/api';
import { 
  User, ArrowLeft, Camera, Save, Globe, Moon, Sun, Bell, 
  Lock, Mail, Edit2, Check, X, Upload, Trash2, Settings
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'tamil', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'telugu', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'bengali', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'marathi', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'gujarati', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'kannada', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'malayalam', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'punjabi', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'odia', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'urdu', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'assamese', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  { code: 'sanskrit', name: 'संस्कृत (Sanskrit)', flag: '🇮🇳' },
];

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferred_language: user?.preferred_language || 'english',
    bio: user?.bio || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar_url || null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        preferred_language: user.preferred_language || 'english',
        bio: user.bio || '',
      });
      setAvatar(user.avatar_url || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/profile/${user.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const avatarUrl = response.data.avatar_url;
      setAvatar(avatarUrl);
      updateUser({ ...user, avatar_url: avatarUrl });
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/profile/${user.id}`, formData);
      updateUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      preferred_language: user?.preferred_language || 'english',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const getLanguageEmoji = (code) => {
    const lang = LANGUAGES.find(l => l.code === code);
    return lang?.flag || '🌐';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#1a1b23] dark:via-[#1f2029] dark:to-[#1a1b23] md:ml-64 animate-fade-in">
      {/* Header - Professional */}
      <header className="bg-white/90 dark:bg-[#242530]/90 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-[#2d2e3a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6 dark:text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold dark:text-white">Profile & Settings</h1>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card - Professional */}
        <div className="bg-white dark:bg-[#242530] rounded-3xl shadow-xl p-8 mb-6 border border-slate-200 dark:border-[#2d2e3a] animate-scale-in">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {avatar ? (
                    <img 
                      src={avatar.startsWith('http') ? avatar : `http://localhost:8000${avatar}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${avatar ? 'hidden' : ''}`}>
                    {user.name[0].toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 bg-gradient-primary hover:shadow-xl text-white p-2.5 rounded-full shadow-lg transition-all disabled:opacity-50 hover-lift"
                >
                  {uploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-5 h-5" />
              )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click to change avatar</p>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold dark:text-white">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Language
                  </label>
                  {isEditing ? (
                    <select
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getLanguageEmoji(user.preferred_language)}</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {LANGUAGES.find(l => l.code === user.preferred_language)?.name || user.preferred_language}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.bio || 'No bio yet. Add one to let others know about you!'}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-6 py-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Card - Professional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover-lift transition-all animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                <p className="text-2xl font-bold dark:text-white mt-2">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover-lift transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">Active</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center shadow-md">
                <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover-lift transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                <p className="text-2xl font-bold dark:text-white mt-2">
                  {getLanguageEmoji(user.preferred_language)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold dark:text-white mb-6">Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                <div>
                  <p className="font-semibold dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark/light theme</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-semibold dark:text-white">Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage notification preferences</p>
                </div>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">Configure</button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-semibold dark:text-white">Privacy & Security</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your privacy settings</p>
                </div>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

