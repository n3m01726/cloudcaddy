const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId } = req.params;
  const { provider, fileId, newParentId, newName } = req.body;

  if (!provider || !fileId || !newParentId)
    return res.status(400).json({ success: false, error: 'provider, fileId et newParentId sont requis' });

  try {
    const connector = await getConnector(userId, provider);
    const result = await connector.copyFile(fileId, newParentId, newName);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Erreur copie:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
