// backend/src/modules/notifications/routes.js
const express = require('express');
const router = express.Router();
const notificationService = require('@modules/notifications/NotificationService');

/**
 * GET /notifications/feed/:userId
 * Récupère le flux de notifications unifié
 * Query params: ?source=google|dropbox|app&includeRead=true|false&limit=20
 */
router.get('/feed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { source, includeRead = 'true', limit = '20' } = req.query;
    
    const notifications = await notificationService.getUserNotifications(userId, {
      source,
      includeRead: includeRead === 'true',
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      notifications,
      count: notifications.length
    });
    
  } catch (error) {
    console.error('Erreur récupération feed:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de récupérer les notifications'
    });
  }
});

/**
 * GET /notifications/unread/:userId
 * Compte les notifications non lues
 */
router.get('/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await notificationService.getUnreadCount(userId);
    
    res.json({
      success: true,
      count
    });
    
  } catch (error) {
    console.error('Erreur comptage non lues:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de compter les notifications non lues'
    });
  }
});

/**
 * POST /notifications/create/:userId
 * Crée une notification interne
 */
router.post('/create/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, message, metadata } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({
        success: false,
        error: 'Type et message requis'
      });
    }
    
    const notification = await notificationService.createAppNotification(
      userId,
      type,
      message,
      metadata
    );
    
    res.json({
      success: true,
      notification
    });
    
  } catch (error) {
    console.error('Erreur création notification:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de créer la notification'
    });
  }
});

/**
 * PUT /notifications/read/:notificationId/:userId
 * Marque une notification comme lue
 */
router.put('/read/:notificationId/:userId', async (req, res) => {
  try {
    const { notificationId, userId } = req.params;
    
    await notificationService.markAsRead(notificationId, userId);
    
    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });
    
  } catch (error) {
    console.error('Erreur marquage lecture:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de marquer la notification comme lue'
    });
  }
});

/**
 * PUT /notifications/read-all/:userId
 * Marque toutes les notifications comme lues
 */
router.put('/read-all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await notificationService.markAllAsRead(userId);
    
    res.json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });
    
  } catch (error) {
    console.error('Erreur marquage toutes:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de marquer toutes les notifications comme lues'
    });
  }
});

module.exports = router;