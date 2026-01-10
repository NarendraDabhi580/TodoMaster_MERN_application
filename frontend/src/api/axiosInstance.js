import axios from "axios";
import loadingEventBus, {
  SHOW_LOADING,
  HIDE_LOADING,
} from "../utils/loadingEventBus";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:3200/api",
  withCredentials: true, // Important: Send cookies with requests
});

// Track if a refresh is in progress to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to show loading
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip loading for auth verification and refresh endpoints
    if (
      !config.url?.includes("/auth/me") &&
      !config.url?.includes("/auth/refresh")
    ) {
      loadingEventBus.dispatch(SHOW_LOADING);
    }
    return config;
  },
  (error) => {
    loadingEventBus.dispatch(HIDE_LOADING);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and hide loading
axiosInstance.interceptors.response.use(
  (response) => {
    loadingEventBus.dispatch(HIDE_LOADING);
    return response;
  }, // Pass through successful responses
  async (error) => {
    loadingEventBus.dispatch(HIDE_LOADING);
    const originalRequest = error.config;

    // Skip interceptor for auth verification and refresh endpoints
    if (
      originalRequest.url?.includes("/auth/me") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the access token
        await axios.post(
          "http://localhost:3200/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Token refreshed successfully, process queued requests
        processQueue(null, null);
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear auth state and redirect to login
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
