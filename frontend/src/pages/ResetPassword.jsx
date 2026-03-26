import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Languages, Lock, Eye, EyeOff, Moon, Sun, CheckCircle, XCircle } from 'lucide-react';
import useThemeStore from '../store/themeStore';
import { authAPI } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  useEffect(() => { initTheme(); }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] px-4">
        <div className="glass-strong rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200/50 dark:border-[#2d2e3a]/50">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Invalid Link</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            This password reset link is missing or malformed.
          </p>
          <Link to="/forgot-password"
            className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14] flex items-center justify-center px-4 relative overflow-hidden">
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

          {done ? (
            <div className="text-center animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Password updated!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Your password has been changed. Redirecting you to sign in…
              </p>
              <Link to="/login"
                className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
                Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">New Password</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Enter and confirm your new password below.</p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="form-label">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors ${focusedField === 'pw' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('pw')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl text-base transition-all duration-200
                        dark:bg-[#1a1b23] dark:text-white placeholder-slate-400
                        ${focusedField === 'pw' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-[#2d2e3a]'}`}
                      placeholder="Min. 6 characters"
                      required
                      autoFocus
                    />
                    <button type="button" onClick={() => setShow(s => !s)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label className="form-label">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors ${focusedField === 'cf' ? 'text-blue-500' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={show ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      onFocus={() => setFocusedField('cf')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200
                        dark:bg-[#1a1b23] dark:text-white placeholder-slate-400
                        ${focusedField === 'cf' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-[#2d2e3a]'}`}
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold
                    shadow-lg hover:shadow-blue-500/30 hover:opacity-90 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 text-base btn-ripple"
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  ) : 'Set New Password'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to="/login"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          🔒 Reset links expire after 1 hour
        </p>
      </div>
    </div>
  );
}
