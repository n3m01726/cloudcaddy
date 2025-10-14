// backend/src/connectors/DropboxProvider.js
const axios = require('axios');

class DropboxConnector {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiUrl = 'https://api.dropboxapi.com/2';
    this.contentUrl = 'https://content.dropboxapi.com/2';
  }

  async request(endpoint, data = {}, isContentApi = false) {
    const baseUrl = isContentApi ? this.contentUrl : this.apiUrl;

    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur Dropbox API (${endpoint}):`, error.response?.data || error.message);
      throw new Error(`Dropbox API error: ${error.response?.data?.error_summary || error.message}`);
    }
  }

  async listFiles(path = '') {
    const data = await this.request('/files/list_folder', { path: path || '', limit: 100 });
    const entries = data.entries || [];
    return entries.map(entry => ({
      id: entry.id,
      name: entry.name,
      type: entry['.tag'] === 'folder' ? 'folder' : 'file',
      path: entry.path_lower,
      size: entry.size || 0,
      modifiedTime: entry.server_modified || entry.client_modified,
      provider: 'dropbox',
    }));
  }

  async search(query) {
    const data = await this.request('/files/search_v2', {
      query,
      options: { max_results: 50 },
    });

    const matches = data.matches || [];
    return matches.map(match => {
      const metadata = match.metadata.metadata;
      return {
        id: metadata.id,
        name: metadata.name,
        type: metadata['.tag'] === 'folder' ? 'folder' : 'file',
        path: metadata.path_lower,
        size: metadata.size || 0,
        modifiedTime: metadata.server_modified || metadata.client_modified,
        provider: 'dropbox',
      };
    });
  }

  async downloadFile(path) {
    const response = await axios.post(`${this.contentUrl}/files/download`, null, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({ path }),
      },
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  }

  async uploadFile(fileBuffer, path) {
    const response = await axios.post(`${this.contentUrl}/files/upload`, fileBuffer, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path,
          mode: 'add',
          autorename: true,
        }),
      },
    });

    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      path: data.path_lower,
      size: data.size,
      provider: 'dropbox',
    };
  }

  async getFileMetadata(path) {
    const data = await this.request('/files/get_metadata', { path });
    return {
      id: data.id,
      name: data.name,
      type: data['.tag'] === 'folder' ? 'folder' : 'file',
      path: data.path_lower,
      size: data.size || 0,
      modifiedTime: data.server_modified || data.client_modified,
      provider: 'dropbox',
    };
  }
}

module.exports = DropboxConnector;
