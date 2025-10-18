import { Bell, LayoutGrid, UserPlus, Settings, LogOut, Map, PlugZap } from 'lucide-react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import roadmapData from "@features/roadmap/data/roadmap.json";

const Topbar = ({ userId }) => {
  const { userInfo, loading } = useUserInfo(userId);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = userInfo?.name || 'User';
  const userEmail = userInfo?.email || '';
  const userPicture = userInfo?.picture || null;
  const userInitial = userName.charAt(0).toUpperCase();
  const location = useLocation();

const routeInfo = {
  '/dashboard': { title: 'Dashboard', description: 'Vue générale de vos activités' },
  '/connections': { title: 'Connexions', description: 'Gérez vos clouds' },
  '/settings': { title: 'Paramètres', description: 'Configurez votre compte' },
  '/roadmap': { 
    title: 'Roadmap',
    description: (
      <p className="text-sm text-gray-500">
        Version {roadmapData.version} • Last update:{" "}
        {new Date(roadmapData.lastUpdate).toLocaleDateString()}
      </p>
    )
  },
  '/files': { title: 'Mes fichiers', description: 'Accédez à tous vos fichiers' },
};

const info = routeInfo[location.pathname] || { title: 'Dashboard', description: '' };

  
  return (
    <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-t border-gray-200 
      flex items-center justify-between px-6">
      
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-semibold text-[#1A1A1A]">{info.title}</h1>
        <p className='text-xs text-gray-500'>{info.description}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        
        {/* Invite Button */}
        <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm 
          font-medium hover:bg-blue-600 transition flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Inviter des gens</span>
        </button>
        
        {/* All Apps */}
        <button className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition 
          flex items-center justify-center text-[#666666]">
          <LayoutGrid className="w-5 h-5" />
        </button>
        
        {/* Notifications */}
        <button className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition 
          flex items-center justify-center text-[#666666] relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        {/* Avatar avec menu */}
        <div className="relative">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 rounded-full"
            >
              {userPicture ? (
<img
  src={userPicture}
  alt={userName}
  className="w-10 h-10 rounded-full object-cover hover:shadow-lg transition"
  referrerPolicy="no-referrer"
  crossOrigin="anonymous"
  onError={(e) => console.log('Erreur chargement avatar', e)}
/>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] 
                  to-blue-600 flex items-center justify-center text-white font-medium 
                  cursor-pointer hover:shadow-lg transition">
                  {userInitial}
                </div>
              )}
            </button>
          )}

          {/* Dropdown menu */}
          {showUserMenu && (
            <>
              {/* Overlay pour fermer le menu */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                {/* User info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    {userPicture ? (
<img
  src={userPicture}
  alt={userName}
  className="w-10 h-10 rounded-full object-cover hover:shadow-lg transition"
  referrerPolicy="no-referrer"
  crossOrigin="anonymous"
  onError={(e) => console.log('Erreur chargement avatar', e)}
/>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] 
                        to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                        {userInitial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-[#999999] truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.href = '/settings';
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] transition flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.href = '/connections';
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] transition flex items-center space-x-2"
                  >
                    <PlugZap className="w-4 h-4" />
                    <span>Connections</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.href = '/roadmap';
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] transition flex items-center space-x-2"
                  >
                  <Map className="w-4 h-4" />
                    <span>Roadmap</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem('userId');
                      window.location.href = '/connections';
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                  >
                   <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;