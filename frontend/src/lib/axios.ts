import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: true,
});


// Attach access token
apiClient.interceptors.request.use(
  (config) => {

    const accessToken =
      useAuthStore.getState()
        .accessToken;

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  }
);


// Refresh access token when expired
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(
        '/auth/refresh'
      ) &&
      !originalRequest.url?.includes(
        '/auth/login'
      )
    ) {

      originalRequest._retry = true;

      try {

        const response =
          await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            }
          );

        const newAccessToken =
          response.data.accessToken;

        useAuthStore
          .getState()
          .setAccessToken(
            newAccessToken
          );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return apiClient(
          originalRequest
        );

      } catch (refreshError) {

        useAuthStore
          .getState()
          .clearAuth();

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;