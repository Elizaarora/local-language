import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationsAPI } from '../services/api';
import socketService from '../services/socket';
import useAuthStore from '../store/authStore';

export default function NotificationBell() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
        loadNotifications();
      }, 30000);
      
      // Listen for real-time notifications via Socket.IO
      const handleNotification = (notification) => {
        console.log('🔔 New notification received:', notification);
        // Add to beginning of list and increment unread count
        setNotifications(prev => {
          // Check if notification already exists (avoid duplicates)
          const exists = prev.some(n => n.id === notification.id);
          if (exists) return prev;
          return [notification, ...prev];
        });
        // Only increment if notification is unread
        if (!notification.read) {
          setUnreadCount(prev => prev + 1);
        }
      };
      socketService.onNotification(handleNotification);
      
      return () => {
        clearInterval(interval);
        if (socketService.socket) {
          socketService.socket.off('notification', handleNotification);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.getNotifications(user.id, 10);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount(user.id);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead(user.id);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-[#242530]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-[#2d2e3a]/50 z-50 max-h-[500px] overflow-hidden flex flex-col animate-fade-in">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#2d2e3a] flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#2d2e3a] dark:to-[#353642]">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-[#2d2e3a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No notifications</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-[#2d2e3a]">
                {notifications.map((notif, index) => (
                  <div
                    key={notif.id}
                    className={`p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-[#2d2e3a] transition-all cursor-pointer animate-fade-in ${
                      !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-1">
                          {notif.title || notif.type || 'New Notification'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {notif.message || notif.body || notif.content || 'You have a new notification'}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                          <span>
                            {notif.created_at
                              ? new Date(notif.created_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Just now'}
                          </span>
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

