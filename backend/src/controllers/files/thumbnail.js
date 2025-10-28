const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId, provider, fileId } = req.params;

  try {
    const connector = await getConnector(userId, provider);
    if (provider !== 'google_drive') {
      return res.status(400).json({ success: false, error: 'Provider non supporté pour les thumbnails' });
    }

    const { buffer, mimeType } = await connector.getThumbnail(fileId);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Erreur thumbnail:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
