const { prisma } = require('../config/database');
const ProviderFactory = require('../connectors/base/ProviderFactory');

/**
 * Service pour gérer les opérations sur les fichiers multi-cloud
 */
class FileService {
  /**
   * Récupère tous les comptes cloud d'un utilisateur
   * @private
   */
  async _getCloudAccounts(userId) {
    const accounts = await prisma.cloudAccount.findMany({ 
      where: { userId } 
    });
    
    if (!accounts || accounts.length === 0) {
      return { accounts: [], error: 'Aucun service cloud connecté' };
    }
    
    return { accounts, error: null };
  }

  /**
   * Crée une instance de provider pour un compte
   * @private
   */
  _createProvider(account, userId = null) {
    return ProviderFactory.create(account.provider, {
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      userId: userId
    });
  }

  /**
   * Exécute une opération sur tous les providers de l'utilisateur
   * @private
   */
  async _executeOnAllProviders(userId, operation) {
    const { accounts, error } = await this._getCloudAccounts(userId);
    if (error) return { results: [], error };

    const results = [];

    for (const account of accounts) {
      try {
        const provider = this._createProvider(account, userId);
        const result = await operation(provider, account);
        
        if (Array.isArray(result)) {
          results.push(...result);
        } else if (result) {
          results.push(result);
        }
      } catch (err) {
        console.error(`Erreur pour ${account.provider}:`, err.message);
        // Continue avec les autres providers
      }
    }

    return { results, error: null };
  }

  /**
   * Liste tous les fichiers d'un utilisateur
   */
  async listFiles(userId, folderId = null) {
    const { results, error } = await this._executeOnAllProviders(userId, async (provider) => {
      return await provider.listFiles(folderId || 'root');
    });

    return {
      success: true,
      files: results,
      count: results.length,
      message: error || (results.length === 0 ? 'Aucun fichier trouvé' : undefined)
    };
  }

  /**
   * Recherche des fichiers
   */
  async searchFiles(userId, query) {
    if (!query?.trim()) {
      return {
        success: false,
        error: 'Le paramètre de recherche est requis'
      };
    }

    const { results, error } = await this._executeOnAllProviders(userId, async (provider) => {
      return await provider.search(query);
    });

    return {
      success: true,
      files: results,
      count: results.length,
      query: query,
      message: error || (results.length === 0 ? `Aucun fichier trouvé pour "${query}"` : undefined)
    };
  }

  /**
   * Récupère les fichiers favoris
   */
  async getStarredFiles(userId) {
    // Récupérer les métadonnées des fichiers starred
    const starredMetadata = await prisma.fileMetadata.findMany({
      where: { userId, starred: true }
    });

    if (starredMetadata.length === 0) {
      return {
        success: true,
        files: [],
        count: 0,
        message: 'Aucun fichier favori'
      };
    }

    const { accounts, error } = await this._getCloudAccounts(userId);
    if (error) {
      return { success: true, files: [], message: error };
    }

    const allFiles = [];

    for (const metadata of starredMetadata) {
      try {
        const account = accounts.find(acc => acc.provider === metadata.cloudType);
        if (!account) continue;

        const provider = this._createProvider(account, userId);
        
        try {
          const fileInfo = await provider.getFileMetadata(metadata.fileId);
          
          // Enrichir avec les métadonnées locales
          allFiles.push({
            ...fileInfo,
            tags: JSON.parse(metadata.tags || '[]'),
            customName: metadata.customName,
            description: metadata.description,
            starred: true
          });
        } catch (err) {
          console.warn(`Fichier ${metadata.fileId} introuvable:`, err.message);
        }
      } catch (err) {
        console.error(`Erreur récupération fichier ${metadata.fileId}:`, err.message);
      }
    }

    return {
      success: true,
      files: allFiles,
      count: allFiles.length,
      message: allFiles.length === 0 ? 'Fichiers favoris introuvables dans les clouds' : undefined
    };
  }

  /**
   * Récupère les métadonnées d'un fichier
   */
  async getFileMetadata(userId, provider, fileId) {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } }
    });

    if (!account) {
      return { success: false, error: 'Service cloud non connecté' };
    }

    try {
      const providerInstance = this._createProvider(account);
      const metadata = await providerInstance.getFileMetadata(fileId);
      
      return { success: true, file: metadata };
    } catch (error) {
      console.error('Erreur métadonnées:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupère l'URL de prévisualisation d'un fichier
   */
  async getPreviewUrl(userId, provider, fileId) {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } }
    });

    if (!account) {
      return { success: false, error: 'Service cloud non connecté' };
    }

    try {
      const providerInstance = this._createProvider(account, userId);
      const previewData = await providerInstance.getPreviewUrl(fileId);
      
      return { success: true, preview: previewData };
    } catch (error) {
      console.error('Erreur prévisualisation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Déplace un fichier
   */
  async moveFile(userId, provider, fileId, newParentId, oldParentId = null) {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } }
    });

    if (!account) {
      return { success: false, error: 'Service cloud non connecté' };
    }

    try {
      const providerInstance = this._createProvider(account);
      const result = await providerInstance.moveFile(fileId, newParentId, { oldParentId });
      
      return { success: true, result };
    } catch (error) {
      console.error('Erreur déplacement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Copie un fichier
   */
  async copyFile(userId, provider, fileId, newParentId, newName = null) {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } }
    });

    if (!account) {
      return { success: false, error: 'Service cloud non connecté' };
    }

    try {
      const providerInstance = this._createProvider(account);
      const result = await providerInstance.copyFile(fileId, newParentId, { newName });
      
      return { success: true, result };
    } catch (error) {
      console.error('Erreur copie:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Télécharge un fichier
   */
  async downloadFile(userId, provider, fileId) {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } }
    });

    if (!account) {
      return { success: false, error: 'Service cloud non connecté', buffer: null };
    }

    try {
      const providerInstance = this._createProvider(account);
      const fileBuffer = await providerInstance.downloadFile(fileId);
      
      return { success: true, buffer: fileBuffer };
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      return { success: false, error: error.message, buffer: null };
    }
  }
}

module.exports = new FileService();