// API library module
// Configures axios instance with base URL and cookie support for authentication
import axios from "axios";

// Create axios instance with default configuration
// - baseURL: all requests will be prefixed with "/api"
// - withCredentials: enables sending cookies (needed for session management)
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true // Enable sending cookies with requests
});
