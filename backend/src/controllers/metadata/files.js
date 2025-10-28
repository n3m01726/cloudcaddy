const { prisma } = require('@config/database');

const decodeMetadata = metadata => metadata ? {
  ...metadata,
  tags: JSON.parse(metadata.tags || '[]'),
  tagColors: metadata.tagColors ? JSON.parse(metadata.tagColors) : {}
} : null;

exports.getMetadata = async (req, res) => {
  const { userId, fileId } = req.params;
  const { cloudType } = req.query;

  if (!cloudType) return res.status(400).json({ success: false, error: 'cloudType est requis' });

  try {
    const metadata = await prisma.fileMetadata.findUnique({
      where: { userId_fileId_cloudType: { userId, fileId, cloudType } }
    });
    res.json({ success: true, metadata: decodeMetadata(metadata) });
  } catch (error) {
    console.error('Erreur récupération métadonnées:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateMetadata = async (req, res) => {
  const { userId, fileId } = req.params;
  const { cloudType, tags, tagColors, customName, description, starred, color } = req.body;

  if (!cloudType) return res.status(400).json({ success: false, error: 'cloudType est requis' });

  try {
    const updateData = {};
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (tagColors !== undefined) updateData.tagColors = JSON.stringify(tagColors);
    if (customName !== undefined) updateData.customName = customName;
    if (description !== undefined) updateData.description = description;
    if (starred !== undefined) updateData.starred = starred;
    if (color !== undefined) updateData.color = color;
    updateData.updatedAt = new Date();

    const metadata = await prisma.fileMetadata.upsert({
      where: { userId_fileId_cloudType: { userId, fileId, cloudType } },
      update: updateData,
      create: { userId, fileId, cloudType, ...updateData },
    });

    res.json({ success: true, metadata: decodeMetadata(metadata) });
  } catch (error) {
    console.error('Erreur mise à jour métadonnées:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteMetadata = async (req, res) => {
  const { userId, fileId } = req.params;
  const { cloudType } = req.query;

  if (!cloudType) return res.status(400).json({ success: false, error: 'cloudType est requis' });

  try {
    await prisma.fileMetadata.delete({
      where: { userId_fileId_cloudType: { userId, fileId, cloudType } }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression métadonnées:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
