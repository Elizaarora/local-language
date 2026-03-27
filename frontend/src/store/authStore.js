import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      const data = await authAPI.login(credentials);
      console.log('✅ Login response received:', { 
        hasToken: !!data.access_token, 
        hasUser: !!data.user,
        userId: data.user?.id 
      });
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      console.log('✅ Login successful, user authenticated');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed. Please check your credentials.';
      console.error('❌ Login error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error
      });
      set({
        error: errorMessage,
        loading: false,
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        loading: false,
      });
      
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Registration failed',
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadUser: () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      set({
        user: JSON.parse(user),
        token: token,
        isAuthenticated: true,
      });
    }
  },

  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authAPI.forgotPassword(email);
      set({ loading: false });
      return true;
    } catch (error) {
      // Always return true for security (don't reveal if email exists)
      set({ loading: false });
      return true;
    }
  },
}));

export default useAuthStore;