const { prisma } = require('@config/database');
const { createAuthenticatedGoogleClient } = require('@config/oauth');
const { google } = require('googleapis');

exports.status = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cloudAccounts: true },
    });
    if (!user) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });

    const services = {
      google_drive: user.cloudAccounts.some(acc => acc.provider === 'google_drive'),
      dropbox: user.cloudAccounts.some(acc => acc.provider === 'dropbox'),
    };

    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name }, connectedServices: services });
  } catch (error) {
    console.error('Erreur statut auth:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

exports.info = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cloudAccounts: true },
    });
    if (!user) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });

    const googleAccount = user.cloudAccounts.find(acc => acc.provider === 'google_drive');
    if (!googleAccount)
      return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, picture: null } });

    const oauth2Client = createAuthenticatedGoogleClient(
      googleAccount.accessToken,
      googleAccount.refreshToken,
      userId
    );
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    res.json({
      success: true,
      user: {
        id: user.id,
        name: googleUser.name || user.name,
        email: googleUser.email || user.email,
        picture: googleUser.picture || null,
        givenName: googleUser.given_name,
        familyName: googleUser.family_name,
      },
    });
  } catch (error) {
    console.error('❌ Erreur récupération info utilisateur:', error);
    const fallback = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ success: true, user: fallback });
  }
};

exports.disconnect = async (req, res) => {
  const { userId, provider } = req.params;
  try {
    await prisma.cloudAccount.delete({ where: { userId_provider: { userId, provider } } });
    res.json({ success: true, message: `${provider} déconnecté avec succès` });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la déconnexion' });
  }
};
