// src/service/authService.ts
import axios from "axios";
import config from "../config";
import { message } from "antd";

// API Base URL
const API_BASE_AUTH_URL = config.API_BASE_AUTH_URL;

// Token Management Functions
export const getAuthToken = (): string | null => localStorage.getItem("token");
export const setAuthToken = (token: string) =>
  localStorage.setItem("token", token);
export const clearAuthToken = () => localStorage.removeItem("token");

// Handle Unauthorized Access
export const handleUnauthorized = () => {
  message.error("Session expired. Redirecting to login...");
  clearAuthToken();
  setTimeout(() => {
    window.location.href = "/login"; // Redirect to login page
  }, 1000);
};

// Create Axios Instance for Auth Requests
const apiAuth = axios.create({
  baseURL: API_BASE_AUTH_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach Token to Request Headers
apiAuth.interceptors.request.use((requestConfig) => {
  const token = getAuthToken();
  if (token) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// Handle Unauthorized Errors
apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

// Authentication API Calls
export const login = (username: string, password: string) =>
  apiAuth.post("/auth/signin", { username, password }).then((res) => res.data);

export const signup = (userData: any) =>
  apiAuth.post("/auth/signup", userData).then((res) => res.data);

export const verifyToken = (token: string) =>
  apiAuth.post("/auth/verify-token", { token }).then((res) => res.data);

export const signOut = () =>
  apiAuth.post("/auth/signout", { token: getAuthToken() }).then(() => {
    clearAuthToken();
    window.location.href = "/login"; // Redirect to login
  });

export default apiAuth;
