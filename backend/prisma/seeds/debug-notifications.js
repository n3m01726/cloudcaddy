// backend/prisma/seeds/debug-notifications.js
// Script pour debugger les notifications

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugNotifications(userId) {
  console.log('\n🔍 Debug des notifications\n');
  console.log('═'.repeat(60));
  
  if (!userId) {
    // Récupérer tous les users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    
    if (users.length === 0) {
      console.log('\n❌ Aucun utilisateur trouvé\n');
      return;
    }
    
    console.log('\n📋 Utilisateurs disponibles:\n');
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name || 'Sans nom'} (${user.email || 'N/A'})`);
      console.log(`   ID: ${user.id}\n`);
    });
    
    console.log('💡 Usage: node debug-notifications.js <userId>\n');
    return;
  }
  
  // Vérifier que le user existe
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    console.log(`\n❌ Utilisateur ${userId} introuvable\n`);
    return;
  }
  
  console.log(`\n✅ Utilisateur: ${user.name || user.email}\n`);
  
  // Récupérer toutes les notifications
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log(`📊 Total: ${notifications.length} notifications\n`);
  
  if (notifications.length === 0) {
    console.log('💡 Aucune notification. Utilise le seed pour en créer.\n');
    return;
  }
  
  // Grouper par source
  const bySource = notifications.reduce((acc, n) => {
    acc[n.source] = (acc[n.source] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📈 Répartition par source:');
  Object.entries(bySource).forEach(([source, count]) => {
    const icon = source === 'google' ? '🔵' : source === 'dropbox' ? '🔷' : '🟣';
    console.log(`   ${icon} ${source.padEnd(10)}: ${count}`);
  });
  
  console.log('\n📋 Détail des notifications:\n');
  
  notifications.forEach((notif, index) => {
    const sourceIcon = notif.source === 'google' ? '🔵' : 
                       notif.source === 'dropbox' ? '🔷' : '🟣';
    const readIcon = notif.isRead ? '✅' : '🔴';
    
    console.log(`${index + 1}. ${sourceIcon} [${notif.source.toUpperCase()}] ${readIcon}`);
    console.log(`   Message: ${notif.message}`);
    console.log(`   Type: ${notif.type}`);
    console.log(`   Créé: ${notif.createdAt.toLocaleString('fr-FR')}`);
    
    if (notif.metadata) {
      console.log(`   Metadata:`, JSON.stringify(notif.metadata, null, 2));
    }
    
    console.log('');
  });
  
  // Vérifier les non-lues
  const unreadCount = notifications.filter(n => !n.isRead).length;
  console.log('═'.repeat(60));
  console.log(`\n📌 Résumé:`);
  console.log(`   • Non-lues: ${unreadCount}`);
  console.log(`   • Lues: ${notifications.length - unreadCount}`);
  
  // Vérifier si les sources correspondent au seed
  console.log(`\n🔍 Vérification:`);
  
  const hasGoogle = bySource.google > 0;
  const hasDropbox = bySource.dropbox > 0;
  const hasApp = bySource.app > 0;
  
  console.log(`   ${hasGoogle ? '✅' : '❌'} Notifications Google`);
  console.log(`   ${hasDropbox ? '✅' : '❌'} Notifications Dropbox`);
  console.log(`   ${hasApp ? '✅' : '❌'} Notifications App`);
  
  if (!hasGoogle && !hasDropbox) {
    console.log(`\n⚠️  Toutes les notifications sont "app"`);
    console.log(`   → Le seed n'a peut-être pas créé de notifications Google/Dropbox`);
    console.log(`   → Vérifie que tu as bien utilisé le script interactif\n`);
  }
  
  console.log('');
}

const userId = process.argv[2];

debugNotifications(userId)
  .catch(error => {
    console.error('\n❌ Erreur:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });