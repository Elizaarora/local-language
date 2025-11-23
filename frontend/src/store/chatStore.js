import { create } from 'zustand';
import { chatAPI } from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,

  createConversation: async (participant1_id, participant2_id) => {
    set({ loading: true });
    try {
      const conversation = await chatAPI.createConversation(participant1_id, participant2_id);
      set((state) => ({
        conversations: [...state.conversations, conversation],
        currentConversation: conversation,
        loading: false,
      }));
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      set({ loading: false });
      return null;
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  loadMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const messages = await chatAPI.getMessages(conversationId);
      set({ messages, loading: false });
    } catch (error) {
      console.error('Error loading messages:', error);
      set({ loading: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  sendMessage: async (messageData) => {
    try {
      const message = await chatAPI.sendMessage(messageData);
      get().addMessage(message);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },
}));

export default useChatStore;