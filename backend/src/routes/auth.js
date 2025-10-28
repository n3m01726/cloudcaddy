const express = require('express');
const auth = require('@controllers/auth');
const router = express.Router();

// Google
router.get('/google', auth.google.getAuthUrl);
router.get('/google/callback', auth.google.callback);

// Dropbox
router.get('/dropbox', auth.dropbox.getAuthUrl);
router.get('/dropbox/callback', auth.dropbox.callback);

// Utilisateur
router.get('/status/:userId', auth.user.status);
router.get('/user/info/:userId', auth.user.info);
router.delete('/disconnect/:userId/:provider', auth.user.disconnect);

module.exports = router;
