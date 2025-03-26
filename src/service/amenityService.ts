// import axios from "axios";
// import config from "../config";

// const API_BASE_URL = config.API_BASE_URL;

// const getAuthToken = () => localStorage.getItem("token");

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use(
//   (requestConfig) => {
//     const token = getAuthToken();
//     if (token) {
//       requestConfig.headers = requestConfig.headers || {};
//       requestConfig.headers.Authorization = `Bearer ${token}`;
//     }
//     return requestConfig;
//   },
//   (error) => Promise.reject(error)
// );

// export const amenityService = {
//   getAmenities: () => api.get("/landowner/all/amenities"),
//   deleteAmenity: (id: number) => api.delete(`landowner/delete/amenities/${id}`),
//   addAmenity: (formData: FormData) =>
//     api.post("/landowner/add-amenities", formData),
// };

// export default api;

import axios from "axios";
import config from "../config";

const API_BASE_URL = config.API_BASE_URL;

// Function to get the Auth Token
const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "multipart/form-data" },
});

// Add Bearer Token to Every Request
api.interceptors.request.use(
  (requestConfig) => {
    const token = getAuthToken();
    if (token) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

export const amenityService = {
  addAmenity: async (formData: FormData) => {
    return await api.post("/landowner/add-amenities", formData);
  },
  getAmenities: () => api.get("/landowner/all/amenities"),
  deleteAmenity: (id: number) => api.delete(`landowner/delete/amenities/${id}`),
};

export default api;
