// src/services/carService.ts
import api from './api';

export const addCar = async (carData: any, carImage: string | null) => {
  try {
    const formData = new FormData();
    
    formData.append('plateNumber', carData.plateNumber);
    formData.append('model', carData.model);
    formData.append('color', carData.color);
    
    if (carImage) {
      const uriParts = carImage.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('carImage', {
        uri: carImage,
        name: `${carData.plateNumber}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }
    
    const response = await api.post('/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add car');
  }
};

export const getUserCars = async () => {
  try {
    const response = await api.get('/cars');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cars');
  }
};

export const updateCar = async (carId: string, carData: any, carImage: string | null) => {
  try {
    const formData = new FormData();
    
    formData.append('model', carData.model);
    formData.append('color', carData.color);
    
    if (carImage) {
      const uriParts = carImage.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('carImage', {
        uri: carImage,
        name: `${carData.plateNumber}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }
    
    const response = await api.put(`/cars/${carId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update car');
  }
};

export const regenerateQRCode = async (carId: string) => {
  try {
    const response = await api.post(`/cars/${carId}/regenerate-qr`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to regenerate QR code');
  }
};

export const deleteCar = async (carId: string) => {
  try {
    const response = await api.delete(`/cars/${carId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete car');
  }
};