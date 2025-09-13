// src/services/notificationService.ts
import api from './api';

export const sendNotification = async (userId: string, type: string, data: any) => {
  try {
    const response = await api.post('/notifications', {
      userId,
      type,
      data
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send notification');
  }
};

export const getUserNotifications = async (limit = 20) => {
  try {
    const response = await api.get(`/notifications?limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const markAsRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get unread count');
  }
};

// Real-time notifications using polling
export const listenForNotifications = (callback: (notifications: any[]) => void, pollInterval = 30000) => {
  let isActive = true;
  
  const poll = async () => {
    if (!isActive) return;
    
    try {
      const response = await getUserNotifications();
      if (response.success) {
        callback(response.notifications);
      }
    } catch (error) {
      console.error('Error polling notifications:', error);
    }
    
    if (isActive) {
      setTimeout(poll, pollInterval);
    }
  };
  
  poll();
  
  // Return a function to stop listening
  return () => {
    isActive = false;
  };
};