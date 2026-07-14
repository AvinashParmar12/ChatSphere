// ==============================
// Imports
// ==============================

import axios from "axios";
import { getToken } from "@/utils/token";

// ==============================
// Axios Instance
// ==============================

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Request Interceptor
// ==============================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);