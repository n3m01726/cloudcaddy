import { request } from './apiClient.js';
import api from './apiClient.js';

export const filesService = {
  listFiles: (userId, folderId) => request.get(`/files/${userId}${folderId ? `?folderId=${folderId}` : ''}`),
  searchFiles: (userId, query) => request.get(`/files/${userId}/search`, { params: { q: query } }),
  getFileMetadata: (userId, provider, fileId) => request.get(`/files/${userId}/metadata/${provider}/${fileId}`),
  getPreviewUrl: (userId, provider, fileId) => request.get(`/files/${userId}/preview/${provider}/${fileId}`),
  moveFile: (userId, provider, fileId, newParentId, oldParentId = null) =>
    request.post(`/files/${userId}/move`, { provider, fileId, newParentId, oldParentId }),
  copyFile: (userId, provider, fileId, newParentId, newName = null) =>
    request.post(`/files/${userId}/copy`, { provider, fileId, newParentId, newName }),
  deleteFile: (userId, provider, fileId) => request.delete(`/files/${userId}/${provider}/${fileId}`),
  getStarred: (userId) => request.get(`/files/${userId}/starred`),

  downloadFile: async (userId, provider, fileId, fileName) => {
    const res = await api.post(`/files/${userId}/download`, { provider, fileId, fileName }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'download');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  },
};
