import api from './api';

export const getAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
  }
};

export const getAdminAccessLogs = async (limit = 20, page = 1) => {
  try {
    const response = await api.get(`/admin/access-logs?limit=${limit}&page=${page}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch access logs');
  }
};