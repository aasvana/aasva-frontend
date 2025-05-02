import { API_BASE_URL, API_KEY } from '@/constants';
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.';
    
    return Promise.reject(new Error(message));
  }
);

export default api;
