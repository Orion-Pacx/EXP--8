import axios from "axios";

// ✅ FIXED - Backend runs on PORT 5000
const baseURL = "https://exp8-y3w1.onrender.com";

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export const axiosInstance = axios.create({ 
  baseURL,  // http://localhost:5000
  timeout: 15000,  // 15 seconds
  headers: {
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use((config) => {
  console.log("🔄 Request:", config.method?.toUpperCase(), config.url);  // Debug
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.config.url);  // Debug
    return response;
  },
  (error) => {
    console.error("❌ Error:", error.response?.status, error.config?.url);  // Debug
    if (error.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);