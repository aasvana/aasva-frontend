import { API_BASE_URL, API_KEY } from '@/constants';
import { useAuthStore } from '@/stores/AuthStore';
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY } },
          );

          const { accessToken, refreshToken: newRefreshToken, user, subscription } = res.data;
          useAuthStore.getState().restoreAuth(accessToken, newRefreshToken, user, subscription);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
        }
      } else {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
  }
);

export default api;
