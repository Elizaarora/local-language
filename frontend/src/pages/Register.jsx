import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import {
  Languages, Moon, Sun, Mail, Lock, User, ArrowRight,
  Globe2, MessageSquare, Zap, Shield, Sparkles, ChevronDown,
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hinglish',  name: 'Hinglish',  native: 'Hindi + English', flag: '🇮🇳', recommended: true },
  { code: 'english',   name: 'English',   native: 'English',          flag: '🇬🇧' },
  { code: 'hindi',     name: 'Hindi',     native: 'हिंदी',             flag: '🇮🇳' },
  { code: 'tamil',     name: 'Tamil',     native: 'தமிழ்',             flag: '🇮🇳' },
  { code: 'telugu',    name: 'Telugu',    native: 'తెలుగు',            flag: '🇮🇳' },
  { code: 'bengali',   name: 'Bengali',   native: 'বাংলা',             flag: '🇮🇳' },
  { code: 'marathi',   name: 'Marathi',   native: 'मराठी',             flag: '🇮🇳' },
  { code: 'gujarati',  name: 'Gujarati',  native: 'ગુજરાતી',           flag: '🇮🇳' },
  { code: 'kannada',   name: 'Kannada',   native: 'ಕನ್ನಡ',             flag: '🇮🇳' },
  { code: 'malayalam', name: 'Malayalam', native: 'മലയാളം',            flag: '🇮🇳' },
  { code: 'punjabi',   name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',            flag: '🇮🇳' },
  { code: 'odia',      name: 'Odia',      native: 'ଓଡ଼ିଆ',             flag: '🇮🇳' },
  { code: 'urdu',      name: 'Urdu',      native: 'اردو',              flag: '🇵🇰' },
  { code: 'assamese',  name: 'Assamese',  native: 'অসমীয়া',           flag: '🇮🇳' },
  { code: 'sanskrit',  name: 'Sanskrit',  native: 'संस्कृतम्',          flag: '🇮🇳' },
];

const FEATURES = [
  { icon: Globe2,       text: '14+ Languages',       desc: 'Indian & world languages',    color: 'from-blue-500 to-indigo-600' },
  { icon: MessageSquare,text: 'Real-time Translation',desc: 'Instant communication',       color: 'from-purple-500 to-pink-600' },
  { icon: Zap,          text: 'Auto Detection',       desc: 'Smart language recognition',  color: 'from-amber-500 to-orange-600' },
  { icon: Shield,       text: 'Enterprise Security',  desc: 'End-to-end encrypted',        color: 'from-emerald-500 to-teal-600' },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferred_language: 'hinglish',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => { initTheme(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) navigate('/home');
  };

  const selectedLang = LANGUAGES.find(l => l.code === formData.preferred_language);

  const inputClass = (field) =>
    `w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200
     dark:bg-[#1a1b23] dark:text-white
     ${focusedField === field
       ? 'border-blue-500 ring-2 ring-blue-500/20'
       : 'border-slate-200 dark:border-[#2d2e3a]'
     }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/6 dark:bg-blue-400/6 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/6 dark:bg-purple-400/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 dark:bg-indigo-400/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10 items-center">

        {/* Left – Branding (desktop only) */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in px-4">
          <div className="space-y-5">
            <div className="flex items-center gap-4 animate-slide-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative w-18 h-18 w-[72px] h-[72px] bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl">
                  <Languages className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Local Language</h1>
                <h2 className="text-3xl font-bold text-gradient-primary">Integrator</h2>
              </div>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Join thousands breaking language barriers with{' '}
              <span className="font-semibold text-slate-900 dark:text-white">real-time translation</span>{' '}
              across 14+ Indian languages.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="group card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div className={`w-11 h-11 bg-gradient-to-br ${feat.color} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{feat.text}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-8 pt-6 border-t border-slate-200 dark:border-[#2d2e3a] animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[{ val: '14+', label: 'Languages' }, { val: '99.9%', label: 'Uptime' }, { val: 'SSL', label: 'Secured' }].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="h-10 w-px bg-slate-300 dark:bg-slate-600" />}
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.val}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right – Register Form */}
        <div className="flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="w-full max-w-md">
            <div className="glass-strong rounded-3xl shadow-2xl border border-slate-200/50 dark:border-[#2d2e3a]/50 p-8">

              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Languages className="w-5 h-5 text-white" />
                  </div>
                  <div className="lg:hidden">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Local Language Integrator</p>
                  </div>
                </div>
                <button onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
                  {isDarkMode
                    ? <Sun className="w-5 h-5 text-amber-400" />
                    : <Moon className="w-5 h-5 text-slate-600" />}
                </button>
              </div>

              <div className="mb-7">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Start your multilingual journey today</p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                  text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2 animate-slide-down">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="form-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass('name')}
                      placeholder="John Doe" required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass('email')}
                      placeholder="you@email.com" required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass('password')} pr-12`}
                      placeholder="••••••••" required minLength={6}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="form-label">Preferred Language</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-lg">{selectedLang?.flag || '🌐'}</span>
                    </div>
                    <select
                      name="preferred_language" value={formData.preferred_language}
                      onChange={handleChange}
                      className={`${inputClass('lang')} pl-12 appearance-none pr-10`}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}{lang.recommended ? ' ⭐' : ''} — {lang.native}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  {selectedLang?.recommended && (
                    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        ⭐ <strong>Recommended for Indian users</strong> — understands natural Hindi-English mixing
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white py-4 rounded-xl
                    font-semibold shadow-lg hover:shadow-blue-500/30 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 text-base btn-ripple"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Sign in
                </Link>
              </p>

              {/* Mobile feature grid */}
              <div className="lg:hidden mt-6 pt-6 border-t border-slate-200 dark:border-[#2d2e3a] grid grid-cols-2 gap-3">
                {FEATURES.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="bg-slate-50 dark:bg-[#2d2e3a] rounded-xl p-3 text-center border border-slate-200 dark:border-[#353642]">
                      <Icon className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{feat.text}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
