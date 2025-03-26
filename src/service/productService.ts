import axios from "axios";
import config from "../config";

const API_BASE_URL = config.API_BASE_URL;
const API_BASE_AUTH_URL = config.API_BASE_AUTH_URL;

const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const apiAuth = axios.create({
  baseURL: API_BASE_AUTH_URL,
  headers: { "Content-Type": "application/json" },
});

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

apiAuth.interceptors.request.use(
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

export const productService = {
  getProducts: () => api.get("/product/list"),
  deleteProduct: (id: number) => api.delete(`/product/delete/${id}`),

  getProductsSortedByPrice: () => api.get("/product/min-to-max-price"),
  getProductsSortedBymaxPrice2: () => api.get("/product/max-to-min-price"),

  filterByPrice: (minPrice: number, maxPrice: number) => {
    return api.post("/product/price-range", {
      min_price: minPrice,
      max_price: maxPrice,
    });
  },

  filterByAmenities: (amenity: string) => {
    return api.post("/product/filter/desired-amenities", {
      desired_amenities: amenity,
    });
  },

  getProductDetails: (id: number) => apiAuth.get(`/mp/product/details/${id}`),

  /**
   * Add a new product with FormData
   * @param {FormData} formData
   */
  addProduct: async (formData: FormData) => {
    try {
      const token = getAuthToken();
      const response = await api.post("/product/add", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensures correct file upload handling
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  /**
   * Send a message to the property owner
   * @param {Object} data - The message data (message, recipient_email, product_id)
   */

  contactOwner: async (data: object) => {
    try {
      const token = localStorage.getItem("token"); // Get auth token if needed
      const response = await api.post("/product/contact-owner", data, {
        headers: {
          "Authorization": `Bearer ${token}`, // Ensure authentication
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error contacting owner:", error);
      throw error;
    }
  },
  getContactRequests: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/product/contact-requests", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.requests;
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      throw error;
    }
  },

  getLandownerRequests: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/product/landowner/to/all-requests", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.requests;
    } catch (error) {
      console.error("Error fetching landowner requests:", error);
      throw error;
    }
  },

  updateRequestStatus: async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/product/status/change",
        { id, status },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  },
};
