const { prisma } = require('../config/database');

/**
 * Service pour gérer les métadonnées des fichiers
 */
class MetadataService {
  /**
   * Helper pour décoder les tags JSON
   * @private
   */
  _decodeTags(metadata) {
    if (!metadata) return null;
    
    return {
      ...metadata,
      tags: JSON.parse(metadata.tags || '[]')
    };
  }

  /**
   * Helper pour décoder les tags de plusieurs métadonnées
   * @private
   */
  _decodeMultipleTags(metadataArray) {
    return metadataArray.map(m => this._decodeTags(m));
  }

  /**
   * Récupère ou crée les métadonnées d'un fichier
   */
  async getOrCreateMetadata(userId, fileId, cloudType) {
    const metadata = await prisma.fileMetadata.findUnique({
      where: {
        userId_fileId_cloudType: { userId, fileId, cloudType }
      }
    });

    return this._decodeTags(metadata);
  }

  /**
   * Met à jour les tags d'un fichier
   */
  async updateTags(userId, fileId, cloudType, tags) {
    if (!Array.isArray(tags)) {
      throw new Error('Les tags doivent être un tableau');
    }

    const metadata = await prisma.fileMetadata.upsert({
      where: {
        userId_fileId_cloudType: { userId, fileId, cloudType }
      },
      update: { 
        tags: JSON.stringify(tags), 
        updatedAt: new Date() 
      },
      create: {
        userId,
        fileId,
        cloudType,
        tags: JSON.stringify(tags)
      }
    });

    return this._decodeTags(metadata);
  }

  /**
   * Met à jour toutes les métadonnées d'un fichier
   */
  async updateMetadata(userId, fileId, cloudType, data) {
    const { tags, customName, description, starred, color } = data;

    const updateData = { updatedAt: new Date() };
    
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (customName !== undefined) updateData.customName = customName;
    if (description !== undefined) updateData.description = description;
    if (starred !== undefined) updateData.starred = starred;
    if (color !== undefined) updateData.color = color;

    const metadata = await prisma.fileMetadata.upsert({
      where: {
        userId_fileId_cloudType: { userId, fileId, cloudType }
      },
      update: updateData,
      create: {
        userId,
        fileId,
        cloudType,
        ...updateData
      }
    });

    return this._decodeTags(metadata);
  }

  /**
   * Recherche des fichiers par métadonnées
   */
  async searchByMetadata(userId, filters = {}) {
    const { tags, cloudType, starred } = filters;
    const where = { userId };

    // Filtrer par tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      // Pour une recherche plus robuste, on pourrait faire plusieurs requêtes
      // ou utiliser une recherche full-text si configurée
      where.tags = { contains: tagArray[0] };
    }

    // Filtrer par provider
    if (cloudType) {
      where.cloudType = cloudType;
    }

    // Filtrer par favoris
    if (starred === true || starred === 'true') {
      where.starred = true;
    }

    const results = await prisma.fileMetadata.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });

    return this._decodeMultipleTags(results);
  }

  /**
   * Récupère les tags les plus populaires
   */
  async getPopularTags(userId, limit = 10) {
    const metadata = await prisma.fileMetadata.findMany({
      where: { userId },
      select: { tags: true }
    });

    // Compter la fréquence de chaque tag
    const tagCounts = {};
    
    metadata.forEach(m => {
      const tags = JSON.parse(m.tags || '[]');
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Trier par fréquence décroissante
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, parseInt(limit))
      .map(([tag, count]) => ({ tag, count }));

    return sortedTags;
  }

  /**
   * Récupère les statistiques des métadonnées
   */
  async getStats(userId) {
    const [totalFiles, starredFiles, filesWithTags, filesWithDescription] = await Promise.all([
      prisma.fileMetadata.count({ where: { userId } }),
      prisma.fileMetadata.count({ where: { userId, starred: true } }),
      prisma.fileMetadata.count({ 
        where: { 
          userId,
          tags: { not: null }
        }
      }),
      prisma.fileMetadata.count({ 
        where: { 
          userId,
          description: { not: null }
        }
      })
    ]);

    return {
      totalFiles,
      starredFiles,
      filesWithTags,
      filesWithDescription,
      taggingRate: totalFiles > 0 
        ? parseFloat((filesWithTags / totalFiles * 100).toFixed(1)) 
        : 0
    };
  }

  /**
   * Supprime les métadonnées d'un fichier
   */
  async deleteMetadata(userId, fileId, cloudType) {
    await prisma.fileMetadata.delete({
      where: {
        userId_fileId_cloudType: { userId, fileId, cloudType }
      }
    });

    return { success: true };
  }

  /**
   * Récupère tous les fichiers avec leurs métadonnées enrichies
   * (Utile pour combiner avec les infos du cloud)
   */
  async getAllUserMetadata(userId) {
    const metadata = await prisma.fileMetadata.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return this._decodeMultipleTags(metadata);
  }

  /**
   * Batch update - met à jour plusieurs fichiers en une fois
   */
  async batchUpdateMetadata(userId, updates) {
    const results = await Promise.allSettled(
      updates.map(({ fileId, cloudType, data }) => 
        this.updateMetadata(userId, fileId, cloudType, data)
      )
    );

    return {
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      results: results.map((r, i) => ({
        fileId: updates[i].fileId,
        success: r.status === 'fulfilled',
        data: r.status === 'fulfilled' ? r.value : null,
        error: r.status === 'rejected' ? r.reason.message : null
      }))
    };
  }
}

module.exports = new MetadataService();