import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { Languages, Mail, ArrowLeft, Moon, Sun, CheckCircle, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { forgotPassword, loading } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => { initTheme(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await forgotPassword(email.trim());
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="glass-strong rounded-3xl shadow-2xl border border-slate-200/50 dark:border-[#2d2e3a]/50 p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Local Language</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Integrator</p>
              </div>
            </div>
            <button onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all">
              {isDarkMode
                ? <Sun className="w-5 h-5 text-amber-400" />
                : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>

          {!submitted ? (
            <>
              {/* Icon + Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200
                        dark:bg-[#1a1b23] dark:text-white placeholder-slate-400
                        ${focusedField === 'email'
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-[#2d2e3a]'}`}
                      placeholder="you@email.com"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold
                    shadow-lg hover:shadow-blue-500/30 hover:opacity-90 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 text-base btn-ripple"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <Link to="/login"
                  className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <Link to="/register" className="font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
                  Create account
                </Link>
              </div>
            </>
          ) : (
            /* ── Success State ── */
            <div className="text-center animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check your inbox!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-2">
                If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>,
                we've sent a password reset link.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mb-8">
                Didn't receive it? Check your spam folder or try again.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setSubmitted(false); setEmail(''); }}
                  className="w-full py-3 border-2 border-slate-200 dark:border-[#2d2e3a] rounded-xl
                    text-sm font-medium text-slate-700 dark:text-slate-300
                    hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all"
                >
                  Try a different email
                </button>
                <Link to="/login"
                  className="block w-full py-3 bg-gradient-primary text-white rounded-xl text-sm font-semibold
                    text-center hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/30">
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          🔒 For your security, reset links expire after 24 hours
        </p>
      </div>
    </div>
  );
}
