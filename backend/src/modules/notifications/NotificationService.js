// backend/src/modules/notifications/NotificationService.js
const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const { Dropbox } = require('dropbox');
const prisma = new PrismaClient();
const ProviderFactory = require('../../connectors/base/ProviderFactory');

// Cache simple (1 minute)
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

class NotificationService {
  /**
   * Récupère toutes les notifications pour un utilisateur
   */
  async getUserNotifications(userId, options = {}) {
    const { source, limit = 20, includeRead = true } = options;

    const cacheKey = `notifications:${userId}:${source || 'all'}:${includeRead}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const notifications = [];

      // 1. Notifications internes
      if (!source || source === 'app') {
        const appNotifs = await this._getAppNotifications(userId, includeRead);
        notifications.push(...appNotifs);
      }

      // 2. Activités Google Drive
      if (!source || source === 'google') {
        const googleNotifs = await this._getGoogleNotifications(userId);
        notifications.push(...googleNotifs);
      }

      // 3. Changements Dropbox
      if (!source || source === 'dropbox') {
        const dropboxNotifs = await this._getDropboxNotifications(userId);
        notifications.push(...dropboxNotifs);
      }

      const sorted = notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      cache.set(cacheKey, { data: sorted, timestamp: Date.now() });

      return sorted;
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      throw error;
    }
  }

  /**
   * Notifications internes (DB)
   */
  async _getAppNotifications(userId, includeRead) {
    const where = { userId };
    if (!includeRead) where.isRead = false;

    const notifs = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return notifs.map((n) => ({
      id: n.id,
      source: n.source,
      type: n.type,
      message: n.message,
      timestamp: n.createdAt.toISOString(),
      isRead: n.isRead,
      metadata: n.metadata,
    }));
  }

  /**
   * Activités Google Drive récentes
   */
  async _getGoogleNotifications(userId) {
    try {
      const account = await prisma.cloudAccount.findFirst({
        where: { userId, provider: 'google_drive' },
      });

      if (!account) return [];

      const provider = ProviderFactory.create('google_drive', {
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        userId,
      });

      if (!provider || !provider.auth) return [];

      const drive = google.drive({ version: 'v3', auth: provider.auth });

      const response = await drive.files.list({
        pageSize: 10,
        orderBy: 'modifiedTime desc',
        fields: 'files(id, name, modifiedTime, mimeType, owners)',
        q: "trashed = false",
      });

      if (!response.data.files?.length) return [];

      return response.data.files.map((file) => ({
        id: `google_${file.id}_${Date.now()}`,
        source: 'google',
        type: 'file_modified',
        message: `📄 "${file.name}" a été modifié`,
        timestamp: file.modifiedTime,
        isRead: false,
        metadata: {
          fileId: file.id,
          fileName: file.name,
          mimeType: file.mimeType,
        },
      }));
    } catch (error) {
      console.warn('Erreur Google notifications:', error.message);
      return [];
    }
  }

  /**
   * Changements Dropbox récents
   */
  async _getDropboxNotifications(userId) {
    try {
      // Si DropboxProvider est commenté dans la Factory, ça lèvera une erreur.
      const account = await prisma.cloudAccount.findFirst({
        where: { userId, provider: 'dropbox' },
      });

      if (!account) return [];

      const provider = ProviderFactory.create('dropbox', {
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        userId,
      });

      if (!provider || !provider.accessToken) return [];

      const dbx = new Dropbox({ accessToken: provider.accessToken });

      const response = await dbx.filesListFolder({
        path: '',
        recursive: false,
        limit: 10,
      });

      if (!response.result.entries?.length) return [];

      return response.result.entries
        .filter((entry) => entry['.tag'] === 'file')
        .sort(
          (a, b) =>
            new Date(b.server_modified) - new Date(a.server_modified)
        )
        .slice(0, 10)
        .map((file) => ({
          id: `dropbox_${file.id}_${Date.now()}`,
          source: 'dropbox',
          type: 'file_modified',
          message: `📁 "${file.name}" a été mis à jour`,
          timestamp: file.server_modified,
          isRead: false,
          metadata: {
            fileId: file.id,
            fileName: file.name,
            pathDisplay: file.path_display,
          },
        }));
    } catch (error) {
      console.warn('Erreur Dropbox notifications:', error.message);
      return [];
    }
  }

  /**
   * Crée une notification interne
   */
  async createAppNotification(userId, type, message, metadata = {}) {
    return await prisma.notification.create({
      data: {
        userId,
        source: 'app',
        type,
        message,
        metadata,
      },
    });
  }

  /**
   * Marque une notification comme lue
   */
  async markAsRead(notificationId, userId) {
    return await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /**
   * Marque toutes les notifications comme lues
   */
  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Compte les notifications non lues
   */
  async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}

module.exports = new NotificationService();
