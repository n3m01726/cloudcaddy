const { prisma } = require('@config/database');
const { 
  getDropboxAuthUrl,
  getDropboxTokensFromCode,
  getDropboxAccountInfo
} = require('@config/oauth');

exports.getAuthUrl = (req, res) => {
  try {
    res.json({ success: true, authUrl: getDropboxAuthUrl() });
  } catch (error) {
    console.error('Erreur génération URL Dropbox:', error);
    res.status(500).json({ success: false, error: 'Erreur OAuth Dropbox' });
  }
};

exports.callback = async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);

  try {
    const tokens = await getDropboxTokensFromCode(code);
    const userInfo = await getDropboxAccountInfo(tokens.access_token);

    let user = await prisma.user.upsert({
      where: { email: userInfo.email },
      update: { name: userInfo.name },
      create: { email: userInfo.email, name: userInfo.name },
    });

    const expiresAt = tokens.expires_in 
      ? new Date(Date.now() + tokens.expires_in * 1000) 
      : new Date(Date.now() + 3600 * 1000);

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
      },
    });

    res.redirect(`${process.env.FRONTEND_URL}?auth=success&userId=${user.id}`);
  } catch (err) {
    console.error('Erreur callback Dropbox:', err);
    res.redirect(`${process.env.FRONTEND_URL}?error=dropbox_token_exchange_failed`);
  }
};
