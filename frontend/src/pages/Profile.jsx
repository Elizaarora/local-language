import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { authAPI } from '../services/api';
import api from '../services/api';
import { useToast } from '../components/Toast';
import {
  User, ArrowLeft, Camera, Save, Globe, Moon, Sun, Bell,
  Lock, Mail, Edit2, Check, X, Settings, Shield, CalendarDays,
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hinglish',  name: 'Hinglish',  native: 'Hindi+English', flag: '🇮🇳' },
  { code: 'hindi',     name: 'Hindi',     native: 'हिंदी',          flag: '🇮🇳' },
  { code: 'tamil',     name: 'Tamil',     native: 'தமிழ்',          flag: '🇮🇳' },
  { code: 'telugu',    name: 'Telugu',    native: 'తెలుగు',         flag: '🇮🇳' },
  { code: 'bengali',   name: 'Bengali',   native: 'বাংলা',          flag: '🇮🇳' },
  { code: 'marathi',   name: 'Marathi',   native: 'मराठी',          flag: '🇮🇳' },
  { code: 'gujarati',  name: 'Gujarati',  native: 'ગુજરાતી',        flag: '🇮🇳' },
  { code: 'kannada',   name: 'Kannada',   native: 'ಕನ್ನಡ',          flag: '🇮🇳' },
  { code: 'malayalam', name: 'Malayalam', native: 'മലയാളം',         flag: '🇮🇳' },
  { code: 'punjabi',   name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',         flag: '🇮🇳' },
  { code: 'odia',      name: 'Odia',      native: 'ଓଡ଼ିଆ',          flag: '🇮🇳' },
  { code: 'english',   name: 'English',   native: 'English',        flag: '🇬🇧' },
  { code: 'urdu',      name: 'Urdu',      native: 'اردو',           flag: '🇵🇰' },
  { code: 'assamese',  name: 'Assamese',  native: 'অসমীয়া',        flag: '🇮🇳' },
  { code: 'sanskrit',  name: 'Sanskrit',  native: 'संस्कृत',         flag: '🇮🇳' },
];

const getLang = (code) => LANGUAGES.find(l => l.code === code) || { flag: '🌐', name: code };

const TABS = ['Profile', 'Settings'];

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.warning('Please select an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.warning('Image size must be less than 2MB'); return; }

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post(`/profile/${user.id}/avatar`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.avatar_url;
      setAvatar(url);
      updateUser({ ...user, avatar_url: url });
    } catch { toast.error('Failed to upload avatar.'); }
    finally { setUploadingAvatar(false); }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/profile/${user.id}`, formData);
      updateUser(res.data);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast.success('Profile updated successfully!', { title: 'Saved' });
    } catch { toast.error('Failed to update profile.'); }
    finally { setLoading(false); }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', email: user?.email || '', preferred_language: user?.preferred_language || 'english', bio: user?.bio || '' });
    setIsEditing(false);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  const lang = getLang(user.preferred_language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-[#1a1b23] dark:via-[#1c1d27] dark:to-[#1a1b23] md:ml-64 animate-fade-in">

      {/* Header */}
      <header className="glass-strong border-b border-slate-200/60 dark:border-[#2d2e3a]/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5 dark:text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold dark:text-white">Profile & Settings</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your account</p>
              </div>
            </div>
          </div>
          <button onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] rounded-xl transition-all">
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── Profile Hero Card ── */}
        <div className="card-lg overflow-hidden animate-scale-in">
          {/* Gradient header band */}
          <div className="h-28 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 0%, transparent 50%), radial-gradient(circle at 70% 30%, white 0%, transparent 50%)' }} />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-5">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-2xl ring-4 ring-white dark:ring-[#242530]">
                  {avatar ? (
                    <img
                      src={avatar.startsWith('http') ? avatar : `http://localhost:8000${avatar}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : user.name[0].toUpperCase()}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-gradient-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {uploadingAvatar
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-4 h-4" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base">{lang.flag}</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-medium capitalize">
                    {lang.name} · {lang.native}
                  </span>
                </div>
              </div>
              <div className="sm:ml-auto flex gap-2 self-end sm:self-auto">
                {isEditing ? (
                  <>
                    <button onClick={handleCancel}
                      className="flex items-center gap-1.5 px-4 py-2 border-2 border-slate-200 dark:border-[#2d2e3a] rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg">
                      {loading
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg">
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Save success */}
            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2 animate-slide-down">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-slate-100 dark:bg-[#2d2e3a] rounded-xl p-1 w-fit">
              {TABS.map(tab => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-[#242530] text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Profile Tab ── */}
            {activeTab === 'Profile' && (
              <div className="space-y-5 animate-fade-in">
                {/* Name */}
                <div>
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      className="form-input" placeholder="Your full name" />
                  ) : (
                    <p className="text-slate-800 dark:text-white font-medium">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{user.email}</p>
                    <span className="text-xs bg-slate-100 dark:bg-[#2d2e3a] text-slate-500 px-2 py-0.5 rounded-full">Cannot change</span>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="form-label">Preferred Language</label>
                  {isEditing ? (
                    <select name="preferred_language" value={formData.preferred_language}
                      onChange={handleInputChange} className="form-input">
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name} — {l.native}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{lang.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">({lang.native})</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="form-label">Bio</label>
                  {isEditing ? (
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange}
                      rows={3} placeholder="Tell us about yourself…"
                      className="form-input resize-none" />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {user.bio || 'No bio yet. Click Edit Profile to add one!'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Settings Tab ── */}
            {activeTab === 'Settings' && (
              <div className="space-y-3 animate-fade-in">
                {/* Dark mode */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#2d2e3a] border border-slate-200 dark:border-[#353642]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                      {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Dark Mode</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Toggle light/dark theme</p>
                    </div>
                  </div>
                  <button onClick={toggleTheme}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#2d2e3a] border border-slate-200 dark:border-[#353642]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage notification preferences</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/settings')}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-2">
                    Configure
                  </button>
                </div>

                {/* Privacy */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#2d2e3a] border border-slate-200 dark:border-[#353642]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Privacy & Security</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage your privacy settings</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/settings')}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-2">
                    View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: CalendarDays, label: 'Account Created',
              value: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
              color: 'from-blue-500 to-indigo-600',
            },
            {
              icon: Check, label: 'Status',
              value: 'Active',
              valueColor: 'text-emerald-600 dark:text-emerald-400',
              color: 'from-emerald-500 to-teal-600',
            },
            {
              icon: Globe, label: 'Language',
              value: lang.flag + ' ' + lang.name,
              color: 'from-purple-500 to-pink-600',
            },
          ].map(({ icon: Icon, label, value, valueColor, color }, i) => (
            <div key={label}
              className="card-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
                  <p className={`text-lg font-bold mt-1 ${valueColor || 'dark:text-white'}`}>{value}</p>
                </div>
                <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
