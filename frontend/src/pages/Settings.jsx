import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import api from '../services/api';
import { 
  ArrowLeft, Settings as SettingsIcon, Globe, Bell, Moon, Sun, 
  Lock, Shield, Eye, Volume2, Languages, Save, Check
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

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    preferred_language: user?.preferred_language || 'english',
    notifications_enabled: true,
    sound_enabled: true,
    auto_translate: true,
    show_read_receipts: true,
    show_typing_indicators: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`/profile/${user.id}`, {
        preferred_language: settings.preferred_language,
        ...settings
      });
      updateUser({ ...user, ...response.data });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
                <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
              </div>
            </div>
            {saved && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">Saved!</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Language Settings - Professional */}
        <div className="bg-white dark:bg-[#242530] rounded-3xl shadow-xl p-6 mb-6 border border-slate-200 dark:border-[#2d2e3a] animate-scale-in">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Languages className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Language Preferences</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Language
              </label>
              <select
                value={settings.preferred_language}
                onChange={(e) => handleChange('preferred_language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Messages will be automatically translated to this language
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium dark:text-white">Auto-translate</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically translate incoming messages</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('auto_translate', !settings.auto_translate)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.auto_translate ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.auto_translate ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium dark:text-white">Enable Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications for new messages</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('notifications_enabled', !settings.notifications_enabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.notifications_enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications_enabled ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium dark:text-white">Sound Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Play sound for new messages</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('sound_enabled', !settings.sound_enabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.sound_enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.sound_enabled ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Privacy</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Control your privacy settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium dark:text-white">Read Receipts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let others know when you've read their messages</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('show_read_receipts', !settings.show_read_receipts)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.show_read_receipts ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.show_read_receipts ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Languages className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium dark:text-white">Typing Indicators</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're typing</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('show_typing_indicators', !settings.show_typing_indicators)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.show_typing_indicators ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.show_typing_indicators ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              {isDarkMode ? <Moon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" /> : <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              <div>
                <p className="font-medium dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
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
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 hover-lift font-semibold"
            >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

