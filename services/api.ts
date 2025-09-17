// src/services/api.ts
import axios from "axios";
import { getToken, removeToken } from "../utils/tokenStorage";

// npm install --global eas-cli && eas init --id aac28bfa-9fec-43d5-a7d1-3ef7380f63bb
// https://gate-pass-backend-yz1r.onrender.com
// const API_BASE_URL = "https://gate-pass-backend-yz1r.onrender.com/api";
const API_BASE_URL = "http://192.168.45.193:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await removeToken();
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

export default api;
