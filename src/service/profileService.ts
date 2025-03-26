import axios from "axios";
import config from "../config";

const API_BASE_URL = config.API_BASE_AUTH_URL;

const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const profileService = {
  getProfile: () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token not found in local storage");
    }
    return api.post("/auth/get-profile", { token });
  },
};

export default api;
