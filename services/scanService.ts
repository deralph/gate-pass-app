// src/services/scanService.ts
import api from './api';

// export const processScan = async (qrCodeData: string, adminId: string) => {
//   try {
//     const response = await api.post('/scans/process', {
//       qrCodeData,
//       adminId
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Failed to process scan');
//   }
// };

// export const updateScanResult = async (scanId: string, result: 'approved' | 'denied', reason?: string) => {
//   try {
//     const response = await api.put(`/scans/${scanId}/result`, {
//       result,
//       reason
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Failed to update scan result');
//   }
// };

export const getScanHistory = async (userId?: string, limit = 20) => {
  try {
    const url = userId 
      ? `/scans/history/${userId}?limit=${limit}`
      : `/scans/history?limit=${limit}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scan history');
  }
};

export const handleAccessDenied = async (userId: string, plateNumber: string, adminId: string, reason = "Driver mismatch detected") => {
  try {
    const response = await api.post('/scans/access-denied', {
      userId,
      plateNumber,
      adminId,
      reason
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to handle access denied');
  }
};

export const handleVehicleUsageAlert = async (userId: string, plateNumber: string, scanData: any) => {
  try {
    const response = await api.post('/scans/vehicle-usage', {
      userId,
      plateNumber,
      scanData
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to handle vehicle usage alert');
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

export const processScan = async (qrCodeData: string, adminId: string) => {
  try {
    const response = await api.post('/scans/process', {
      qrCodeData,
      adminId
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