// src/services/userService.ts
import api from './api';

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

export const getUserCars = async () => {
  try {
    const response = await api.get('/users/cars');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user cars');
  }
};

export const getUserActivities = async (limit = 10) => {
  try {
    const response = await api.get(`/users/activities?limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user activities');
  }
};