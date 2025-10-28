// backend/src/providers/base/BaseStorageProvider.js

/**
 * Classe de base abstraite pour tous les providers de stockage cloud
 */
class BaseStorageProvider {
  constructor(providerName) {
    if (new.target === BaseStorageProvider) {
      throw new Error('BaseStorageProvider est une classe abstraite');
    }
    this.providerName = providerName;
  }

  /**
   * Liste les fichiers d'un dossier
   * @abstract
   */
  async listFiles(path, options = {}) {
    throw new Error('listFiles() doit être implémentée');
  }

  /**
   * Recherche des fichiers
   * @abstract
   */
  async search(query, options = {}) {
    throw new Error('search() doit être implémentée');
  }

  /**
   * Télécharge un fichier
   * @abstract
   */
  async downloadFile(fileId) {
    throw new Error('downloadFile() doit être implémentée');
  }

  /**
   * Upload un fichier
   * @abstract
   */
  async uploadFile(fileBuffer, fileName, options = {}) {
    throw new Error('uploadFile() doit être implémentée');
  }

  /**
   * Récupère les métadonnées d'un fichier
   * @abstract
   */
  async getFileMetadata(fileId) {
    throw new Error('getFileMetadata() doit être implémentée');
  }

  /**
   * Génère une URL de prévisualisation
   * @abstract
   */
  async getPreviewUrl(fileId, options = {}) {
    throw new Error('getPreviewUrl() doit être implémentée');
  }

  /**
   * Déplace un fichier
   * @abstract
   */
  async moveFile(fileId, destination, options = {}) {
    throw new Error('moveFile() doit être implémentée');
  }

  /**
   * Copie un fichier
   * @abstract
   */
  async copyFile(fileId, destination, options = {}) {
    throw new Error('copyFile() doit être implémentée');
  }

  /**
   * 🆕 Crée un nouveau dossier
   * @param {string} name - Nom du dossier
   * @param {string} parentId - ID du dossier parent (par défaut: 'root')
   * @returns {Promise<Object>} Métadonnées du dossier créé
   */
  async createFolder(name, parentId = 'root') {
    throw new Error('createFolder() doit être implémentée');
  }

  /**
   * 🆕 Déplace un fichier dans un autre dossier
   * @param {string} fileId - ID du fichier à déplacer
   * @param {string} destinationFolderId - ID du dossier de destination
   * @returns {Promise<Object>} Métadonnées du fichier mis à jour
   */
  async moveFile(fileId, destinationFolderId) {
    throw new Error('moveFile() doit être implémentée');
  }

  /**
   * 🆕 Copie un fichier dans un autre dossier
   * @param {string} fileId - ID du fichier à copier
   * @param {string} destinationFolderId - ID du dossier de destination
   * @param {string} newName - Nom facultatif pour la copie
   * @returns {Promise<Object>} Métadonnées du fichier copié
   */
  async copyFile(fileId, destinationFolderId, newName = null) {
    throw new Error('copyFile() doit être implémentée');
  }

  /**
   * 🆕 Supprime un fichier
   * @param {string} fileId - ID du fichier à supprimer
   * @returns {Promise<boolean>} True si la suppression a réussi
   */
  async deleteFile(fileId) {
    throw new Error('deleteFile() doit être implémentée');
  }

  /**
   * 🆕 Récupère les informations d’un dossier
   * @param {string} folderId - ID du dossier
   * @returns {Promise<Object>} Métadonnées du dossier
   */
  async getFolderInfo(folderId) {
    throw new Error('getFolderInfo() doit être implémentée');
  }

  /**
   * Wrapper pour gérer les erreurs de manière uniforme
   * @protected
   */
  async _handleOperation(operation, operationName, fn) {
    try {
      return await fn();
    } catch (error) {
      console.error(`[${this.providerName}] Erreur ${operationName}:`, error.message);
      throw new ProviderError(this.providerName, operationName, error);
    }
  }

  /**
   * Normalise un fichier au format standard
   * @protected
   */
  _normalizeFile(rawFile, additionalData = {}) {
    return {
      id: rawFile.id,
      name: rawFile.name,
      type: this._detectFileType(rawFile),
      mimeType: rawFile.mimeType,
      size: this._normalizeSize(rawFile.size),
      modifiedTime: rawFile.modifiedTime || rawFile.modified,
      createdTime: rawFile.createdTime || rawFile.created,
      provider: this.providerName,
      ...additionalData
    };
  }

  /**
   * Détecte le type de fichier (folder ou file)
   * @protected
   */
  _detectFileType(file) {
    return 'file'; // À surcharger si nécessaire
  }

  /**
   * Normalise la taille du fichier
   * @protected
   */
  _normalizeSize(size) {
    if (!size) return 0;
    return typeof size === 'string' ? parseInt(size, 10) : size;
  }
}

/**
 * Classe d'erreur personnalisée pour les providers
 */
class ProviderError extends Error {
  constructor(provider, operation, originalError) {
    super(`${provider} ${operation} error: ${originalError.message}`);
    this.name = 'ProviderError';
    this.provider = provider;
    this.operation = operation;
    this.originalError = originalError;
    this.statusCode = originalError.statusCode || originalError.code || 500;
  }

  toJSON() {
    return {
      error: this.message,
      provider: this.provider,
      operation: this.operation,
      statusCode: this.statusCode
    };
  }
}


module.exports = {
  BaseStorageProvider,
  ProviderError
};
