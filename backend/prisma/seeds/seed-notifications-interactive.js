// backend/prisma/seeds/seed-notifications.js
// Script pour créer des notifications de test

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedNotifications() {
  const userId = 'cmgzlormb0000kghg1abywzkc'; // Récupère-le depuis ta table users
  
  console.log('Seeding notifications...');
  
  const notifications = [
    {
      userId,
      source: 'app',
      type: 'file_uploaded',
      message: '"rapport-Q1.pdf" uploadé sur Google Drive',
      metadata: {
        fileName: 'rapport-Q1.pdf',
        provider: 'Google Drive',
        fileId: 'xyz789'
      },
      isRead: false,
      createdAt: new Date('2025-10-22T14:30:00.000Z')
    },
    {
      userId,
      source: 'google',
      type: 'file_modified',
      message: '"budget-2025.xlsx" a été modifié',
      metadata: {
        fileName: 'budget-2025.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileId: 'google-file-123'
      },
      isRead: false,
      createdAt: new Date('2025-10-22T12:15:00.000Z')
    },
    {
      userId,
      source: 'dropbox',
      type: 'file_modified',
      message: '"photos-vacances" a été mis à jour',
      metadata: {
        fileName: 'photos-vacances',
        pathDisplay: '/Photos/photos-vacances',
        fileId: 'dropbox-folder-456'
      },
      isRead: true,
      createdAt: new Date('2025-10-21T18:45:00.000Z')
    },
    {
      userId,
      source: 'app',
      type: 'service_connected',
      message: 'Google Drive connecté avec succès',
      metadata: {
        service: 'Google Drive'
      },
      isRead: true,
      createdAt: new Date('2025-10-21T10:00:00.000Z')
    },
    {
      userId,
      source: 'app',
      type: 'file_deleted',
      message: '🗑️ "old-backup.zip" supprimé',
      metadata: {
        fileName: 'old-backup.zip'
      },
      isRead: false,
      createdAt: new Date('2025-10-22T09:30:00.000Z')
    },
    {
      userId,
      source: 'app',
      type: 'file_shared',
      message: '"contrat-client.pdf" partagé avec john@example.com',
      metadata: {
        fileName: 'contrat-client.pdf',
        recipient: 'john@example.com'
      },
      isRead: false,
      createdAt: new Date('2025-10-22T16:20:00.000Z')
    },
    {
      userId,
      source: 'google',
      type: 'file_modified',
      message: '"presentation.pptx" a été modifié',
      metadata: {
        fileName: 'presentation.pptx',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        fileId: 'google-file-789'
      },
      isRead: true,
      createdAt: new Date('2025-10-20T14:00:00.000Z')
    },
    {
      userId,
      source: 'app',
      type: 'error',
      message: 'Échec de synchronisation avec Dropbox',
      metadata: {
        type: 'error',
        errorCode: 'SYNC_FAILED'
      },
      isRead: false,
      createdAt: new Date('2025-10-22T08:00:00.000Z')
    },
    {
      userId,
      source: 'dropbox',
      type: 'file_modified',
      message: '"documents/invoices" a été mis à jour',
      metadata: {
        fileName: 'invoices',
        pathDisplay: '/documents/invoices',
        fileId: 'dropbox-folder-999'
      },
      isRead: false,
      createdAt: new Date('2025-10-22T11:10:00.000Z')
    },
    {
      userId,
      source: 'app',
      type: 'success',
      message: 'Sauvegarde automatique terminée',
      metadata: {
        type: 'success',
        filesCount: 42
      },
      isRead: true,
      createdAt: new Date('2025-10-21T23:00:00.000Z')
    }
  ];
  
  // Créer toutes les notifications
  for (const notif of notifications) {
    await prisma.notification.create({
      data: notif
    });
    console.log(`✅ Created: ${notif.message}`);
  }
  
  console.log(`\n🎉 ${notifications.length} notifications créées avec succès !`);
}

async function main() {
  try {
    await seedNotifications();
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();