// frontend/src/features/files/components/FileExplorer.jsx
import { useState, useEffect, useCallback } from 'react';
import Tabs from './Tabs';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import Files from './Files';
import Footer from './Footer';
import { loadFiles } from '../utils/loadFiles';
import { loadMetadataForFiles } from '../utils/loadMetadataForFiles';
import { filesService } from '../../../core/services/api';

export default function FileExplorer({ userId }) {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [activeTab, setActiveTab] = useState('google_drive');
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
    const currentProvider = activeTab;
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
      const providerState = providerStates[activeTab];
      handleLoadFiles(providerState.currentFolder, providerState.currentFolderName, activeTab);
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const response = await filesService.searchFiles(userId, searchQuery);
      const filesList = response.files || [];
      setFiles(filesList);
      await loadMetadataForFiles(filesList);
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
    const currentState = providerStates[activeTab];
    handleLoadFiles(currentState?.currentFolder || null, currentState?.currentFolderName || '', activeTab);
  };

  // Gestion des onglets
  const handleTabChange = newTab => {
    setActiveTab(newTab);
    if (newTab === 'favorites') return;
    const providerState = providerStates[newTab];
    handleLoadFiles(providerState.currentFolder, providerState.currentFolderName, newTab);
  };

  // Breadcrumb pour navigation
  const handleBreadcrumbClick = index => {
    if (activeTab === 'favorites') return;
    const currentState = providerStates[activeTab];
    const targetFolder = currentState.folderHistory[index];
    const newHistory = currentState.folderHistory.slice(0, index);
    setProviderStates(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], folderHistory: newHistory }
    }));
    handleLoadFiles(targetFolder.id === 'root' ? null : targetFolder.id, targetFolder.name, activeTab);
  };

  const currentProviderState = activeTab === 'favorites' ? null : providerStates[activeTab];
  const filteredFiles = activeTab === 'favorites' ? [] : activeTab === 'all' ? files : files.filter(f => f.provider === activeTab);

  // Rendu avec classes responsive
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
          <div className="m-3 sm:m-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-sm sm:text-base">{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700 self-end sm:self-auto"
            >
              ✕
            </button>
          </div>
        )}

        {/* Onglet Favoris */}
        {activeTab === 'favorites' ? (
          <div className="p-3 sm:p-6">
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
              const currentState = providerStates[activeTab];
              handleLoadFiles(
                currentState?.currentFolder || null,
                currentState?.currentFolderName || '',
                activeTab
              );
            }}
            onFileCopied={() => {
              const currentState = providerStates[activeTab];
              handleLoadFiles(
                currentState?.currentFolder || null,
                currentState?.currentFolderName || '',
                activeTab
              );
            }}
          />
        )}

        {filteredFiles.length > 0 && <Footer files={filteredFiles} />}
      </div>
    </div>
  );
}