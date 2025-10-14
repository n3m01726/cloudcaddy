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

router.get('/google', (req, res) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Erreur génération URL Google:', error);
    res.status(500).json({ success: false, error: 'Erreur OAuth Google' });
  }
});

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

router.get('/dropbox', (req, res) => {
  try {
    const authUrl = getDropboxAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Erreur génération URL Dropbox:', error);
    res.status(500).json({ success: false, error: 'Erreur OAuth Dropbox' });
  }
});

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

router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { cloudAccounts: true } });
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
});

router.get('/user/info/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { cloudAccounts: { where: { provider: 'google_drive' } } }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const googleAccount = user.cloudAccounts.find(acc => acc.provider === 'google_drive');
    
    if (!googleAccount) {
      return res.status(404).json({ 
        success: false, 
        error: 'Aucun compte Google Drive connecté',
        user: { name: user.name, email: user.email }
      });
    }

    const oauth2Client = createAuthenticatedGoogleClient(
      googleAccount.accessToken, 
      googleAccount.refreshToken
    );
    
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const aboutResponse = await drive.about.get({ fields: 'user' });
    const driveUser = aboutResponse.data.user;

    res.json({
      success: true,
      user: {
        id: user.id,
        name: driveUser.displayName || user.name,
        email: driveUser.emailAddress || user.email,
        picture: driveUser.photoLink,
        givenName: driveUser.displayName?.split(' ')[0] || user.name,
        familyName: driveUser.displayName?.split(' ').slice(1).join(' ') || ''
      }
    });

  } catch (error) {
    console.error('Erreur récupération info utilisateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des informations utilisateur' 
    });
  }
});

router.delete('/disconnect/:userId/:provider', async (req, res) => {
  const { userId, provider } = req.params;
  try {
    await prisma.cloudAccount.delete({ where: { userId_provider: { userId, provider } } });
    res.json({ success: true, message: `${provider} déconnecté avec succès` });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la déconnexion' });
  }
});

module.exports = router;
