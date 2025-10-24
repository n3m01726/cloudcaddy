// frontend/src/features/notifications/components/NotificationDropdown.jsx
import { Bell, ArrowRight } from 'lucide-react';
import { formatTimestamp, getTypeIcon } from '../utils/notificationUtils.jsx';

export default function NotificationDropdown({ 
  notifications, 
  isOpen, 
  onClose, 
  onOpenDrawer,
  onMarkAsRead 
}) {
  
  const handleOpenDrawer = () => {
    onClose(); // Ferme le dropdown
    // Attend que le dropdown se ferme avant d'ouvrir le drawer
    setTimeout(() => onOpenDrawer(), 150);
  };

  if (!isOpen) return null;

  // Prendre les 5 premières notifications
  const recentNotifications = notifications.slice(0, 5);
  const hasMore = notifications.length > 5;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Overlay transparent */}
      <div 
        className="fixed inset-0 z-30 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden animate-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="max-h-[400px] overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                    !notif.isRead ? 'bg-indigo-50/40' : ''
                  }`}
                  onClick={() => notif.source === 'app' && !notif.isRead && onMarkAsRead(notif.id)}
                >
                  {/* Indicateur non lu */}
                  {!notif.isRead && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full" />
                  )}

                  <div className="flex items-center gap-3">
                    {/* Icône */}
                    <div className="flex-shrink-0 mt-0.5 mr-1">
                      {getTypeIcon(notif.type)}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(notif.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Voir tout */}
       
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleOpenDrawer}
              className="w-full px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>Voir toutes les notifications ({notifications.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        
      </div>
    </>
  );
}