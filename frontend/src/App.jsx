import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import About from './pages/About';
import Navigation from './components/Navigation';
import { Languages } from 'lucide-react';

function App() {
  const { loadUser, isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    setTimeout(() => setIsLoading(false), 150);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f0f14] dark:via-[#1a1b23] dark:to-[#0f0f14]">
        {/* Branded loading */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl animate-bounce-in">
            <Languages className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="font-bold text-slate-800 dark:text-white text-lg">Local Language Integrator</p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        {isAuthenticated && user && <Navigation />}
        <Routes>
          {/* Public routes */}
          <Route path="/login"           element={!isAuthenticated ? <Login />         : <Navigate to="/home" />} />
          <Route path="/register"        element={!isAuthenticated ? <Register />      : <Navigate to="/home" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          {/* Protected routes */}
          <Route path="/home"      element={isAuthenticated && user ? <Home />      : <Navigate to="/login" replace />} />
          <Route path="/chat/:conversationId" element={isAuthenticated && user ? <Chat /> : <Navigate to="/login" replace />} />
          <Route path="/profile"   element={isAuthenticated && user ? <Profile />   : <Navigate to="/login" replace />} />
          <Route path="/settings"  element={isAuthenticated && user ? <Settings />  : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={isAuthenticated && user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/help"      element={isAuthenticated && user ? <Help />      : <Navigate to="/login" replace />} />
          <Route path="/about"     element={isAuthenticated && user ? <About />     : <Navigate to="/login" replace />} />

          <Route path="/" element={<Navigate to={isAuthenticated && user ? '/home' : '/login'} replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
