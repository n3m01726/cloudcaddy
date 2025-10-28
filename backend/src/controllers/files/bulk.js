const batchService = require('@services/batchService');

module.exports = {
  async createFolder(req, res) {
    try {
      const { folderName, provider, fileIds, parentId } = req.body;
      const userId = req.user?.id || 'default-user';

      if (!folderName || !provider || !fileIds?.length)
        return res.status(400).json({ error: 'folderName, provider et fileIds sont requis' });

      const results = await batchService.createFolderWithFiles(userId, folderName, provider, fileIds, parentId || 'root');

      res.json({
        success: true,
        folder: results.folder,
        movedFiles: results.movedFiles,
        errors: results.errors,
      });
    } catch (error) {
      console.error('Erreur création dossier:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async copy(req, res) {
    try {
      const { sourceProvider, destinationProvider, fileIds, destinationFolderId } = req.body;
      const userId = req.user?.id || 'default-user';

      const results = await batchService.copyMultipleFiles(
        userId,
        sourceProvider,
        destinationProvider,
        fileIds,
        destinationFolderId || 'root'
      );

      res.json({ success: true, ...results });
    } catch (error) {
      console.error('Erreur bulk copy:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async move(req, res) {
    try {
      const { provider, fileIds, destinationFolderId } = req.body;
      const userId = req.user?.id || 'default-user';

      const results = await batchService.moveMultipleFiles(userId, provider, fileIds, destinationFolderId);
      res.json({ success: true, ...results });
    } catch (error) {
      console.error('Erreur bulk move:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { provider, fileIds } = req.body;
      const userId = req.user?.id || 'default-user';

      const results = await batchService.deleteMultipleFiles(userId, provider, fileIds);
      res.json({ success: true, ...results });
    } catch (error) {
      console.error('Erreur bulk delete:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async tag(req, res) {
    try {
      const { provider, fileIds, tags } = req.body;
      const userId = req.user?.id || 'default-user';

      const results = await batchService.addTagsToMultipleFiles(userId, fileIds, tags, provider);
      res.json({ success: true, ...results });
    } catch (error) {
      console.error('Erreur bulk tag:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
