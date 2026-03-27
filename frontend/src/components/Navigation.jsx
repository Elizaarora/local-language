import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import {
  Home, MessageSquare, User, Settings, BarChart3,
  HelpCircle, Info, Menu, X, LogOut, Globe, Moon, Sun,
  Languages, ChevronRight,
} from 'lucide-react';

const LANGUAGE_FLAGS = {
  hindi: '🇮🇳', tamil: '🇮🇳', telugu: '🇮🇳', bengali: '🇮🇳',
  marathi: '🇮🇳', gujarati: '🇮🇳', kannada: '🇮🇳', malayalam: '🇮🇳',
  punjabi: '🇮🇳', odia: '🇮🇳', assamese: '🇮🇳', sanskrit: '🇮🇳',
  hinglish: '🇮🇳', urdu: '🇵🇰', english: '🇬🇧',
};

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  const menuItems = [
    { icon: Home,       label: 'Home',      path: '/home',      color: 'from-blue-500 to-indigo-600' },
    { icon: MessageSquare, label: 'Chats',  path: '/home',      color: 'from-purple-500 to-pink-600', id: 'chats' },
    { icon: BarChart3,  label: 'Dashboard', path: '/dashboard', color: 'from-amber-500 to-orange-600' },
    { icon: User,       label: 'Profile',   path: '/profile',   color: 'from-teal-500 to-emerald-600' },
    { icon: Settings,   label: 'Settings',  path: '/settings',  color: 'from-slate-500 to-slate-600' },
    { icon: HelpCircle, label: 'Help',      path: '/help',      color: 'from-sky-500 to-cyan-600' },
    { icon: Info,       label: 'About',     path: '/about',     color: 'from-rose-500 to-pink-600' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (item) => {
    if (item.id === 'chats') return false; // avoid double-active with Home
    return location.pathname === item.path ||
      (item.path === '/home' && location.pathname.startsWith('/chat'));
  };

  const langFlag = LANGUAGE_FLAGS[user?.preferred_language?.toLowerCase()] || '🌐';

  return (
    <>
      {/* ── Mobile FAB ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl
          flex items-center justify-center md:hidden
          transition-all duration-300 btn-ripple
          ${isOpen
            ? 'bg-red-500 hover:bg-red-600 rotate-90'
            : 'bg-gradient-primary hover:shadow-blue-500/40'
          }`}
        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in-fast"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-40
          glass-strong border-r border-slate-200/70 dark:border-[#2d2e3a]/70
          shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-200/60 dark:border-[#2d2e3a]/60">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Languages className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">Local Language</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Integrator</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div
          onClick={() => handleNavigation('/profile')}
          className="mx-3 mt-3 p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50
            dark:from-[#2a2b38] dark:to-[#252630] border border-blue-100 dark:border-[#353642]
            cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center
                text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#2a2b38]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                <span>{langFlag}</span>
                <span className="capitalize truncate">{user?.preferred_language || 'English'}</span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pb-2 pt-1">
            Navigation
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.id || item.path + item.label}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium
                  transition-all duration-200 text-sm group
                  ${active
                    ? 'nav-active'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                  ${active
                    ? 'bg-white/20'
                    : `bg-gradient-to-br ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110`
                  }`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200/60 dark:border-[#2d2e3a]/60 space-y-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              {isDarkMode
                ? <Sun className="w-4 h-4 text-white" />
                : <Moon className="w-4 h-4 text-white" />}
            </div>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
