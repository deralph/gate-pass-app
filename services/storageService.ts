// src/services/storageService.ts
import api from './api';

export const uploadToStorage = async (uri: string, path: string) => {
  try {
    const formData = new FormData();
    
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('file', {
      uri: uri,
      name: `upload.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    
    formData.append('path', path);
    
    const response = await api.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload file');
  }
};