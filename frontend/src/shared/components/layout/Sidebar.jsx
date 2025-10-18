import { useState } from 'react';
import { 
  Cloud, Search, Folder, Image, Users, Inbox, Trash2, 
  FolderHeart, Plus, Settings, Map, LogOut, CheckCircle, PlusCircle, Crown
} from 'lucide-react';
import { FaGoogle, FaDropbox, FaFolder } from 'react-icons/fa'; // react-icons utilise FontAwesome
const Sidebar = ({ currentPath = '/', onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', icon: Folder, label: 'Dashboard', path: '/' },
    { id: 'all', icon: Folder, label: 'All Files', path: '/files' },
    { id: 'photos', icon: Image, label: 'Photos', path: '/photos' },
    { id: 'shared', icon: Users, label: 'Shared', path: '/shared' },
    { id: 'requests', icon: Inbox, label: 'File Requests', path: '/requests' },
    { id: 'trash', icon: Trash2, label: 'Trash', path: '/trash' },
  ];

  const favorites = [
    { id: 1, name: 'Work Documents', icon: FolderHeart, color: 'text-yellow-400' },
    { id: 2, name: 'Photos 2024', icon: FolderHeart, color: 'text-yellow-400' },
    { id: 3, name: 'Client Projects', icon: FolderHeart, color: 'text-yellow-400' },
  ];

  const connectedServices = [
    { id: 'google', name: 'Google Drive', icon: <FaGoogle className="text-[#4285F4]" />, connected: true },
    { id: 'dropbox', name: 'Dropbox', icon: <FaDropbox className="text-[#0061FF]" />, connected: false },
  ];

  const storageUsed = 8;
  const storageTotal = 10;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const isActive = (path) => currentPath === path;

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <button
        onClick={() => onNavigate?.(item.path)}
        className={`
          w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg 
          transition-all duration-200
          ${active 
            ? 'bg-[#DBEAFE] text-[#3B82F6] font-medium' 
            : 'text-[#666666] hover:bg-[#F5F5F5]'
          }
        `}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col border-b border-t border-gray-200">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 ">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-[#1A1A1A]">CloudHub</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto py-4">
        
        {/* Quick Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] rounded-lg text-sm 
                border border-gray-200 focus:outline-none focus:border-[#3B82F6] 
                focus:ring-2 focus:ring-[#3B82F6]/20 transition"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-2 mb-2 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Separator */}
        <div className="border-t border-gray-200 my-3 mx-4" />

        {/* Favorites */}
        <div className="px-2 mb-2">
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[#999999] uppercase tracking-wider">
              Favorites
            </span>
            <button className="text-[#999999] hover:text-[#3B82F6] transition">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg 
                  text-[#666666] hover:bg-[#F5F5F5] transition"
              >
                <FolderHeart className={`w-6 h-6 ${fav.color} fill-current`} />
                <span className="text-sm">{fav.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-3 mx-4" />

        {/* Connected Services */}
        <div className="px-2 mb-2">
          <div className="px-4 py-2">
            <span className="text-xs font-medium text-[#999999] uppercase tracking-wider">
              Connected Services
            </span>
          </div>
          <div className="space-y-1">
            {connectedServices.map((service) => (
              <button
                key={service.id}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg 
                  text-[#666666] hover:bg-[#F5F5F5] transition"
              >
                <div className="flex items-center space-x-3">
                  <span>{service.icon}</span>
                  <span className="text-sm">{service.name}</span>
                </div>
                {service.connected && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}
            <button
              onClick={() => onNavigate?.('/connections')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg 
                text-[#3B82F6] hover:bg-[#DBEAFE] transition font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm">Add Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section 
      <div className="border-t border-gray-200 px-4">
        {/* Storage Info
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4 mb-3 text-white mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">UPGRADE TO PRO PLAN</span>
            <Crown className="w-6 h-6 text-white-300" />
          </div>
          <span className="text-xs">Unlock more power! Upgrade to Pro and enjoy advanced features designed to save you time and boost your workflow.</span>
          <div className="mb-2 mt-4">
            <div className="w-full bg-white/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500" 
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          </div>
          <div className="text-xs opacity-90">
            {storageUsed}GB of {storageTotal}GB used
          </div>
        </div>
      </div>*/}
    </aside>
  );
};

export default Sidebar;