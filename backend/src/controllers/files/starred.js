const { prisma } = require('@config/database');
const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId } = req.params;

  try {
    const starredMetadata = await prisma.fileMetadata.findMany({ where: { userId, starred: true } });
    if (!starredMetadata.length) {
      return res.json({ success: true, files: [], count: 0, message: 'Aucun fichier favori' });
    }

    const accounts = await prisma.cloudAccount.findMany({ where: { userId } });
    if (!accounts.length) return res.json({ success: true, files: [], message: 'Aucun service cloud connecté' });

    let allFiles = [];

    for (const meta of starredMetadata) {
      try {
        const account = accounts.find(a => a.provider === meta.cloudType);
        if (!account) continue;

        const connector = await getConnector(userId, meta.cloudType);
        const file = await connector.getFileMetadata(meta.fileId).catch(() => null);

        if (file) {
          allFiles.push({
            ...file,
            tags: JSON.parse(meta.tags || '[]'),
            customName: meta.customName,
            description: meta.description,
            starred: true,
          });
        }
      } catch (err) {
        console.error(`Erreur fichier favori ${meta.fileId}:`, err.message);
      }
    }

    res.json({
      success: true,
      files: allFiles,
      count: allFiles.length,
      message: allFiles.length === 0 ? 'Fichiers favoris introuvables' : undefined,
    });
  } catch (error) {
    console.error('Erreur favoris:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des favoris' });
  }
};
