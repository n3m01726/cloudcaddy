const { prisma } = require('@config/database');
const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const connector = await getConnector(userId, provider);
    const result = await connector.deleteFile(fileId);

    // Supprime les métadonnées locales
    try {
      await prisma.fileMetadata.delete({
        where: {
          userId_fileId_cloudType: { userId, fileId, cloudType: provider },
        },
      });
    } catch {
      console.log('Aucune métadonnée à supprimer');
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
