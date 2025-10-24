// frontend/src/shared/components/layout/Topbar.jsx
import { Bell, UserPlus, Settings, Cable, Map, LogOut, LibraryBig, NotebookPen, Calendar1, RefreshCw, Zap, History } from 'lucide-react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useState, useEffect } from 'react';
import NotificationDropdown from '@/features/notifications/components/NotificationDropdown';
import NotificationDrawer from '@/features/notifications/components/NotificationDrawer';
import { notificationService } from '@/core/services/api';

const Topbar = ({ userId }) => {
  const { userInfo, loading } = useUserInfo(userId);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const userName = userInfo?.name || 'User';
  const userEmail = userInfo?.email || '';
  const userPicture = userInfo?.picture || null;
  const userInitial = userName.charAt(0).toUpperCase();

  // Charger les notifications et le compteur
  useEffect(() => {
    if (userId) {
      loadNotifications();
      loadUnreadCount();
      
      // Actualiser toutes les 30 secondes
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificationService.getFeed(userId, {
        includeRead: true,
        limit: 30
      });
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount(userId);
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Erreur chargement compteur:', error);
    }
  };

  const handleToggleDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (!showNotificationDropdown) {
      loadNotifications();
    }
  };

  const handleOpenDrawer = () => {
    setShowNotificationDropdown(false); // Ferme le dropdown
    // Petit délai pour laisser le dropdown se fermer d'abord
    setTimeout(() => {
      setShowNotificationDrawer(true);
      loadNotifications();
    }, 150);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId, userId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Erreur marquage lecture:', error);
    }
  };

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 flex items-center justify-between px-6">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Dashboard</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Invite Button */}
          <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Invite People</span>
          </button>

          {/* All Apps Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAppsMenu(!showAppsMenu)}
              className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition flex items-center justify-center text-[#666666]"
            >
              <LibraryBig className="w-5 h-5" />
            </button>

            {showAppsMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAppsMenu(false)} />

                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-20 p-4">
                  <p className="text-xs font-semibold text-[#999999] uppercase mb-3">
                    Apps en développement
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-[#F5F5F5] transition">
                      <span className="w-15 h-15 rounded-lg bg-yellow-100 flex items-center justify-center mb-2">
                        <NotebookPen className='w-10 h-10 text-yellow-600'/>
                      </span>
                      <span className="text-xs text-[#333333] text-center">Notes</span>
                    </button>

                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-[#F5F5F5] transition">
                      <span className="w-15 h-15 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                        <Calendar1 className='w-10 h-10 text-blue-600'/>
                      </span>
                      <span className="text-xs text-[#333333] text-center">Calendrier</span>
                    </button>

                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-[#F5F5F5] transition">
                      <span className="w-15 h-15 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                        <RefreshCw className='w-10 h-10 text-purple-600'/>
                      </span>
                      <span className="text-xs text-[#333333] text-center">Convertisseur</span>
                    </button>

                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-[#F5F5F5] transition">
                      <span className="w-15 h-15 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                        <Zap className='w-10 h-10 text-green-600'/>
                      </span>
                      <span className="text-xs text-[#333333] text-center">Automations</span>
                    </button>

                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-[#F5F5F5] transition col-span-2">
                      <span className="w-15 h-15 rounded-lg bg-red-100 flex items-center justify-center mb-2">
                        <History className='w-10 h-10 text-red-600'/>
                      </span>
                      <span className="text-xs text-[#333333] text-center">Historique / Versions</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications - Dropdown + Drawer */}
          <div className="relative">
            <button
              onClick={handleToggleDropdown}
              className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition flex items-center justify-center text-[#666666] relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown (aperçu rapide) */}
            <NotificationDropdown
              notifications={notifications}
              isOpen={showNotificationDropdown}
              onClose={() => setShowNotificationDropdown(false)}
              onOpenDrawer={handleOpenDrawer}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>

          {/* Avatar avec menu */}
          <div className="relative">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative focus:outline-none rounded-full mt-1"
              >
                {userPicture ? (
                  <img
                    src={userPicture}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => console.log('Erreur chargement avatar', e)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-blue-600 flex items-center justify-center text-white font-medium cursor-pointer hover:shadow-lg transition">
                    {userInitial}
                  </div>
                )}
              </button>
            )}

            {/* Dropdown menu utilisateur */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />

                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      {userPicture ? (
                        <img
                          src={userPicture}
                          alt={userName}
                          className="w-12 h-12 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                          {userInitial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-[#999999] truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = '/settings';
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] transition flex items-center space-x-2"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = '/connections';
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] transition flex items-center space-x-2"
                    >
                      <Cable className="w-5 h-5" />
                      <span>Connections</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = '/roadmap';
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] transition flex items-center space-x-2"
                    >
                      <Map className="w-5 h-5" />
                      <span>Roadmap</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem('userId');
                        window.location.href = '/connections';
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Drawer (vue complète) */}
      <NotificationDrawer 
        userId={userId} 
        isOpen={showNotificationDrawer} 
        onClose={() => setShowNotificationDrawer(false)} 
      />
    </>
  );
};

export default Topbar;