import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { Languages, Moon, Sun, Mail, Lock, ArrowRight, Globe2, MessageSquare, Zap, Shield } from 'lucide-react';

const FEATURES = [
  { icon: Globe2,        text: '14+ Indian Languages', desc: 'Comprehensive support'     },
  { icon: MessageSquare, text: 'Real-time Translation', desc: 'Instant communication'    },
  { icon: Zap,           text: 'Auto Detection',        desc: 'Smart language recognition'},
  { icon: Shield,        text: 'Enterprise Security',   desc: 'End-to-end encrypted'     },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login, loading, error } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => { initTheme(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) navigate('/home');
  };

  const inputClass = (field) =>
    `w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200
     dark:bg-[#1a1b23] dark:text-white placeholder-slate-400
     ${focusedField === field
       ? 'border-blue-500 ring-2 ring-blue-500/20'
       : 'border-slate-200 dark:border-[#2d2e3a]'
     }`;

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/3 dark:bg-indigo-400/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 relative z-10 items-center py-8">

        {/* Left – Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-4 xl:px-8 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center gap-4 animate-slide-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30" />
                <div className="relative w-[72px] h-[72px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Languages className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Local Language</h1>
                <h2 className="text-3xl xl:text-4xl font-bold text-gradient-primary">Integrator</h2>
              </div>
            </div>
            <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Enterprise-grade multilingual communication platform. Connect seamlessly across{' '}
              <span className="font-semibold text-slate-900 dark:text-white">14+ languages</span> with real-time translation.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-3 xl:gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i}
                  className="group flex items-center gap-4 p-4 xl:p-5 card hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="w-12 h-12 xl:w-14 xl:h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 xl:w-7 xl:h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm xl:text-base">{feat.text}</p>
                    <p className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-6 border-t border-slate-200 dark:border-[#2d2e3a] animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[{ val: '14+', label: 'Languages' }, { val: '99.9%', label: 'Uptime' }, { val: 'SSL', label: 'Secured' }].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="h-10 w-px bg-slate-300 dark:bg-slate-600" />}
                <div>
                  <p className="text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white">{s.val}</p>
                  <p className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right – Login Form */}
        <div className="flex items-center justify-center w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-full max-w-md xl:max-w-lg">
            <div className="glass-strong rounded-2xl xl:rounded-3xl shadow-2xl border border-slate-200/50 dark:border-[#2d2e3a]/50 p-8 xl:p-10">

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Languages className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                  </div>
                  <div className="lg:hidden">
                    <p className="text-base font-bold text-slate-900 dark:text-white">Local Language Integrator</p>
                  </div>
                </div>
                <button onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
                  {isDarkMode
                    ? <Sun className="w-5 h-5 text-amber-400" />
                    : <Moon className="w-5 h-5 text-slate-600" />}
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">Sign in to your account to continue</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                  text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3 animate-slide-down">
                  <span>⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass('email')}
                      placeholder="you@company.com" required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="form-label !mb-0">Password</label>
                    <Link to="/forgot-password"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password} onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass('password')} pr-12`}
                      placeholder="Enter your password" required
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1">
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                    text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 text-base btn-ripple"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Create account
                </Link>
              </p>

              {/* Mobile features */}
              <div className="lg:hidden mt-8 pt-8 border-t border-slate-200 dark:border-[#2d2e3a] grid grid-cols-2 gap-3">
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
