const { prisma } = require('@config/database');

exports.getStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const totalFiles = await prisma.fileMetadata.count({ where: { userId } });
    const starredFiles = await prisma.fileMetadata.count({ where: { userId, starred: true } });
    const filesWithTags = await prisma.fileMetadata.count({ where: { userId, tags: { not: null } } });
    const filesWithDescription = await prisma.fileMetadata.count({ where: { userId, description: { not: null } } });

    res.json({ 
      success: true, 
      stats: {
        totalFiles,
        starredFiles,
        filesWithTags,
        filesWithDescription,
        taggingRate: totalFiles > 0 ? (filesWithTags / totalFiles * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
