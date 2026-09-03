import axios from "axios";

import { useAuthStore } from "../store/auth.store";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

/**
 * Refresh access token
 *
 * The refresh token is stored in an
 * httpOnly cookie, so we don't manually
 * read or send it.
 */
const refreshAccessToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
};

/**
 * Prevent multiple refresh requests
 * when several APIs return 401 at the
 * same time.
 */
let isRefreshing = false;

let refreshSubscribers: Array<
  () => void
> = [];

const subscribeTokenRefresh = (
  callback: () => void
) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = () => {
  refreshSubscribers.forEach(
    (callback) => callback()
  );

  refreshSubscribers = [];
};

/**
 * Response interceptor
 *
 * If access token expires:
 *
 * 401
 * ↓
 * refresh cookie
 * ↓
 * backend creates new access token
 * ↓
 * backend sets httpOnly cookie
 * ↓
 * retry original request
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes(
        "/auth/refresh"
      ) ||
      originalRequest.url?.includes(
        "/auth/login"
      )
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * Another request is already
     * refreshing the access token.
     */
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(
            apiClient(
              originalRequest
            )
          );
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshAccessToken();

      onRefreshed();

      return apiClient(
        originalRequest
      );
    } catch (refreshError) {
      refreshSubscribers = [];

      useAuthStore
        .getState()
        .clearAuth();

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;