// frontend/src/features/notifications/components/NotificationDrawer.jsx
import { useState, useEffect } from 'react';
import { Bell, 
          Check, 
          CheckCheck, 
          RefreshCw, 
          X, 
          Filter, 
} from 'lucide-react';
import { notificationService } from '@core/services';
import { formatTimestamp, formatDate, getTypeIcon } from '../utils/notificationUtils.jsx';


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

const handleMarkAsUnread = async (notificationId) => {
  try {
    await notificationService.markAsUnread(notificationId, userId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n)
    );
  } catch (err) {
    console.error('Erreur marquage non-lu:', err);
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

// Badge source
const getSourceBadge = (source) => {
  const badges = {
    google: { label: 'Google Drive', color: 'text-green-700' },
    dropbox: { label: 'Dropbox', color: 'text-blue-600' },
    app: { label: 'Application', color: 'text-indigo-700' }
  };
  const badge = badges[source] || badges.app;
  return (
    <span className={`text-xs font-medium ${badge.color}`}>
      {badge.label}
    </span>
  );
};

// Icône type

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
        <div className="text-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold">Notifications</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filtres dans le header */}
          <div className="flex gap-2">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Filter className="w-4 h-4" />
              </span>

              {/* Input / Dropdown */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option value="all" className="text-gray-900">Toutes les sources</option>
                <option value="google" className="text-gray-900">Google Drive</option>
                <option value="dropbox" className="text-gray-900">Dropbox</option>
                <option value="app" className="text-gray-900">Application</option>
              </select>
            </div>


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
{/* Toggle non-lues */}
<div className="flex items-center justify-between mt-4">
  <span className="text-sm text-gray/90">Afficher uniquement les non-lues</span>
  
  <button
    onClick={() => setShowOnlyUnread(!showOnlyUnread)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
      ${showOnlyUnread ? 'bg-gray-100' : 'bg-gray-200'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-purple-700 transition-transform duration-300
        ${showOnlyUnread ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
</div>
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
                        <div className="flex items-center gap-3">
                          {/* Icône du type */}
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(notif.type)}
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(notif.timestamp).replace('Il y a ', '')}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-900 leading-relaxed break-words">
                              {notif.message}
                            </p>
                            {getSourceBadge(notif.source)}
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
              className="w-full py-3 px-4 bg-violet-800 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
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