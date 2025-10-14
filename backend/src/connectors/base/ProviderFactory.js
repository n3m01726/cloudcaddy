const GoogleDriveProvider = require('../GoogleDriveProvider');
// const DropboxProvider = require('../providers/DropboxProvider');
// const OneDriveProvider = require('../providers/OneDriveProvider');

/**
 * Factory pour créer les instances de providers
 */
class ProviderFactory {
  static PROVIDERS = {
    google_drive: GoogleDriveProvider,
    // dropbox: DropboxProvider,
    // onedrive: OneDriveProvider,
  };

  /**
   * Crée une instance de provider
   * @param {string} providerName - Nom du provider (google_drive, dropbox, etc.)
   * @param {Object} credentials - Credentials pour l'authentification
   * @returns {BaseStorageProvider}
   */
  static create(providerName, credentials) {
    const ProviderClass = this.PROVIDERS[providerName];

    if (!ProviderClass) {
      throw new Error(`Provider inconnu: ${providerName}`);
    }

    const { accessToken, refreshToken, userId } = credentials;
    return new ProviderClass(accessToken, refreshToken, userId);
  }

  /**
   * Vérifie si un provider est supporté
   * @param {string} providerName
   * @returns {boolean}
   */
  static isSupported(providerName) {
    return providerName in this.PROVIDERS;
  }

  /**
   * Liste tous les providers disponibles
   * @returns {Array<string>}
   */
  static getAvailableProviders() {
    return Object.keys(this.PROVIDERS);
  }
}

module.exports = ProviderFactory;