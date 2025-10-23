// frontend/src/features/notifications/components/NotificationDrawer.jsx
import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, RefreshCw, X, Filter } from 'lucide-react';
import { FaGoogle, FaDropbox } from 'react-icons/fa';
import { notificationService } from '@/core/services/api';

export default function NotificationDrawer({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
        limit: 50
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

  const getSourceBadge = (source) => {
    const badges = {
      google: { label: 'Drive', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      dropbox: { label: 'Dropbox', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      app: { label: 'App', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
    };
    const badge = badges[source] || badges.app;
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Grouper par date
  const groupedNotifications = notifications.reduce((groups, notif) => {
    const dateKey = formatDate(notif.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notif);
    return groups;
  }, {});

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Overlay avec blur */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Notifications</h2>
                <p className="text-white/80 text-sm">
                  {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filtres dans le header */}
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="all" className="text-gray-900">Toutes les sources</option>
              <option value="google" className="text-gray-900">Google Drive</option>
              <option value="dropbox" className="text-gray-900">Dropbox</option>
              <option value="app" className="text-gray-900">Application</option>
            </select>
            
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="px-3 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-lg transition-colors disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Toggle non-lues */}
          <label className="flex items-center gap-2 text-sm mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyUnread}
              onChange={(e) => setShowOnlyUnread(e.target.checked)}
              className="rounded border-white/30 bg-white/10 text-white focus:ring-white/30 focus:ring-offset-0"
            />
            <span className="text-white/90">Afficher uniquement les non-lues</span>
          </label>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          )}

          {error && (
            <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-1">Aucune notification</p>
              <p className="text-sm text-center">
                Vos notifications apparaîtront ici
              </p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="p-4 space-y-6">
              {Object.entries(groupedNotifications).map(([date, notifs]) => (
                <div key={date}>
                  {/* Date separator */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {date}
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>

                  {/* Notifications du jour */}
                  <div className="space-y-2">
                    {notifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                          !notif.isRead 
                            ? 'border-indigo-200 ring-1 ring-indigo-100' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icône de la source */}
                          <div className="flex-shrink-0 mt-1">
                            {getSourceIcon(notif.source)}
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              {getSourceBadge(notif.source)}
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(notif.timestamp).replace('Il y a ', '')}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-900 leading-relaxed break-words">
                              {notif.message}
                            </p>
                          </div>

                          {/* Bouton marquer comme lu */}
                          {!notif.isRead && notif.source === 'app' && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="flex-shrink-0 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors group"
                              title="Marquer comme lu"
                            >
                              <Check className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!loading && notifications.length > 0 && unreadCount > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleMarkAllAsRead}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-5 h-5" />
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>
    </>
  );
}