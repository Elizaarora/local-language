import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { useToast } from '../components/Toast';
import api from '../services/api';
import {
  ArrowLeft, Settings as SettingsIcon, Globe, Bell, Moon, Sun,
  Lock, Shield, Eye, Volume2, Languages, Save, Check,
  MessageSquare, Zap, ChevronDown,
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

/* Reusable toggle switch */
function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#242530]
        ${checked ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
        ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

/* Setting row */
function SettingRow({ icon: Icon, iconColor, title, desc, children }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#2d2e3a]/50 transition-all group">
      <div className="flex items-center gap-3.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-white text-sm">{title}</p>
          {desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  );
}

/* Section card */
function Section({ title, icon: Icon, iconColor, children }) {
  return (
    <div className="card-lg overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-[#2d2e3a]">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const toast = useToast();

  const [settings, setSettings] = useState({
    preferred_language: user?.preferred_language || 'english',
    notifications_enabled: true,
    sound_enabled: true,
    auto_translate: true,
    show_read_receipts: true,
    show_typing_indicators: true,
  });
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/profile/${user.id}`, {
        preferred_language: settings.preferred_language,
        ...settings,
      });
      updateUser({ ...user, ...res.data });
      toast.success('Settings saved successfully!', { title: 'Saved' });
    } catch (error) {
      toast.error('Failed to save settings. Please try again.', { title: 'Error' });
    } finally {
      setSaving(false);
    }
  };

  const selectedLang = LANGUAGES.find(l => l.code === settings.preferred_language);

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
              <div className="w-9 h-9 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-md">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold dark:text-white">Settings</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Customize your experience</p>
              </div>
            </div>
          </div>
          {/* Save button in header */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold
              shadow-md hover:shadow-blue-500/30 hover:opacity-90 transition-all disabled:opacity-50 btn-ripple"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* ── Language ── */}
        <Section title="Language Preferences" icon={Languages} iconColor="bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="p-3 space-y-4">
            <div>
              <label className="form-label">Preferred Language</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-lg">{selectedLang?.flag || '🌐'}</span>
                </div>
                <select
                  value={settings.preferred_language}
                  onChange={e => set('preferred_language', e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 border-2 border-slate-200 dark:border-[#2d2e3a]
                    dark:bg-[#1a1b23] dark:text-white rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} — {l.native}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Incoming messages will be translated to this language
              </p>
            </div>

            <SettingRow icon={Zap} iconColor="bg-gradient-to-br from-amber-500 to-orange-600"
              title="Auto-translate" desc="Automatically translate incoming messages">
              <Toggle checked={settings.auto_translate} onChange={v => set('auto_translate', v)} />
            </SettingRow>
          </div>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications" icon={Bell} iconColor="bg-gradient-to-br from-purple-500 to-pink-600">
          <div className="p-2 space-y-1">
            <SettingRow icon={Bell} iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
              title="Enable Notifications" desc="Receive alerts for new messages">
              <Toggle checked={settings.notifications_enabled} onChange={v => set('notifications_enabled', v)} />
            </SettingRow>
            <SettingRow icon={Volume2} iconColor="bg-gradient-to-br from-blue-500 to-cyan-600"
              title="Sound Notifications" desc="Play a sound for new messages">
              <Toggle checked={settings.sound_enabled} onChange={v => set('sound_enabled', v)} />
            </SettingRow>
          </div>
        </Section>

        {/* ── Privacy ── */}
        <Section title="Privacy & Security" icon={Shield} iconColor="bg-gradient-to-br from-emerald-500 to-teal-600">
          <div className="p-2 space-y-1">
            <SettingRow icon={Eye} iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
              title="Read Receipts" desc="Let others know when you've read their messages">
              <Toggle checked={settings.show_read_receipts} onChange={v => set('show_read_receipts', v)} />
            </SettingRow>
            <SettingRow icon={MessageSquare} iconColor="bg-gradient-to-br from-sky-500 to-blue-600"
              title="Typing Indicators" desc="Show when you're typing to others">
              <Toggle checked={settings.show_typing_indicators} onChange={v => set('show_typing_indicators', v)} />
            </SettingRow>
            <SettingRow icon={Lock} iconColor="bg-gradient-to-br from-rose-500 to-pink-600"
              title="End-to-End Encryption" desc="Messages are always encrypted">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" /> Active
              </span>
            </SettingRow>
          </div>
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance" icon={isDarkMode ? Moon : Sun} iconColor="bg-gradient-to-br from-amber-400 to-orange-500">
          <div className="p-2">
            <SettingRow
              icon={isDarkMode ? Moon : Sun}
              iconColor="bg-gradient-to-br from-amber-400 to-orange-500"
              title="Dark Mode"
              desc="Switch between light and dark theme"
            >
              <Toggle checked={isDarkMode} onChange={() => toggleTheme()} />
            </SettingRow>
          </div>
        </Section>

        {/* ── Save footer ── */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate('/home')}
            className="px-5 py-2.5 border-2 border-slate-200 dark:border-[#2d2e3a] rounded-xl
              text-sm font-medium text-slate-700 dark:text-slate-300
              hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-primary text-white rounded-xl
              text-sm font-semibold shadow-lg hover:shadow-blue-500/30 hover:opacity-90
              transition-all disabled:opacity-50 btn-ripple"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
