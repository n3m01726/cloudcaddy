// frontend/src/features/notifications/components/NotificationFeed.jsx
// Pour utiliser ce composant dans la Topbar, importe-le et utilise un state local :
// 
// import NotificationFeed from '@/features/notifications/components/NotificationFeed';
// const [showNotifications, setShowNotifications] = useState(false);
//
// Dans le JSX de la Topbar :

import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Filter, RefreshCw } from 'lucide-react';
import { FaGoogle, FaDropbox } from 'react-icons/fa';
import { notificationService } from '@/core/services/api';

export default function NotificationFeed({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | google | dropbox | app
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadNotifications();
    }
  }, [isOpen, userId, filter, showOnlyUnread]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getFeed(userId, {
        source: filter === 'all' ? undefined : filter,
        includeRead: !showOnlyUnread,
        limit: 30
      });
      
      setNotifications(response.notifications);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId, userId);
      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Erreur marquage lecture:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      // Mettre à jour localement
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Erreur marquage tout:', err);
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'google':
        return <FaGoogle className="w-5 h-5 text-blue-500" />;
      case 'dropbox':
        return <FaDropbox className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-16 bottom-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2 mb-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-3 py-1.5 text-md border border-blue-300 bg-blue-500 "
            >
              <option value="all">Toutes les sources</option>
              <option value="google">Google Drive</option>
              <option value="dropbox">Dropbox</option>
              <option value="app">Application</option>
            </select>
            
            <button
              onClick={loadNotifications}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Toggle non-lues */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyUnread}
              onChange={(e) => setShowOnlyUnread(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600">Non-lues uniquement</span>
          </label>
        </div>

        {/* Liste des notifications */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {error && (
            <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notif.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icône de la source */}
                    <div className="flex-shrink-0 mt-1">
                      {getSourceIcon(notif.source)}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 break-words">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(notif.timestamp)}
                      </p>
                    </div>

                    {/* Bouton marquer comme lu */}
                    {!notif.isRead && notif.source === 'app' && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Marquer comme lu"
                      >
                        <Check className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleMarkAllAsRead}
              className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>
    </>
  );
}