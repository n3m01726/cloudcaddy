import { Bell, LibraryBig } from 'lucide-react';
import { useState } from 'react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { usePageTitle } from '@/components/layout/topBar/hooks/usePageTitle';
import { useNotifications } from '@/components/layout/topBar/hooks/useNotifications';
import NotificationDropdown from '@/features/notifications/components/NotificationDropdown';
import NotificationDrawer from '@/features/notifications/components/NotificationDrawer';
import InviteUser from '@/shared/components/InviteUser';
import TopbarAppsMenu from './TopbarAppsMenu';
import TopbarUserMenu from './TopbarUserMenu';

const Topbar = ({ userId }) => {
  const { userInfo, loading } = useUserInfo(userId);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pageTitle = usePageTitle();
  const { notifications, unreadCount, markAsRead, loadNotifications } = useNotifications(userId);

  const user = {
    name: userInfo?.name || 'User',
    email: userInfo?.email || '',
    picture: userInfo?.picture || null,
    initial: (userInfo?.name?.charAt(0) || 'U').toUpperCase(),
  };

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">{pageTitle}</h1>

        <div className="flex items-center space-x-3">
          <InviteUser />
          <button
            onClick={() => setShowAppsMenu(!showAppsMenu)}
            className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center text-[#666]"
          >
            <LibraryBig className="w-5 h-5" />
          </button>
          {showAppsMenu && <TopbarAppsMenu onClose={() => setShowAppsMenu(false)} />}

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-10 h-10 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center text-[#666]"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full px-1.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showDropdown}
            notifications={notifications}
            onClose={() => setShowDropdown(false)}
            onOpenDrawer={() => setShowDrawer(true)}
            onMarkAsRead={markAsRead}
          />

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="relative focus:outline-none">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                  {user.initial}
                </div>
              )}
            </button>
          )}
          {showUserMenu && <TopbarUserMenu user={user} onClose={() => setShowUserMenu(false)} />}
        </div>
      </header>

      <NotificationDrawer userId={userId} isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default Topbar;
