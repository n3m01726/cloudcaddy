import { useState, useRef, useEffect } from 'react';
import { Settings, Link2, LogOut, ChevronDown, Cloud, HardDrive } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'Connexions', href: '/connections', icon: Link2, description: 'Gérer vos clouds' },
    { label: 'Paramètres', href: '/settings', icon: Settings, description: 'Configuration' },
  ];

  const getInitial = () => {
    if (user?.name) return user.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return '?';
  };

  // Mock data pour les stats (à remplacer par vos vraies données)
  const cloudStats = {
    connected: 2,
    totalSpace: '15 GB',
    usedSpace: '8.4 GB'
  };

  // Composant Avatar réutilisable
  const Avatar = ({ size = 'md', className = '' }) => {
    const sizes = {
      sm: 'w-10 h-10 text-base',
      md: 'w-10 h-10 text-base',
      lg: 'w-14 h-14 text-xl'
    };

    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white ${className}`}>
        {user?.picture && !imageError ? (
          <img
            src={user.picture}
            alt={user.name || user.email || 'Utilisateur'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{getInitial()}</span>
        )}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
        aria-label="Menu utilisateur"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <Avatar className="group-hover:ring-indigo-100 transition-all duration-200" />

        {/* Info utilisateur - caché sur mobile */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-gray-900">
            {user?.name || 'Utilisateur'}
          </div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>

        {/* Chevron */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* En-tête avec profil */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="shadow-lg" />
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-gray-900 truncate">
                  {user?.name || 'Utilisateur'}
                </div>
                <div className="text-xs text-gray-600 truncate">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Stats des clouds */}
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Cloud className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-medium text-gray-500">Clouds</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{cloudStats.connected}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-500">Espace</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{cloudStats.usedSpace}</div>
                <div className="text-xs text-gray-500">sur {cloudStats.totalSpace}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Déconnexion */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout?.();
              }}
              className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">Déconnexion</div>
                <div className="text-xs text-red-500">Quitter l'application</div>
              </div>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}