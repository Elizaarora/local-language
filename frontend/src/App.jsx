import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import About from './pages/About';
import Navigation from './components/Navigation';

function App() {
  const { loadUser, isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    // Small delay to ensure auth state is loaded
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  // Don't render anything until we've checked auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f0f14]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {isAuthenticated && user && <Navigation />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
        <Route
          path="/home"
          element={isAuthenticated && user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat/:conversationId"
          element={isAuthenticated && user ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated && user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={isAuthenticated && user ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated && user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/help"
          element={isAuthenticated && user ? <Help /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/about"
          element={isAuthenticated && user ? <About /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated && user ? "/home" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;