const { prisma } = require('@config/database');
const { getConnector } = require('@utils/cloudConnector');

module.exports = async (req, res) => {
  const { userId } = req.params;
  const { q } = req.query;

  if (!q?.trim()) return res.status(400).json({ success: false, error: 'Le paramètre "q" est requis' });

  try {
    const accounts = await prisma.cloudAccount.findMany({ where: { userId } });
    if (!accounts.length) return res.json({ success: true, files: [], message: 'Aucun service cloud connecté' });

    let results = [];

    for (const account of accounts) {
      try {
        const connector = await getConnector(userId, account.provider);
        const files = await connector.search(q);
        if (Array.isArray(files)) results = results.concat(files);
      } catch (err) {
        console.error(`Erreur recherche ${account.provider}:`, err.message);
      }
    }

    res.json({
      success: true,
      files: results,
      count: results.length,
      query: q,
      message: results.length === 0 ? `Aucun fichier trouvé pour "${q}"` : undefined,
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la recherche' });
  }
};
