// backend/src/middlewares/tokenRefresh.js

const { refreshDropboxToken } = require('@config/oauth');
const { prisma } = require('@config/database');

/**
 * Vérifie et rafraîchit automatiquement les tokens expirés
 * @param {Object} account - Compte cloud
 * @returns {Promise<Object>} Compte avec tokens valides
 */
async function ensureValidTokens(account) {
  const now = new Date();

  // Vérifier si le token expire dans les 5 prochaines minutes
  const expiresSoon =
    account.expiresAt &&
    new Date(account.expiresAt.getTime() - 5 * 60 * 1000) <= now;

  if (account.provider === 'google_drive') {
    // Google Drive gère automatiquement le refresh via OAuth2Client
    return account;
  }

  if (account.provider === 'dropbox' && (expiresSoon || !account.expiresAt)) {
    try {
      console.log(`🔄 Rafraîchissement du token Dropbox pour l'utilisateur ${account.userId}`);

      const newTokens = await refreshDropboxToken(account.refreshToken);

      // Mise à jour en base
      const updatedAccount = await prisma.cloudAccount.update({
        where: { id: account.id },
        data: {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
          expiresAt: newTokens.expires_in
            ? new Date(Date.now() + newTokens.expires_in * 1000)
            : null,
        },
      });

      console.log('✅ Token Dropbox rafraîchi avec succès');
      return updatedAccount;

    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement du token Dropbox:', error.message);
      // Retourner le compte original même si le refresh échoue
      return account;
    }
  }

  return account;
}

/**
 * Middleware pour rafraîchir automatiquement les tokens avant les requêtes
 */
async function tokenRefreshMiddleware(req, res, next) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next();
    }

    // Récupérer les comptes cloud liés à l’utilisateur
    const accounts = await prisma.cloudAccount.findMany({
      where: { userId },
    });

    // Rafraîchir les tokens si nécessaire
    for (const account of accounts) {
      await ensureValidTokens(account);
    }

    next();
  } catch (error) {
    console.error('⚠️ Erreur dans le middleware de refresh des tokens:', error);
    next(); // Continuer même en cas d’erreur
  }
}

module.exports = {
  ensureValidTokens,
  tokenRefreshMiddleware
};
