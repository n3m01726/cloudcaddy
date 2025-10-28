// frontend/src/features/notifications/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@core/services';

/**
 * Hook pour gérer les notifications
 */
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les notifications
  const loadNotifications = useCallback(async (options = {}) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getFeed(userId, options);
      setNotifications(response.notifications);
      
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger le compteur de non-lues
  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await notificationService.getUnreadCount(userId);
      setUnreadCount(response.count);
    } catch (err) {
      console.error('Erreur compteur:', err);
    }
  }, [userId]);

  // Créer une notification
  const createNotification = useCallback(async (type, message, metadata = {}) => {
    if (!userId) return;
    
    try {
      await notificationService.create(userId, type, message, metadata);
      await loadNotifications();
      await loadUnreadCount();
    } catch (err) {
      console.error('Erreur création notification:', err);
      throw err;
    }
  }, [userId, loadNotifications, loadUnreadCount]);

  // Marquer comme lu
  const markAsRead = useCallback(async (notificationId) => {
    if (!userId) return;
    
    try {
      await notificationService.markAsRead(notificationId, userId);
      
      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      
      await loadUnreadCount();
    } catch (err) {
      console.error('Erreur marquage lecture:', err);
      throw err;
    }
  }, [userId, loadUnreadCount]);

  // Marquer tout comme lu
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    
    try {
      await notificationService.markAllAsRead(userId);
      
      // Mettre à jour localement
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur marquage tout:', err);
      throw err;
    }
  }, [userId]);

  // Charger au montage
  useEffect(() => {
    if (userId) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [userId, loadNotifications, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    loadUnreadCount,
    createNotification,
    markAsRead,
    markAllAsRead
  };
}

export default useNotifications;