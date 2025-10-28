const { prisma } = require('@config/database');
const { 
  getGoogleAuthUrl, 
  getGoogleTokensFromCode, 
  createAuthenticatedGoogleClient 
} = require('@config/oauth');
const { google } = require('googleapis');

exports.getAuthUrl = (req, res) => {
  try {
    res.json({ success: true, authUrl: getGoogleAuthUrl() });
  } catch (error) {
    console.error('Erreur génération URL Google:', error);
    res.status(500).json({ success: false, error: 'Erreur OAuth Google' });
  }
};

exports.callback = async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);

  try {
    const tokens = await getGoogleTokensFromCode(code);
    const oauth2Client = createAuthenticatedGoogleClient(tokens.access_token, tokens.refresh_token);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    let user = await prisma.user.upsert({
      where: { email: userInfo.data.email },
      update: { name: userInfo.data.name },
      create: { email: userInfo.data.email, name: userInfo.data.name },
    });

    const expiresAt = tokens.expiry_date 
      ? new Date(tokens.expiry_date) 
      : new Date(Date.now() + 3600 * 1000);

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
      },
    });

    res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${user.id}`);
  } catch (err) {
    console.error('Erreur callback Google:', err);
    res.redirect(`${process.env.FRONTEND_URL}?error=google_token_exchange_failed`);
  }
};
