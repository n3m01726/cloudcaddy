import { Settings, Cable, Map, LogOut } from 'lucide-react';

export default function TopbarUserMenu({ user, onClose }) {
  const { name, email, picture, initial } = user;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
          {picture ? (
            <img src={picture} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium text-lg">
              {initial}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">{name}</p>
            <p className="text-xs text-[#999999]">{email}</p>
          </div>
        </div>

        <div className="py-2">
          {[
            { label: 'Settings', icon: Settings, path: '/settings' },
            { label: 'Connections', icon: Cable, path: '/connections' },
            { label: 'Roadmap', icon: Map, path: '/roadmap' },
          ].map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => { onClose(); window.location.href = path; }}
              className="w-full px-4 py-2 text-left text-sm text-[#666666] hover:bg-[#F5F5F5] flex items-center space-x-2"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 py-2">
          <button
            onClick={() => {
              localStorage.removeItem('userId');
              window.location.href = '/connections';
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
