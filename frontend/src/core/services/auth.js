import { request } from './apiClient.js';

export const authService = {
  getGoogleAuthUrl: () => request.get('/auth/google'),
  getDropboxAuthUrl: () => request.get('/auth/dropbox'),
  checkStatus: (userId) => request.get(`/auth/status/${userId}`),
  disconnect: (userId, provider) => request.delete(`/auth/disconnect/${userId}/${provider}`),
  getUserInfo: (userId) => request.get(`/auth/user/info/${userId}`),
};
