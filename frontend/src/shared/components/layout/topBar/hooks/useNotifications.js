import { useEffect, useState } from 'react';
import { notificationService } from '@core/services';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { notifications } = await notificationService.getFeed(userId, { includeRead: true, limit: 30 });
      setNotifications(notifications);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { count } = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (err) {
      console.error('Erreur chargement compteur:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id, userId);
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      loadUnreadCount();
    } catch (err) {
      console.error('Erreur marquage lecture:', err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadNotifications();
    loadUnreadCount();
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return { notifications, unreadCount, loading, loadNotifications, markAsRead };
};
