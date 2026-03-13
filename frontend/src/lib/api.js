// API library module
// Configures axios instance with base URL and cookie support for authentication
import axios from "axios";

// Get API URL from environment variable (for production) or use proxy (for local dev)
// In production: https://portfolio-backend.onrender.com
// In dev: /api (proxied to localhost:4000)
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Production: use full URL (remove /api suffix if present)
    return envUrl.replace(/\/api$/, '');
  }
  // Development: use proxy
  return '';
};

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: getApiUrl() + "/api",
  withCredentials: true
});

// Also ensure credentials are sent with every request and let browser set Content-Type for FormData
api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});
