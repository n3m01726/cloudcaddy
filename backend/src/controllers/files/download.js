const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId } = req.params;
  const { provider, fileId, fileName } = req.body;

  if (!provider || !fileId)
    return res.status(400).json({ success: false, error: 'provider et fileId sont requis' });

  try {
    const connector = await getConnector(userId, provider);
    const fileBuffer = await connector.downloadFile(fileId);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName || 'download'}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
