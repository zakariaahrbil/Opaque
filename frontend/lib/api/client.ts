import axios, { AxiosError } from "axios";
import { ApiError, type ApiErrorResponse } from "./types";
import { clearAuthToken, getAuthToken } from "../auth";
import { useAuthStore } from "../store/useAuthStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse | string>) => {
    let message = error.message || "An unexpected error occurred.";
    const status = error.response?.status;
    const data = error.response?.data;
    const requestUrl = error.config?.url || "";

    const isAuthEndpoint = requestUrl.includes("/api/auth/login") || requestUrl.includes("/api/auth/register");
    if (status === 401 && !isAuthEndpoint && typeof window !== "undefined") {
      useAuthStore.getState().logout();
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.href = `/login?expired=1&from=${encodeURIComponent(currentPath)}`;
      }
    }

    if (typeof data === "string" && data.trim().length > 0) {
      message = data.trim();
    } else if (typeof data === "object" && data !== null) {
      message = data.message || data.error || message;
    }

    return Promise.reject(new ApiError(message, status, error.code, data));
  }
);

export default apiClient;
