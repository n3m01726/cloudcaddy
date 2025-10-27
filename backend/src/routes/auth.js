// Routes d'authentification OAuth2 (CommonJS)
require('module-alias/register');
const express = require('express');
const { prisma } = require('@config/database.js');
const { 
  getGoogleAuthUrl, 
  getGoogleTokensFromCode,
  createAuthenticatedGoogleClient,
  getDropboxAuthUrl,
  getDropboxTokensFromCode,
  getDropboxAccountInfo
} = require('@config/oauth.js');
const { google } = require('googleapis');

const router = express.Router();

/**
 * GET /auth/google
 * Initie le flux OAuth2 avec Google
 */
router.get('/google', (req, res) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Erreur génération URL Google:', error);
    res.status(500).json({ success: false, error: 'Erreur OAuth Google' });
  }
});

/**
 * GET /auth/google/callback
 * Callback après authentification Google
 */
router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);

  try {
    const tokens = await getGoogleTokensFromCode(code);
    const oauth2Client = createAuthenticatedGoogleClient(tokens.access_token, tokens.refresh_token);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    let user = await prisma.user.findUnique({ where: { email: userInfo.data.email } });
    if (!user) {
      user = await prisma.user.create({ data: { email: userInfo.data.email, name: userInfo.data.name } });
    }

    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600 * 1000);
    await prisma.cloudAccount.upsert({
      where: { userId_provider: { userId: user.id, provider: 'google_drive' } },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresAt,
        email: userInfo.data.email,
      },
      create: {
        userId: user.id,
        provider: 'google_drive',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        email: userInfo.data.email,
      }
    });

    res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${user.id}`);
  } catch (err) {
    console.error('Erreur callback Google:', err);
    res.redirect(`${process.env.FRONTEND_URL}?error=google_token_exchange_failed`);
  }
});

/**
 * GET /auth/dropbox
 * Initie le flux OAuth2 avec Dropbox
 */
router.get('/dropbox', (req, res) => {
  try {
    const authUrl = getDropboxAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Erreur génération URL Dropbox:', error);
    res.status(500).json({ success: false, error: 'Erreur OAuth Dropbox' });
  }
});

/**
 * GET /auth/dropbox/callback
 * Callback après authentification Dropbox
 */
router.get('/dropbox/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);

  try {
    const tokens = await getDropboxTokensFromCode(code);
    const userInfo = await getDropboxAccountInfo(tokens.access_token);

    let user = await prisma.user.findUnique({ where: { email: userInfo.email } });
    if (!user) {
      user = await prisma.user.create({ data: { email: userInfo.email, name: userInfo.name } });
    }

    const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : new Date(Date.now() + 3600 * 1000);
    await prisma.cloudAccount.upsert({
      where: { userId_provider: { userId: user.id, provider: 'dropbox' } },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresAt,
        email: userInfo.email,
      },
      create: {
        userId: user.id,
        provider: 'dropbox',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        email: userInfo.email,
      }
    });

    res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${user.id}`);
  } catch (err) {
    console.error('Erreur callback Dropbox:', err);
    res.redirect(`${process.env.FRONTEND_URL}?error=dropbox_token_exchange_failed`);
  }
});

/**
 * GET /auth/status/:userId
 * Récupère le statut de connexion de l'utilisateur
 */
router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: userId }, 
      include: { cloudAccounts: true } 
    });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const services = {
      google_drive: user.cloudAccounts.some(acc => acc.provider === 'google_drive'),
      dropbox: user.cloudAccounts.some(acc => acc.provider === 'dropbox'),
    };

    res.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name }, 
      connectedServices: services 
    });
  } catch (error) {
    console.error('Erreur statut auth:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

/**
 * GET /auth/user/info/:userId
 * Récupère les informations détaillées de l'utilisateur avec photo de profil
 */
router.get('/user/info/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Récupérer l'utilisateur et ses comptes cloud
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { cloudAccounts: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }

    const googleAccount = user.cloudAccounts.find(acc => acc.provider === 'google_drive');
    
    // Si pas de compte Google, retourner les infos de base
    if (!googleAccount) {
      return res.json({ 
        success: true, 
        user: { 
          id: user.id,
          name: user.name, 
          email: user.email,
          picture: null 
        }
      });
    }

    // Créer un client Google authentifié
    const oauth2Client = createAuthenticatedGoogleClient(
      googleAccount.accessToken, 
      googleAccount.refreshToken,
      userId
    );
    
    // Utiliser l'API OAuth2 v2 pour récupérer les infos utilisateur
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfoResponse = await oauth2.userinfo.get();
    const googleUser = userInfoResponse.data;

    res.json({
      success: true,
      user: {
        id: user.id,
        name: googleUser.name || user.name,
        email: googleUser.email || user.email,
        picture: googleUser.picture, // URL de la photo de profil
        givenName: googleUser.given_name,
        familyName: googleUser.family_name
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération info utilisateur:', error);
    
    // En cas d'erreur, retourner les infos de base depuis la DB
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: null
        }
      });
    } catch (dbError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des informations utilisateur' 
      });
    }
  }
});

/**
 * DELETE /auth/disconnect/:userId/:provider
 * Déconnecte un service cloud
 */
router.delete('/disconnect/:userId/:provider', async (req, res) => {
  const { userId, provider } = req.params;
  try {
    await prisma.cloudAccount.delete({ 
      where: { userId_provider: { userId, provider } } 
    });
    res.json({ success: true, message: `${provider} déconnecté avec succès` });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la déconnexion' });
  }
});

router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Récupérer les tokens de l'utilisateur
    const tokens = await prisma.token.findMany({
      where: { userId: parseInt(userId) },
      select: { provider: true }
    });

    // Formatter la réponse
    const connections = {
      google_drive: tokens.some(t => t.provider === 'google_drive'),
      dropbox: tokens.some(t => t.provider === 'dropbox')
    };

    res.json({ connections });
  } catch (error) {
    console.error('Error fetching auth status:', error);
    res.status(500).json({ error: 'Failed to fetch auth status' });
  }
});




module.exports = router;