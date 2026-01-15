import axios from "axios";
import loadingEventBus, {
  SHOW_LOADING,
  HIDE_LOADING,
} from "../utils/loadingEventBus";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:3200/api";
  return url.endsWith("/api") ? url : `${url.replace(/\/$/, "")}/api`;
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const isAuthCheck =
      config.url?.includes("/auth/me") && config.method === "get";
    const isRefresh = config.url?.includes("/auth/refresh");

    if (!isAuthCheck && !isRefresh) {
      loadingEventBus.dispatch(SHOW_LOADING);
    }
    return config;
  },
  (error) => {
    loadingEventBus.dispatch(HIDE_LOADING);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    loadingEventBus.dispatch(HIDE_LOADING);
    return response;
  },
  async (error) => {
    loadingEventBus.dispatch(HIDE_LOADING);
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const isAuthEndpoint =
      (originalRequest.url?.includes("/auth/me") &&
        originalRequest.method === "get") ||
      originalRequest.url?.includes("/auth/refresh");

    if (isAuthEndpoint) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${getBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
