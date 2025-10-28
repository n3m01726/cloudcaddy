const { prisma } = require('@config/database');

exports.updateTags = async (req, res) => {
  const { userId, fileId } = req.params;
  const { tags, tagColors, cloudType } = req.body;

  if (!Array.isArray(tags)) {
    return res.status(400).json({ success: false, error: 'Les tags doivent être un tableau' });
  }

  try {
    const updateData = { tags: JSON.stringify(tags), updatedAt: new Date() };
    if (tagColors) updateData.tagColors = JSON.stringify(tagColors);

    const metadata = await prisma.fileMetadata.upsert({
      where: { userId_fileId_cloudType: { userId, fileId, cloudType } },
      update: updateData,
      create: { userId, fileId, cloudType, ...updateData },
    });

    res.json({ 
      success: true, 
      metadata: {
        ...metadata,
        tags: JSON.parse(metadata.tags || '[]'),
        tagColors: metadata.tagColors ? JSON.parse(metadata.tagColors) : {}
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour tags:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPopularTags = async (req, res) => {
  const { userId } = req.params;
  const { limit = 10 } = req.query;

  try {
    const metadata = await prisma.fileMetadata.findMany({ where: { userId }, select: { tags: true } });
    const tagCounts = {};

    metadata.forEach(m => {
      const tags = JSON.parse(m.tags || '[]');
      tags.forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1);
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, parseInt(limit))
      .map(([tag, count]) => ({ tag, count }));

    res.json({ success: true, tags: sortedTags });
  } catch (error) {
    console.error('Erreur récupération tags populaires:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
