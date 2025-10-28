// src/utils/cloudConnector.js
const GoogleDriveConnector = require('@connectors/GoogleDriveProvider');
const DropboxConnector = require('@connectors/DropboxProvider');
const { prisma } = require('@config/database');

async function getConnector(userId, provider) {
  const account = await prisma.cloudAccount.findUnique({
    where: { userId_provider: { userId, provider } },
  });
  if (!account) throw new Error('Service cloud non connecté');

  switch (provider) {
    case 'google_drive':
      return new GoogleDriveConnector(account.accessToken, account.refreshToken, userId);
    case 'dropbox':
      return new DropboxConnector(account.accessToken);
    default:
      throw new Error(`Provider non supporté: ${provider}`);
  }
}

module.exports = { getConnector };
