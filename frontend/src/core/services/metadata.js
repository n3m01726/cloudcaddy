import { request } from './apiClient.js';

export const metadataService = {
  updateTags: (userId, fileId, cloudType, tags, { itemType = 'file', cascade = false } = {}) =>
    request.put(`/metadata/${userId}/${fileId}/tags?cascade=${cascade}`, { tags, cloudType, itemType }),
  getMetadata: (userId, fileId, cloudType) => request.get(`/metadata/${userId}/${fileId}`, { params: { cloudType } }),
  updateMetadata: (userId, fileId, cloudType, metadata) =>
    request.put(`/metadata/${userId}/${fileId}`, { cloudType, ...metadata }),
  searchByTags: (userId, tags, cloudType = null, itemType = null) => {
    const params = { tags: tags.join(',') };
    if (cloudType) params.cloudType = cloudType;
    if (itemType) params.itemType = itemType;
    return request.get(`/metadata/${userId}/search`, { params });
  }
};
