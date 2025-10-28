import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const request = {
  get: (url, config) => api.get(url, config).then(res => res.data),
  post: (url, data, config) => api.post(url, data, config).then(res => res.data),
  put: (url, data, config) => api.put(url, data, config).then(res => res.data),
  delete: (url, config) => api.delete(url, config).then(res => res.data),
};

export default api;
