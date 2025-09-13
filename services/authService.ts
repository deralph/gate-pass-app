// src/services/authService.ts
import api from './api';
import { storeToken, removeToken } from '../utils/tokenStorage';
// import {useAuth} from '../contexts/AuthContext'

export const signUpUser = async (
  email: string, 
  password: string, 
  userData: any, 
  carData: any,
  profileImage: string | null,
  carImage: string | null
) => {
  try {
    const formData = new FormData();
    
    // Append user data
    formData.append('fullName', userData.fullName);
    formData.append('studentStaffId', userData.matric);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNumber', userData.phoneNumber || '');
    formData.append('role', userData.role || 'student');
    
    // Append car data
    if (carData) {
      formData.append('carDetails[plateNumber]', carData.plateNumber);
      formData.append('carDetails[model]', carData.model);
      formData.append('carDetails[color]', carData.color);
    }
    
    // Append images
    if (profileImage) {
      const profileUriParts = profileImage.split('.');
      const profileFileType = profileUriParts[profileUriParts.length - 1];
      
      formData.append('profilePicture', {
        uri: profileImage,
        name: `profile.${profileFileType}`,
        type: `image/${profileFileType}`,
      } as any);
    }
    
    if (carImage && carData) {
      const carUriParts = carImage.split('.');
      const carFileType = carUriParts[carUriParts.length - 1];
      
      formData.append('carPicture', {
        uri: carImage,
        name: `${carData.plateNumber}.${carFileType}`,
        type: `image/${carFileType}`,
      } as any);
    }
    
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success && response.data.token) {
      await storeToken(response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const signInUser = async (email: string, password: string) => {
    console.log("in signin user")
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success && response.data.token) {
      await storeToken(response.data.token);
    }
          // const { login } = useAuth(); // You might need to pass this as a parameter
      // await login(response.data.token, response.data.user);

    
    return response.data;
  } catch (error: any) {
    console.log("signIn error = ", error)
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signInAdmin = async (adminId: string, password: string) => {
  try {
    const response = await api.post('/auth/admin-login', { adminId, password });
    console.log("sign in admin response = ", response)
    if (response.data.success && response.data.token) {
      await storeToken(response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    console.log("sign in admin error  = ", error)
    
    throw new Error(error.response?.data?.message || 'Admin login failed');
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post(`/auth/resetpassword/${token}`, { password: newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

export const createAdminAccount = async (adminData: any) => {
  try {
    const response = await api.post('/auth/create-admin', adminData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Admin account creation failed');
  }
};


// ... (all the existing functions remain the same)

// Add a proper logout function
export const logout = async (): Promise<void> => {
  try {
    // Call your backend logout endpoint if needed
    // await api.post('/auth/logout');
    
    // Remove token from storage
    await removeToken();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};