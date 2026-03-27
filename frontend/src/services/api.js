import axios from 'axios';

// Auto-detect production URL — works even when env vars are not set in Vercel
const IS_LOCAL = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const PRODUCTION_BACKEND = 'https://local-language-backend.onrender.com';

function resolveUrl(envVar) {
  if (envVar && !envVar.includes('your-backend-url') && !envVar.includes('placeholder')) {
    return envVar;
  }
  return IS_LOCAL ? 'http://localhost:8000' : PRODUCTION_BACKEND;
}

const finalApiUrl = resolveUrl(import.meta.env.VITE_API_BASE_URL);
console.log('🔧 API URL:', finalApiUrl);

// Create axios instance
const api = axios.create({
  baseURL: finalApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  searchUser: async (email) => {
    const response = await api.get(`/auth/search/${email}`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, new_password) => {
    const response = await api.post('/auth/reset-password', { token, new_password });
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  createConversation: async (participant1_id, participant2_id) => {
    const response = await api.post('/chat/conversations', {
      participant1_id,
      participant2_id,
    });
    return response.data;
  },
  
  getConversation: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },
  
  sendMessage: async (messageData) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },
  
  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  },

  searchMessages: async (conversationId, query) => {
    const response = await api.get(`/chat/messages/${conversationId}/search`, {
      params: { query }
    });
    return response.data;
  },

  updateMessage: async (messageId, text) => {
    const response = await api.put(`/chat/messages/${messageId}`, { text });
    return response.data;
  },

  deleteMessage: async (messageId, userId) => {
    if (!userId) {
      throw new Error('User ID is required to delete a message');
    }
    const response = await api.delete(`/chat/messages/${messageId}`, {
      params: { user_id: userId }
    });
    return response.data;
  },
  
  deleteConversation: async (conversationId, userId) => {
    const response = await api.delete(`/chat/conversations/${conversationId}`, {
      params: { user_id: userId }
    });
    return response.data;
  },
  
  replyToMessage: async (messageId, replyData) => {
    const response = await api.post(`/chat/messages/${messageId}/reply`, replyData);
    return response.data;
  },
  
  forwardMessage: async (messageId, forwardData) => {
    const response = await api.post(`/chat/messages/${messageId}/forward`, forwardData);
    return response.data;
  },
  
  starMessage: async (messageId, userId) => {
    const response = await api.post(`/chat/messages/${messageId}/star`, null, {
      params: { user_id: userId }
    });
    return response.data;
  },
};

// Reactions API
export const reactionsAPI = {
  addReaction: async (messageId, emoji, userId) => {
    const response = await api.post(`/reactions/messages/${messageId}/react`, {
      emoji,
      user_id: userId,
      action: 'add'
    });
    return response.data;
  },

  removeReaction: async (messageId, emoji, userId) => {
    const response = await api.post(`/reactions/messages/${messageId}/react`, {
      emoji,
      user_id: userId,
      action: 'remove'
    });
    return response.data;
  },

  getReactions: async (messageId) => {
    const response = await api.get(`/reactions/messages/${messageId}`);
    return response.data;
  },
};

// Files API
export const filesAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (userId, limit = 50) => {
    try {
      const response = await api.get(`/notifications/user/${userId}`, {
        params: { limit }
      });
      // Handle both array and object responses
      if (Array.isArray(response.data)) {
        return { notifications: response.data, count: response.data.length };
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array on error instead of throwing
      return { notifications: [], count: 0 };
    }
  },

  getUnreadCount: async (userId) => {
    const response = await api.get(`/notifications/unread-count/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (userId) => {
    const response = await api.post(`/notifications/mark-all-read/${userId}`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Translation API
export const translationAPI = {
  translate: async (text, targetLanguage, sourceLanguage = null) => {
    const response = await api.post('/chat/translate', {
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
    });
    return response.data;
  },

  getSupportedLanguages: async () => {
    const response = await api.get('/chat/languages');
    return response.data;
  },
};

// Privacy API
export const privacyAPI = {
  blockUser: async (blockerId, blockedId) => {
    const response = await api.post(`/privacy/block/${blockedId}`, null, {
      params: { blocker_id: blockerId }
    });
    return response.data;
  },
  
  unblockUser: async (unblockerId, unblockedId) => {
    const response = await api.post(`/privacy/unblock/${unblockedId}`, null, {
      params: { unblocker_id: unblockerId }
    });
    return response.data;
  },
  
  getBlockedUsers: async (userId) => {
    const response = await api.get(`/privacy/blocked/${userId}`);
    return response.data;
  },
  
  updatePrivacySettings: async (userId, settings) => {
    const response = await api.put(`/privacy/settings/${userId}`, settings);
    return response.data;
  },
  
  getPrivacySettings: async (userId) => {
    const response = await api.get(`/privacy/settings/${userId}`);
    return response.data;
  },
};

export const contactAPI = {
  sendMessage: async ({ name, email, message }) => {
    const response = await api.post('/auth/contact', { name, email, message });
    return response.data;
  },
};

export default api;