// ----------------------
// 🌍 Point d'entrée du serveur Express (CommonJS)
// ----------------------
require('module-alias/register');
require('dotenv').config();

const randomBytes = require('crypto');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { checkDatabaseConnection } = require('@config/database.js');

// 🧭 Import des routes
const authRoutes = require('@routes/auth.js');
const filesRoutes = require('@routes/files.js');
const metadataRoutes = require('@routes/metadata.js');
const notificationRoutes = require('@routes/notifications.js');

// ----------------------
// ⚙️ Initialisation
// ----------------------
const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------
// 🧱 Middlewares
// ----------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes (utile en dev)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ----------------------
// 🚏 Routes principales
// ----------------------
app.use('/auth', authRoutes);
app.use('/files', filesRoutes);
app.use('/metadata', metadataRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Multi-Cloud Manager API is running',
    timestamp: new Date().toISOString(),
  });
});


app.use('/notifications', notificationRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur cloudCaddy API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      files: '/files',
    },
  });
});

app.post("/api/invite", async (req, res) => {
  const token = randomBytes(16).toString("hex"); // exemple
  const invite = await db.invites.create({
    token,
    createdBy: req.user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expire dans 7 jours
  });

  const inviteUrl = `${process.env.FRONTEND_URL}/invite/${token}`;
  res.json({ inviteUrl });
});

// ----------------------
// ❌ Gestion 404
// ----------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
  });
});

// ----------------------
// 🧩 Gestion d'erreurs globales
// ----------------------
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ----------------------
// 🚀 Démarrage du serveur
// ----------------------
async function startServer() {
  try {
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      console.error('❌ Impossible de démarrer le serveur sans connexion à la base de données');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   Multi-Cloud Manager API                  ║
║   Serveur démarré sur le port ${PORT}        ║
║   URL: http://localhost:${PORT}              ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// ----------------------
// 🧹 Arrêt propre du serveur
// ----------------------
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu, arrêt du serveur...');
  process.exit(0);
});

startServer();

// ----------------------
// 📤 Export pour tests (optionnel)
module.exports = app;
