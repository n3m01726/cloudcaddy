// backend/test-api-notifications.js
// Script pour tester l'API des notifications

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const USER_ID = 'cmgzlormb0000kghg1abywzkc'; // Remplace par ton userId

async function testAPI() {
  console.log('\n🧪 Test de l\'API Notifications\n');
  console.log('═'.repeat(60));
  
  try {
    // Test 1: Récupérer toutes les notifications
    console.log('\n📋 Test 1: GET /notifications/feed/:userId');
    const response1 = await axios.get(`${BASE_URL}/notifications/feed/${USER_ID}`);
    
    console.log(`✅ Status: ${response1.status}`);
    console.log(`📊 Count: ${response1.data.count} notifications`);
    
    // Analyser les sources
    const sources = response1.data.notifications.map(n => n.source);
    const uniqueSources = [...new Set(sources)];
    
    console.log(`🔍 Sources uniques: ${uniqueSources.join(', ')}`);
    
    const bySource = sources.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Répartition:');
    Object.entries(bySource).forEach(([source, count]) => {
      const icon = source === 'google' ? '🔵' : source === 'dropbox' ? '🔷' : '🟣';
      console.log(`   ${icon} ${source.padEnd(10)}: ${count}`);
    });
    
    // Afficher quelques exemples
    console.log('\n📄 Exemples de notifications:');
    response1.data.notifications.slice(0, 3).forEach((notif, i) => {
      console.log(`\n${i + 1}. Source: "${notif.source}" (type: ${typeof notif.source})`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Type: ${notif.type}`);
    });
    
    // Test 2: Filter par source
    console.log('\n\n📋 Test 2: GET /notifications/feed/:userId?source=google');
    const response2 = await axios.get(`${BASE_URL}/notifications/feed/${USER_ID}?source=google`);
    
    console.log(`✅ Status: ${response2.status}`);
    console.log(`📊 Count: ${response2.data.count} notifications Google`);
    
    const allGoogle = response2.data.notifications.every(n => n.source === 'google');
    console.log(`🔍 Toutes les notifications sont Google: ${allGoogle ? '✅' : '❌'}`);
    
    if (!allGoogle) {
      console.log('⚠️  Problème: Le filtre ne fonctionne pas correctement');
      console.log('Sources trouvées:', [...new Set(response2.data.notifications.map(n => n.source))]);
    }
    
    // Test 3: Filter par Dropbox
    console.log('\n\n📋 Test 3: GET /notifications/feed/:userId?source=dropbox');
    const response3 = await axios.get(`${BASE_URL}/notifications/feed/${USER_ID}?source=dropbox`);
    
    console.log(`✅ Status: ${response3.status}`);
    console.log(`📊 Count: ${response3.data.count} notifications Dropbox`);
    
    // Test 4: Compteur de non-lues
    console.log('\n\n📋 Test 4: GET /notifications/unread/:userId');
    const response4 = await axios.get(`${BASE_URL}/notifications/unread/${USER_ID}`);
    
    console.log(`✅ Status: ${response4.status}`);
    console.log(`📊 Non-lues: ${response4.data.count}`);
    
    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ Tous les tests réussis!\n');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testAPI();