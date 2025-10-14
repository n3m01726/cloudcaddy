// backend/src/connectors/GoogleDriveProvider.js
const { google } = require('googleapis');
const { createAuthenticatedGoogleClient } = require('../config/oauth.js');
const { BaseStorageProvider } = require('./base/BaseStorageProvider.js');
const { streamToBuffer, bufferToStream } = require('./utils/streamHelpers.js');

/**
 * Provider pour Google Drive
 */
class GoogleDriveProvider extends BaseStorageProvider {
  constructor(accessToken, refreshToken = null, userId = null) {
    super('google_drive');
    this.auth = createAuthenticatedGoogleClient(accessToken, refreshToken, userId);
    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.userId = userId;
  }

  async listFiles(folderId = 'root', options = {}) {
    return this._handleOperation('list', 'listFiles', async () => {
      const { pageSize = 100 } = options;
      const query = this._buildParentQuery(folderId);

      const response = await this.drive.files.list({
        q: query,
        pageSize,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, createdTime, iconLink, webViewLink, parents)',
        orderBy: 'folder,name',
      });

      return (response.data.files || []).map(file =>
        this._normalizeFile(file, {
          iconLink: file.iconLink,
          webViewLink: file.webViewLink,
          path: folderId === 'root' ? '/' : folderId,
        })
      );
    });
  }

  async search(query, options = {}) {
    return this._handleOperation('search', 'search', async () => {
      const { pageSize = 50 } = options;
      const searchQuery = `name contains '${query}' and trashed = false`;

      const response = await this.drive.files.list({
        q: searchQuery,
        pageSize,
        fields: 'files(id, name, mimeType, size, modifiedTime, iconLink, webViewLink)',
        orderBy: 'modifiedTime desc',
      });

      return (response.data.files || []).map(file =>
        this._normalizeFile(file, {
          iconLink: file.iconLink,
          webViewLink: file.webViewLink,
        })
      );
    });
  }

  async downloadFile(fileId) {
    return this._handleOperation('download', 'downloadFile', async () => {
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );
      return streamToBuffer(response.data);
    });
  }

  async uploadFile(fileBuffer, fileName, options = {}) {
    return this._handleOperation('upload', 'uploadFile', async () => {
      const { mimeType, folderId = null } = options;

      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : ['root'],
      };

      const media = {
        mimeType,
        body: bufferToStream(fileBuffer),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name, mimeType, size',
      });

      return this._normalizeFile(response.data);
    });
  }

  async getFileMetadata(fileId) {
    return this._handleOperation('metadata', 'getFileMetadata', async () => {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, modifiedTime, createdTime, webViewLink',
      });

      return this._normalizeFile(response.data, {
        webViewLink: response.data.webViewLink,
      });
    });
  }

  async getPreviewUrl(fileId, options = {}) {
    return this._handleOperation('preview', 'getPreviewUrl', async () => {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink',
      });

      const file = response.data;

      if (this._isGoogleNativeDoc(file.mimeType)) {
        return {
          ...this._normalizeFile(file),
          previewUrl: file.webViewLink,
          downloadUrl: file.webContentLink,
          thumbnailUrl: file.thumbnailLink,
        };
      }

      const previewUrl = this.userId
        ? `/files/preview-proxy/${this.providerName}/${fileId}?userId=${this.userId}`
        : `/files/preview-proxy/${this.providerName}/${fileId}`;

      return {
        ...this._normalizeFile(file),
        previewUrl,
        downloadUrl: file.webContentLink,
        thumbnailUrl: file.thumbnailLink,
      };
    });
  }

  async moveFile(fileId, newParentId, options = {}) {
    return this._handleOperation('move', 'moveFile', async () => {
      let { oldParentId } = options;

      if (!oldParentId) {
        const fileResponse = await this.drive.files.get({
          fileId,
          fields: 'parents'
        });
        oldParentId = fileResponse.data.parents[0];
      }

      const response = await this.drive.files.update({
        fileId,
        addParents: newParentId,
        removeParents: oldParentId,
        fields: 'id, name, parents, webViewLink'
      });

      return {
        ...this._normalizeFile(response.data),
        parents: response.data.parents,
        webViewLink: response.data.webViewLink,
        success: true,
      };
    });
  }

  async copyFile(fileId, newParentId, options = {}) {
    return this._handleOperation('copy', 'copyFile', async () => {
      const { newName } = options;

      const copyMetadata = {
        parents: [newParentId],
        ...(newName && { name: newName })
      };

      const response = await this.drive.files.copy({
        fileId,
        requestBody: copyMetadata,
        fields: 'id, name, parents, webViewLink'
      });

      return {
        ...this._normalizeFile(response.data),
        parents: response.data.parents,
        webViewLink: response.data.webViewLink,
        success: true,
      };
    });
  }

  // ===== MÉTHODES PRIVÉES =====

  _detectFileType(file) {
    return file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file';
  }

  _buildParentQuery(folderId) {
    return folderId === 'root'
      ? "'root' in parents and trashed = false"
      : `'${folderId}' in parents and trashed = false`;
  }

  _isGoogleNativeDoc(mimeType) {
    return mimeType.includes('google-apps');
  }

  async getThumbnail(fileId) {
    return this._handleOperation('thumbnail', 'getThumbnail', async () => {
      const axios = require('axios');

      const metadata = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, thumbnailLink'
      });

      if (metadata.data.mimeType.startsWith('image/')) {
        const response = await this.drive.files.get(
          { fileId, alt: 'media' },
          { responseType: 'arraybuffer' }
        );

        return {
          buffer: Buffer.from(response.data),
          mimeType: metadata.data.mimeType
        };
      }

      if (metadata.data.thumbnailLink) {
        const thumbnailUrl = metadata.data.thumbnailLink.replace('=s220', '=s512');

        const response = await axios.get(thumbnailUrl, {
          headers: {
            'Authorization': `Bearer ${this.auth.credentials.access_token}`
          },
          responseType: 'arraybuffer'
        });

        return {
          buffer: Buffer.from(response.data),
          mimeType: 'image/png'
        };
      }

      throw new Error('Aucun thumbnail disponible pour ce fichier');
    });
  }
}

module.exports = GoogleDriveProvider;
