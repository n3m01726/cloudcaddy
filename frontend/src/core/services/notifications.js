import { request } from './apiClient.js';

export const notificationService = {
  getFeed: (userId, { source, includeRead = true, limit = 20 } = {}) => {
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    params.append('includeRead', includeRead);
    params.append('limit', limit);
    return request.get(`/notifications/feed/${userId}?${params}`);
  },
  getUnreadCount: (userId) => request.get(`/notifications/unread/${userId}`),
  create: (userId, source, type, message, metadata = {}) =>
    request.post(`/notifications/create/${userId}`, { source, type, message, metadata }),
  markAsRead: (notificationId, userId) => request.put(`/notifications/read/${notificationId}/${userId}`),
  markAllAsRead: (userId) => request.put(`/notifications/read-all/${userId}`),
};
