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
