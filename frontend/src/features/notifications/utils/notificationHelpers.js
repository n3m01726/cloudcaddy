// frontend/src/features/notifications/utils/notificationHelpers.js
import { notificationService } from '@core/services';


/**
 * Helper pour créer des notifications depuis n'importe où dans l'app
 */
export const NotificationHelpers = {
  
  /**
   * Notification de connexion à un service
   */
  async onServiceConnected(userId, serviceName) {
    try {
      await notificationService.create(
        userId,
        'service_connected',
        `${serviceName} connecté avec succès`,
        { service: serviceName }
      );
    } catch (error) {
      console.error('Erreur notification connexion:', error);
    }
  },

  /**
   * Notification de déconnexion
   */
  async onServiceDisconnected(userId, serviceName) {
    try {
      await notificationService.create(
        userId,
        'service_disconnected',
        `${serviceName} déconnecté`,
        { service: serviceName }
      );
    } catch (error) {
      console.error('Erreur notification déconnexion:', error);
    }
  },

  /**
   * Notification d'upload de fichier
   */
  async onFileUploaded(userId, fileName, provider) {
    try {
      await notificationService.create(
        userId,
        'file_uploaded',
        ` ${fileName} uploadé sur ${provider}`,
        { fileName, provider }
      );
    } catch (error) {
      console.error('Erreur notification upload:', error);
    }
  },

  /**
   * Notification de suppression de fichier
   */
  async onFileDeleted(userId, fileName) {
    try {
      await notificationService.create(
        userId,
        'file_deleted',
        `${fileName} supprimé`,
        { fileName }
      );
    } catch (error) {
      console.error('Erreur notification suppression:', error);
    }
  },

  /**
   * Notification de déplacement de fichier
   */
  async onFileMoved(userId, fileName, destination) {
    try {
      await notificationService.create(
        userId,
        'file_moved',
        `📁 "${fileName}" déplacé vers ${destination}`,
        { fileName, destination }
      );
    } catch (error) {
      console.error('Erreur notification déplacement:', error);
    }
  },

  /**
   * Notification de partage de fichier
   */
  async onFileShared(userId, fileName, recipient) {
    try {
      await notificationService.create(
        userId,
        'file_shared',
        `${fileName} partagé avec ${recipient}`,
        { fileName, recipient }
      );
    } catch (error) {
      console.error('Erreur notification partage:', error);
    }
  },

  /**
   * Notification de copie de fichier
   */
  async onFileCopied(userId, fileName, destination) {
    try {
      await notificationService.create(
        userId,
        'file_copied',
        `${fileName} copié vers ${destination}`,
        { fileName, destination }
      );
    } catch (error) {
      console.error('Erreur notification copie:', error);
    }
  },

  /**
   * Notification d'erreur générique
   */
  async onError(userId, errorMessage) {
    try {
      await notificationService.create(
        userId,
        'error',
        `${errorMessage}`,
        { type: 'error' }
      );
    } catch (error) {
      console.error('Erreur notification erreur:', error);
    }
  },

  /**
   * Notification de succès générique
   */
  async onSuccess(userId, successMessage) {
    try {
      await notificationService.create(
        userId,
        'success',
        `${successMessage}`,
        { type: 'success' }
      );
    } catch (error) {
      console.error('Erreur notification succès:', error);
    }
  }
};

export default NotificationHelpers;