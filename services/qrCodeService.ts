// src/services/qrCodeService.ts
import api from './api';

export const generateQRCodeData = (userId: string, userIdentifier: string, plateNumber: string) => {
  return `USER:${userId}|ID:${userIdentifier}|CAR:${plateNumber}|TIMESTAMP:${Date.now()}`;
};

export const saveQRCode = async (userId: string, plateNumber: string, qrCodeData: string) => {
  try {
    const response = await api.post('/qrcodes/save', {
      userId,
      plateNumber,
      qrCodeData
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save QR code');
  }
};