const { prisma } = require('@config/database');
const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId } = req.params;
  const { folderId } = req.query;

  try {
    const accounts = await prisma.cloudAccount.findMany({ where: { userId } });
    if (!accounts.length) {
      return res.json({ success: true, files: [], message: 'Aucun service cloud connecté' });
    }

    let allFiles = [];

    for (const account of accounts) {
      try {
        const connector = await getConnector(userId, account.provider);
        const files = await connector.listFiles(folderId || (account.provider === 'google_drive' ? 'root' : ''));
        if (Array.isArray(files)) allFiles = allFiles.concat(files);
      } catch (err) {
        console.error(`Erreur ${account.provider}:`, err.message);
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
};
