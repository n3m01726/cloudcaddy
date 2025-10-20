// backend/src/routes/files.js

const express = require('express');
const { prisma } = require('@config/database');
const GoogleDriveConnector = require('@connectors/GoogleDriveProvider');
const DropboxConnector = require('@connectors/DropboxProvider');
const { tokenRefreshMiddleware } = require('@core/middlewares/tokenRefresh');

const router = express.Router();

// ✅ Middleware pour refresh des tokens
router.use(tokenRefreshMiddleware);

/* ------------------------------------------------------------------
 * LISTE DES FICHIERS
 * GET /files/:userId
 * ------------------------------------------------------------------ */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { folderId } = req.query;

  try {
    const cloudAccounts = await prisma.cloudAccount.findMany({ where: { userId } });
    if (!cloudAccounts?.length) {
      return res.json({ success: true, files: [], message: 'Aucun service cloud connecté' });
    }

    let allFiles = [];

    for (const account of cloudAccounts) {
      try {
        if (account.provider === 'google_drive') {
          const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken, userId);
          const files = await gdrive.listFiles(folderId || 'root');
          if (Array.isArray(files)) allFiles = allFiles.concat(files);

        } else if (account.provider === 'dropbox') {
          if (!account.accessToken) continue;
          const dropbox = new DropboxConnector(account.accessToken);
          const files = await dropbox.listFiles(folderId || '');
          if (Array.isArray(files)) allFiles = allFiles.concat(files);
        }
      } catch (err) {
        console.error(`Erreur pour ${account.provider}:`, err.message);
      }
    }

    res.json({
      success: true,
      files: allFiles,
      count: allFiles.length,
      message: allFiles.length === 0 ? 'Aucun fichier trouvé' : undefined,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des fichiers' });
  }
});

/* ------------------------------------------------------------------
 * RECHERCHE
 * GET /files/:userId/search?q=query
 * ------------------------------------------------------------------ */
router.get('/:userId/search', async (req, res) => {
  const { userId } = req.params;
  const { q } = req.query;

  if (!q?.trim()) {
    return res.status(400).json({ success: false, error: 'Le paramètre "q" est requis' });
  }

  try {
    const cloudAccounts = await prisma.cloudAccount.findMany({ where: { userId } });
    if (!cloudAccounts?.length) {
      return res.json({ success: true, files: [], message: 'Aucun service cloud connecté' });
    }

    let searchResults = [];

    for (const account of cloudAccounts) {
      try {
        if (account.provider === 'google_drive') {
          const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken, userId);
          const files = await gdrive.search(q);
          if (Array.isArray(files)) searchResults = searchResults.concat(files);

        } else if (account.provider === 'dropbox') {
          if (!account.accessToken) continue;
          const dropbox = new DropboxConnector(account.accessToken);
          const files = await dropbox.search(q);
          if (Array.isArray(files)) searchResults = searchResults.concat(files);
        }
      } catch (err) {
        console.error(`Erreur recherche ${account.provider}:`, err.message);
      }
    }

    res.json({
      success: true,
      files: searchResults,
      count: searchResults.length,
      query: q,
      message: searchResults.length === 0 ? `Aucun fichier trouvé pour "${q}"` : undefined,
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la recherche' });
  }
});

/* ------------------------------------------------------------------
 * FICHIERS FAVORIS (STARRED)
 * GET /files/:userId/starred
 * ------------------------------------------------------------------ */
router.get('/:userId/starred', async (req, res) => {
  const { userId } = req.params;

  try {
    const starredMetadata = await prisma.fileMetadata.findMany({
      where: { userId, starred: true },
    });

    if (!starredMetadata.length) {
      return res.json({ success: true, files: [], count: 0, message: 'Aucun fichier favori' });
    }

    const cloudAccounts = await prisma.cloudAccount.findMany({ where: { userId } });
    if (!cloudAccounts.length) {
      return res.json({ success: true, files: [], message: 'Aucun service cloud connecté' });
    }

    let allFiles = [];

    for (const metadata of starredMetadata) {
      try {
        const account = cloudAccounts.find(acc => acc.provider === metadata.cloudType);
        if (!account) continue;

        let fileInfo = null;

        if (metadata.cloudType === 'google_drive') {
          const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken, userId);
          fileInfo = await gdrive.getFileMetadata(metadata.fileId).catch(() => null);
        } else if (metadata.cloudType === 'dropbox') {
          console.warn(`Dropbox favorites non encore supporté pour ${metadata.fileId}`);
          continue;
        }

        if (fileInfo) {
          allFiles.push({
            ...fileInfo,
            tags: JSON.parse(metadata.tags || '[]'),
            customName: metadata.customName,
            description: metadata.description,
            starred: true,
          });
        }
      } catch (error) {
        console.error(`Erreur récupération fichier ${metadata.fileId}:`, error.message);
      }
    }

    res.json({
      success: true,
      files: allFiles,
      count: allFiles.length,
      message: allFiles.length === 0 ? 'Fichiers favoris introuvables' : undefined,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des favoris' });
  }
});


/* ------------------------------------------------------------------
 * THUMBNAIL PROXY (pour images)
 * GET /files/:userId/thumbnail/:provider/:fileId
 * ------------------------------------------------------------------ */
router.get('/:userId/thumbnail/:provider/:fileId', async (req, res) => {
  const { userId, provider, fileId } = req.params;

  console.log('🖼️ Thumbnail demandé:', { userId, provider, fileId });

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } }
    });

    if (!account) {
      console.error('❌ Compte non trouvé');
      return res.status(404).json({ 
        success: false, 
        error: 'Service cloud non connecté' 
      });
    }

    console.log('✅ Compte trouvé, création du connecteur...');

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(
        account.accessToken, 
        account.refreshToken,
        userId
      );

      try {
        console.log('📥 Appel getThumbnail...');
        const { buffer, mimeType } = await gdrive.getThumbnail(fileId);
        
        console.log('✅ Thumbnail généré:', {
          size: buffer.length,
          mimeType
        });

        // Headers pour cache agressif
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 jours
        res.setHeader('Content-Length', buffer.length);
        
        return res.send(buffer);
        
      } catch (thumbnailError) {
        console.error('❌ Erreur génération thumbnail:', {
          message: thumbnailError.message,
          stack: thumbnailError.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: `Erreur thumbnail: ${thumbnailError.message}` 
        });
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Provider non supporté pour les thumbnails' 
      });
    }

  } catch (error) {
    console.error('❌ Erreur proxy thumbnail:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});

// 👆 À placer APRÈS la route /starred et AVANT /metadata
// Dans ton fichier files.js, vers la ligne 150



/* ------------------------------------------------------------------
 * MÉTADONNÉES D'UN FICHIER
 * GET /files/:userId/metadata/:provider/:fileId
 * ------------------------------------------------------------------ */
router.get('/:userId/metadata/:provider/:fileId', async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    if (!account) {
      return res.status(404).json({ success: false, error: 'Service cloud non connecté' });
    }

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken);
      const metadata = await gdrive.getFileMetadata(fileId);
      return res.json({ success: true, file: metadata });
    }

    res.status(400).json({ success: false, error: 'Provider non supporté' });
  } catch (error) {
    console.error('Erreur récupération métadonnées:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des métadonnées' });
  }
});

/* ------------------------------------------------------------------
 * PRÉVISUALISATION
 * GET /files/:userId/preview/:provider/:fileId
 * ------------------------------------------------------------------ */
router.get('/:userId/preview/:provider/:fileId', async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    if (!account) {
      return res.status(404).json({ success: false, error: 'Service cloud non connecté' });
    }

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken);
      const previewData = await gdrive.getPreviewUrl(fileId, userId);
      return res.json({ success: true, preview: previewData });
    }

    res.status(400).json({ success: false, error: 'Provider non supporté pour la prévisualisation' });
  } catch (error) {
    console.error('Erreur prévisualisation:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la prévisualisation' });
  }
});

/* ------------------------------------------------------------------
 * DÉPLACEMENT / COPIE / TÉLÉCHARGEMENT
 * ------------------------------------------------------------------ */
router.post('/:userId/move', async (req, res) => {
  const { userId } = req.params;
  const { provider, fileId, newParentId, oldParentId } = req.body;

  if (!provider || !fileId || !newParentId) {
    return res.status(400).json({ success: false, error: 'provider, fileId et newParentId sont requis' });
  }

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    if (!account) {
      return res.status(404).json({ success: false, error: 'Service cloud non connecté' });
    }

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken);
      const result = await gdrive.moveFile(fileId, newParentId, oldParentId);
      return res.json({ success: true, result });
    }

    res.status(400).json({ success: false, error: 'Provider non supporté pour le déplacement' });
  } catch (error) {
    console.error('Erreur déplacement:', error);
    res.status(500).json({ success: false, error: 'Erreur lors du déplacement du fichier' });
  }
});

router.post('/:userId/copy', async (req, res) => {
  const { userId } = req.params;
  const { provider, fileId, newParentId, newName } = req.body;

  if (!provider || !fileId || !newParentId) {
    return res.status(400).json({ success: false, error: 'provider, fileId et newParentId sont requis' });
  }

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    if (!account) {
      return res.status(404).json({ success: false, error: 'Service cloud non connecté' });
    }

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken);
      const result = await gdrive.copyFile(fileId, newParentId, newName);
      return res.json({ success: true, result });
    }

    res.status(400).json({ success: false, error: 'Provider non supporté pour la copie' });
  } catch (error) {
    console.error('Erreur copie:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la copie du fichier' });
  }
});

router.post('/:userId/download', async (req, res) => {
  const { userId } = req.params;
  const { provider, fileId, fileName } = req.body;

  if (!provider || !fileId) {
    return res.status(400).json({ success: false, error: 'provider et fileId sont requis' });
  }

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    if (!account) {
      return res.status(404).json({ success: false, error: 'Service cloud non connecté' });
    }

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(account.accessToken, account.refreshToken);
      const fileBuffer = await gdrive.downloadFile(fileId);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName || 'download'}"`);
      return res.send(fileBuffer);
    }

    res.status(400).json({ success: false, error: 'Provider non supporté' });
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({ success: false, error: 'Erreur lors du téléchargement' });
  }
});
// À ajouter dans routes.js après la route /copy

/* ------------------------------------------------------------------
 * SUPPRESSION DE FICHIER
 * DELETE /files/:userId/:provider/:fileId
 * ------------------------------------------------------------------ */
router.delete('/:userId/:provider/:fileId', async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const account = await prisma.cloudAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    
    if (!account) {
      return res.status(404).json({ 
        success: false, 
        error: 'Service cloud non connecté' 
      });
    }

    if (provider === 'google_drive') {
      const gdrive = new GoogleDriveConnector(
        account.accessToken, 
        account.refreshToken,
        userId
      );
      const result = await gdrive.deleteFile(fileId);
      
      // Supprimer aussi les métadonnées associées si elles existent
      try {
        await prisma.fileMetadata.delete({
          where: {
            userId_fileId_cloudType: {
              userId,
              fileId,
              cloudType: provider
            }
          }
        });
      } catch (metaError) {
        // Pas grave si les métadonnées n'existent pas
        console.log('Aucune métadonnée à supprimer');
      }
      
      return res.json({ success: true, result });
      
    } else if (provider === 'dropbox') {
      const dropbox = new DropboxConnector(account.accessToken);
      const result = await dropbox.deleteFile(fileId);
      
      // Supprimer les métadonnées
      try {
        await prisma.fileMetadata.delete({
          where: {
            userId_fileId_cloudType: {
              userId,
              fileId,
              cloudType: provider
            }
          }
        });
      } catch (metaError) {
        console.log('Aucune métadonnée à supprimer');
      }
      
      return res.json({ success: true, result });
    }

    res.status(400).json({ 
      success: false, 
      error: 'Provider non supporté pour la suppression' 
    });
    
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la suppression du fichier' 
    });
  }
});

module.exports = router;
