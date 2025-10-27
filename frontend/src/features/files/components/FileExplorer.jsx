// frontend/src/features/files/components/FileExplorer.jsx (UPDATED)
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tabs from './Tabs';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import Files from './Files';
import Footer from './Footer';
import { loadFiles } from '../utils/loadFiles';
import { filesService } from '@core/services/api';

export default function FileExplorer({ userId, filter }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [downloading, setDownloading] = useState(null);
  
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

  // 🆕 Gérer les paramètres URL au montage (favoris + quick search)
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    const providerFromUrl = searchParams.get('provider');
    const folderIdFromUrl = searchParams.get('folderId');
    const folderNameFromUrl = searchParams.get('folderName');

    // Quick Search depuis Sidebar
    if (queryFromUrl) {
      console.log('🔍 Quick search from Sidebar:', queryFromUrl);
      setSearchQuery(queryFromUrl);
      setSearchBarVisible(true);
      handleSearchFromUrl(queryFromUrl);
      // Clear les params après traitement
      setSearchParams({});
      return;
    }

    // Navigation depuis Favorites
    if (providerFromUrl && folderIdFromUrl) {
      console.log('⭐ Favorite navigation:', { providerFromUrl, folderIdFromUrl, folderNameFromUrl });
      setActiveTab(providerFromUrl);
      handleLoadFiles(folderIdFromUrl, folderNameFromUrl || '', providerFromUrl);
      // Clear les params après traitement
      setSearchParams({});
      return;
    }

    // Chargement normal
    handleLoadFiles();
  }, [userId, searchParams, handleLoadFiles, setSearchParams]);

  useEffect(() => {
    if (filter && filter !== activeTab) {
      setActiveTab(filter);
    }
  }, [filter, activeTab]);

  // 🆕 Handler pour Quick Search depuis URL
  const handleSearchFromUrl = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    try {
      const response = await filesService.searchFiles(userId, query);
      const filesList = response.files || [];
      setFiles(filesList);
      console.log('✅ Quick search results:', filesList.length, 'files');
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

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
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

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

  const handleRefresh = () => {
    if (activeTab === 'favorites') return;
    const currentProvider = activeTab === 'all' ? 'google_drive' : activeTab;
    const currentState = providerStates[currentProvider];
    handleLoadFiles(currentState?.currentFolder || null, currentState?.currentFolderName || '', currentProvider);
  };

  const handleTabChange = newTab => {
    setActiveTab(newTab);
    if (newTab === 'favorites') return;
    const providerState = providerStates[newTab] || { currentFolder: null, currentFolderName: '' };
    handleLoadFiles(providerState.currentFolder, providerState.currentFolderName, newTab);
  };

  const handleBreadcrumbClick = index => {
    if (activeTab === 'allDrives') return;
    const currentProvider = activeTab === 'allDrives' ? 'google_drive' : activeTab;
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

  console.log('📊 FileExplorer Debug:', { 
    filesCount: files.length, 
    metadataCount: metadata.length,
    filteredFilesCount: filteredFiles.length,
    sampleMetadata: metadata.slice(0, 2)
  });

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