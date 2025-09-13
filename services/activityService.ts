// src/services/activityService.ts
import api from './api';

export const logActivity = async (userId: string, action: string, details: any = {}) => {
  try {
    const response = await api.post('/activities', {
      userId,
      action,
      details
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to log activity:', error);
    // Don't throw error for activity logging to avoid breaking main functionality
    return { success: false };
  }
};

export const getUserActivities = async (limit = 50) => {
  try {
    const response = await api.get(`/activities/my-activities?limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user activities');
  }
};

export const getAdminActivities = async (limit = 100) => {
  try {
    const response = await api.get(`/activities/admin?limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin activities');
  }
};