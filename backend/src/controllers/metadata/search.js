const { prisma } = require('@config/database');

const decodeMetadata = metadata => ({
  ...metadata,
  tags: JSON.parse(metadata.tags || '[]'),
  tagColors: metadata.tagColors ? JSON.parse(metadata.tagColors) : {}
});

exports.searchByTags = async (req, res) => {
  const { userId } = req.params;
  const { tags, cloudType, starred } = req.query;

  try {
    const where = { userId };
    if (tags) where.tags = { contains: tags.split(',')[0].trim() };
    if (cloudType) where.cloudType = cloudType;
    if (starred === 'true') where.starred = true;

    const results = await prisma.fileMetadata.findMany({ where, orderBy: { updatedAt: 'desc' } });
    res.json({ success: true, results: results.map(decodeMetadata) });
  } catch (error) {
    console.error('Erreur recherche métadonnées:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
