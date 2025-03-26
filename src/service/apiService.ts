// src/service/apiService.ts
import axios from "axios";
import config from "../config";
import { getAuthToken, handleUnauthorized } from "./authService";

// API Base URL
const API_BASE_URL = config.API_BASE_URL;

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach Token to Requests
api.interceptors.request.use((requestConfig) => {
  const token = getAuthToken();
  if (token) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// Handle Unauthorized Response (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

// API Service
export const apiService = {
  post: (url: string, data: any) => api.post(url, data).then((res) => res.data),
  get: (url: string) => api.get(url).then((res) => res.data),
  put: (url: string, data: any) => api.put(url, data).then((res) => res.data),
  delete: (url: string) => api.delete(url).then((res) => res.data),
};

export default api;
