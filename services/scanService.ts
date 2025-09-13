// src/services/scanService.ts
import api from './api';

export const processScan = async (qrCodeData: string, studentStaffId: string) => {
  try {
    const response = await api.post('/scans/process', {
      qrCodeData,
      studentStaffId
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process scan');
  }
};

export const updateScanResult = async (scanId: string, result: 'approved' | 'denied', reason?: string) => {
  try {
    const response = await api.put(`/scans/${scanId}/result`, {
      result,
      reason
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update scan result');
  }
};

export const getScanHistory = async (userId?: string, limit = 20) => {
  try {
    const url = userId 
      ? `/scans/history?userId=${userId}&limit=${limit}`
      : `/scans/history?limit=${limit}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scan history');
  }
};

export const getScanDetails = async (scanId: string) => {
  try {
    const response = await api.get(`/scans/${scanId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scan details');
  }
};