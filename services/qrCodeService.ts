import { ref, uploadString } from 'firebase/storage';
import { storage } from '../config/firebase';
import * as QRCode from 'qrcode';

export const generateQRCodeData = (userId: string, userIdentifier: string, plateNumber: string) => {
  // Create a unique string that combines user and car data
  return `USER:${userId}|ID:${userIdentifier}|CAR:${plateNumber}|TIMESTAMP:${Date.now()}`;
};

export const saveQRCode = async (userId: string, plateNumber: string, qrCodeData: string) => {
  try {
    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `qrCodes/${userId}/${plateNumber}`);
    await uploadString(storageRef, qrCodeImage, 'data_url');
    
    return { success: true };
  } catch (error) {
    console.error('Save QR code error:', error);
    return { success: false, error };
  }
};