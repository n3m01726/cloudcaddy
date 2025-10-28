const { prisma } = require('@config/database');
const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const connector = await getConnector(userId, provider);
    const metadata = await connector.getFileMetadata(fileId);
    res.json({ success: true, file: metadata });
  } catch (error) {
    console.error('Erreur métadonnées:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
