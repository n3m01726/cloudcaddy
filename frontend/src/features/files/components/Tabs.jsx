import { Search, RefreshCw } from 'lucide-react';

export default function Tabs({ activeTab, setActiveTab, toggleSearchBar, showSearchBar, onRefresh }) {
  const tabs = [
    { id: 'allDrives', label: 'Tous les drives', shortLabel: 'Tous', activeColor: 'bg-indigo-100 text-indigo-600' },
    { id: 'google_drive', label: 'Google Drive', shortLabel: 'Drive', activeColor: 'bg-green-400 text-black-100' },
    { id: 'dropbox', label: 'Dropbox', shortLabel: 'Dropbox', activeColor: 'bg-blue-400 text-blue-100' },
  ];

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
      {/* Tabs à gauche - Scroll horizontal sur mobile */}
      <div className="flex gap-1 sm:gap-2 text-sm sm:text-md overflow-x-auto scrollbar-hide flex-shrink min-w-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 sm:px-4 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id 
                ? tab.activeColor
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {/* Label court sur mobile, complet sur desktop */}
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Boutons d'action à droite - Toujours visibles */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          onClick={toggleSearchBar}
          className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-colors ${
            showSearchBar
              ? 'text-white bg-indigo-600 hover:bg-indigo-700'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
          }`}
          title={showSearchBar ? 'Fermer la recherche' : 'Rechercher'}
        >
          {showSearchBar ? '✕' : <Search className="w-4 h-4" />}
        </button>

        <button
          onClick={onRefresh}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}