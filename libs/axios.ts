import { getToken } from "@/app/_actions/cookies";
import axios from "axios";

const api = axios.create({
  baseURL: "https://seaapi.mine.bz/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if(!token) return config;

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Dynamically import to avoid circular dependencies
        const { refreshAction } = await import("@/app/_actions/refresh");
        const result = await refreshAction();

        if (result.success && result.data.accessToken) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${result.data.accessToken}`;
          return api(originalRequest);
        } else {
          // Refresh failed - clear auth state and redirect to login
          const { clearAuthCookies } = await import("@/app/_actions/cookies");
          await clearAuthCookies();
          
          // Redirect to login in the browser
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      } catch (refreshError) {
        // If refresh fails, clear cookies and reject
        const { clearAuthCookies } = await import("@/app/_actions/cookies");
        await clearAuthCookies();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
