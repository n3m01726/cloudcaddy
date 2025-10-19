// routes/userAvatar.js
const express = require('express');
const axios = require('axios');
const { createAuthenticatedGoogleClient } = require('@config/oauth.js');
const { google } = require('googleapis');
const { prisma } = require('@config/database.js');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const account = await prisma.cloudAccount.findFirst({
      where: { userId, provider: 'google_drive' },
    });
    if (!account) return res.status(404).send('No Google account');

    const oauth2Client = createAuthenticatedGoogleClient(
      account.accessToken,
      account.refreshToken
    );
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Récupère l’image et la renvoie en flux
    const imgResp = await axios.get(data.picture, { responseType: 'arraybuffer' });
    res.set('Content-Type', imgResp.headers['content-type']);
    res.send(imgResp.data);
  } catch (err) {
    console.error('Erreur proxy avatar:', err.message);
    res.status(500).send('Erreur proxy avatar');
  }
});

module.exports = router;
