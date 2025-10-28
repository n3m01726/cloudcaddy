const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const connector = await getConnector(userId, provider);
    const preview = await connector.getPreviewUrl(fileId, userId);
    res.json({ success: true, preview });
  } catch (error) {
    console.error('Erreur prévisualisation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
