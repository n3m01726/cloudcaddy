const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId } = req.params;
  const { provider, fileId, newParentId, oldParentId } = req.body;

  if (!provider || !fileId || !newParentId)
    return res.status(400).json({ success: false, error: 'provider, fileId et newParentId sont requis' });

  try {
    const connector = await getConnector(userId, provider);
    const result = await connector.moveFile(fileId, newParentId, oldParentId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Erreur déplacement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
