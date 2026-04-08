import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const tokenStr = localStorage.getItem('token');
  if (tokenStr) {
    // Token is stored as JSON string, need to parse it
    let token = tokenStr;
    try {
      const parsed = JSON.parse(tokenStr);
      if (typeof parsed === 'string') {
        token = parsed;
      }
    } catch {
      // Not JSON, use as-is
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;