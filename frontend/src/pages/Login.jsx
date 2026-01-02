// Login.jsx - Professional Enterprise Design with Proper Spacing
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { Languages, Moon, Sun, Mail, Lock, ArrowRight, Globe2, MessageSquare, Zap, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login, loading, error } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    initTheme();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/home');
    }
  };

  const features = [
    { icon: Globe2, text: '14 Indian Languages', desc: 'Comprehensive support' },
    { icon: MessageSquare, text: 'Real-time Translation', desc: 'Instant communication' },
    { icon: Zap, text: 'Auto Detection', desc: 'Smart language recognition' },
    { icon: Shield, text: 'Enterprise Security', desc: 'Bank-level encryption' },
  ];

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 relative z-10 items-center py-8">
        {/* Left Side - Branding (Hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 xl:space-y-10 px-4 xl:px-8 animate-fade-in">
          <div className="space-y-6 xl:space-y-8">
            <div className="flex items-center space-x-4 animate-slide-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                  <Languages className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Local Language
                </h1>
                <h2 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Integrator
                </h2>
              </div>
            </div>
            
            <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Enterprise-grade multilingual communication platform. Connect seamlessly across <span className="font-semibold text-slate-900 dark:text-white">14 Indian languages</span> with real-time translation.
            </p>
          </div>

          {/* Features Grid - Professional */}
          <div className="grid grid-cols-1 gap-3 xl:gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start space-x-4 p-4 xl:p-5 bg-white/70 dark:bg-[#242530]/70 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-[#2d2e3a] hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Icon className="w-6 h-6 xl:w-7 xl:h-7 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm xl:text-base">{feature.text}</p>
                    <p className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 xl:space-x-8 pt-6 border-t border-slate-200 dark:border-[#2d2e3a] animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white">14+</div>
              <div className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Languages</div>
            </div>
            <div className="h-10 w-px bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white">99.9%</div>
              <div className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Uptime</div>
            </div>
            <div className="h-10 w-px bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white">SSL</div>
              <div className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Secured</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-full max-w-md xl:max-w-lg">
            <div className="bg-white/90 dark:bg-[#242530]/90 backdrop-blur-xl rounded-2xl xl:rounded-3xl shadow-2xl border border-slate-200/50 dark:border-[#2d2e3a]/50 p-8 xl:p-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Languages className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                  </div>
                  <div className="lg:hidden">
                    <h1 className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white">Local Language</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Integrator</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all transform hover:scale-110"
                  title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  )}
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Sign in to your account to continue
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start space-x-3 animate-fade-in">
                  <div className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">⚠️</div>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 dark:border-[#2d2e3a] dark:bg-[#1a1b23] dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              {/* Mobile Features - Only visible on small screens */}
              <div className="lg:hidden mt-8 pt-8 border-t border-slate-200 dark:border-[#2d2e3a]">
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="bg-slate-50 dark:bg-[#2d2e3a] rounded-xl p-3 text-center border border-slate-200 dark:border-[#353642]"
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{feature.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
