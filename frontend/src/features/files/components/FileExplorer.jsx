// frontend/src/features/files/components/FileExplorer.jsx
import { useState, useEffect, useCallback } from 'react';
import Tabs from './Tabs';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import Files from './Files';
import Footer from './Footer';
import { loadFiles } from '../utils/loadFiles';
import { filesService } from '@core/services/api';

export default function FileExplorer({ userId, filter }) {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [downloading, setDownloading] = useState(null);
  
  // Gérer le filtre depuis les props (pour /photos, /shared, etc.)
  const [activeTab, setActiveTab] = useState(filter || 'all');
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const [providerStates, setProviderStates] = useState({
    google_drive: { currentFolder: null, currentFolderName: '', folderHistory: [] },
    dropbox: { currentFolder: null, currentFolderName: '', folderHistory: [] }
  });

  const handleLoadFiles = useCallback((folderId = null, folderName = '', provider = null) => {
    loadFiles(
      folderId,
      folderName,
      provider,
      userId,
      setFiles,
      setMetadata,
      setProviderStates,
      setLoading,
      setError,
      setSearchQuery
    );
  }, [userId]);

  useEffect(() => {
    handleLoadFiles();
  }, [userId, activeTab, handleLoadFiles]);

  // Mettre à jour activeTab si le filtre change
  useEffect(() => {
    if (filter && filter !== activeTab) {
      setActiveTab(filter);
    }
  }, [filter, activeTab]);

  // Navigation dans les dossiers
  const handleFolderClick = folder => {
    const provider = folder.provider;
    setProviderStates(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        folderHistory: [
          ...prev[provider].folderHistory,
          {
            id: prev[provider].currentFolder || 'root',
            name: prev[provider].currentFolderName || ''
          }
        ]
      }
    }));
    handleLoadFiles(folder.id, folder.name, provider);
  };

  const handleBackClick = () => {
    if (activeTab === 'favorites') return;
    const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
    const currentState = providerStates[currentProvider];
    if (!currentState.folderHistory.length) return;

    const history = [...currentState.folderHistory];
    const previousFolder = history.pop();
    setProviderStates(prev => ({
      ...prev,
      [currentProvider]: { ...prev[currentProvider], folderHistory: history }
    }));
    handleLoadFiles(previousFolder.id === 'root' ? null : previousFolder.id, previousFolder.name, currentProvider);
  };

  const handleHomeClick = () => {
    if (activeTab === 'favorites') return;
    if (activeTab === 'all') {
      setProviderStates({
        google_drive: { currentFolder: null, currentFolderName: '', folderHistory: [] },
        dropbox: { currentFolder: null, currentFolderName: '', folderHistory: [] }
      });
      handleLoadFiles();
    } else {
      setProviderStates(prev => ({
        ...prev,
        [activeTab]: { currentFolder: null, currentFolderName: '', folderHistory: [] }
      }));
      handleLoadFiles(null, '', activeTab);
    }
  };

  // Recherche
  const handleSearch = async e => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      if (activeTab === 'favorites') return;
      const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
      const providerState = providerStates[currentProvider];
      handleLoadFiles(providerState.currentFolder, providerState.currentFolderName, currentProvider);
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const response = await filesService.searchFiles(userId, searchQuery);
      const filesList = response.files || [];
      setFiles(filesList);
      await loadMetadataForFiles(filesList, userId, setMetadata);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Téléchargement
  const handleDownload = async file => {
    setDownloading(file.id);
    try {
      await filesService.downloadFile(userId, file.provider, file.id, file.name);
    } catch (err) {
      setError(`Erreur lors du téléchargement de ${file.name}`);
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  // Rafraîchir les fichiers
  const handleRefresh = () => {
    if (activeTab === 'favorites') return;
    const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
    const currentState = providerStates[currentProvider];
    handleLoadFiles(currentState?.currentFolder || null, currentState?.currentFolderName || '', currentProvider);
  };

  // Gestion des onglets
  const handleTabChange = newTab => {
    setActiveTab(newTab);
    if (newTab === 'favorites') return;
    const providerState = providerStates[newTab] || { currentFolder: null, currentFolderName: '' };
    handleLoadFiles(providerState.currentFolder, providerState.currentFolderName, newTab);
  };

  // Breadcrumb pour navigation
  const handleBreadcrumbClick = index => {
    if (activeTab === 'favorites') return;
    const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
    const currentState = providerStates[currentProvider];
    const targetFolder = currentState.folderHistory[index];
    const newHistory = currentState.folderHistory.slice(0, index);
    setProviderStates(prev => ({
      ...prev,
      [currentProvider]: { ...prev[currentProvider], folderHistory: newHistory }
    }));
    handleLoadFiles(targetFolder.id === 'root' ? null : targetFolder.id, targetFolder.name, currentProvider);
  };

  const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
  const currentProviderState = activeTab === 'favorites' ? null : providerStates[currentProvider];
  const filteredFiles = activeTab === 'favorites' 
    ? [] 
    : activeTab === 'all' 
      ? files 
      : files.filter(f => f.provider === activeTab);

  // Rendu SANS les wrappers max-w et padding (MainLayout s'en occupe)
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <Tabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          toggleSearchBar={() => setSearchBarVisible(!searchBarVisible)}
          showSearchBar={searchBarVisible}
          onRefresh={handleRefresh}
        />

        <Navigation
          folderHistory={currentProviderState?.folderHistory || []}
          currentFolderName={currentProviderState?.currentFolderName || ''}
          onBack={handleBackClick}
          onHome={handleHomeClick}
          toggleSearchBar={() => setSearchBarVisible(!searchBarVisible)}
          showSearchBar={searchBarVisible}
          onBreadcrumbClick={handleBreadcrumbClick}
        />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearchBar={searchBarVisible}
          toggleSearchBar={() => setSearchBarVisible(!searchBarVisible)}
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Onglet Favoris */}
        {activeTab === 'favorites' ? (
          <div className="p-6">
            <p className="text-center text-gray-500">Favoris - À venir</p>
          </div>
        ) : (
          <Files
            files={filteredFiles}
            metadata={metadata}
            loading={loading}
            userId={userId}
            onFolderClick={handleFolderClick}
            onDownload={handleDownload}
            downloading={downloading}
            onFileMoved={() => {
              const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
              const currentState = providerStates[currentProvider];
              handleLoadFiles(
                currentState?.currentFolder || null,
                currentState?.currentFolderName || '',
                currentProvider
              );
            }}
            onFileCopied={() => {
              const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
              const currentState = providerStates[currentProvider];
              handleLoadFiles(
                currentState?.currentFolder || null,
                currentState?.currentFolderName || '',
                currentProvider
              );
            }}
          />
        )}

        {filteredFiles.length > 0 && <Footer files={filteredFiles} />}
      </div>
    </div>
  );
}