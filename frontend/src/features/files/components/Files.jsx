// frontend/src/features/files/components/Files.jsx (ADAPTED VERSION)
import { useState, useMemo } from 'react';
import FileItem from '@features/files/partials/FileItem';
import { RefreshCw, File, ChevronDown } from 'lucide-react';
import { SelectionProvider, useSelection } from '@features/files/context/SelectionContext'; // 🆕 NEW
import BulkActionsToolbar from './BulkActionsToolbar'; // 🆕 NEW
import CreateFolderModal from './CreateFolderModal'; // 🆕 NEW

const FILES_PER_PAGE = 10;

// 🆕 Inner component that uses selection context
const FilesContent = ({ 
  files, 
  loading, 
  userId, 
  onFolderClick, 
  onDownload, 
  downloading, 
  onFileMoved, 
  onFileCopied 
}) => {
  const [displayCount, setDisplayCount] = useState(FILES_PER_PAGE);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🆕 NEW

  // 🆕 Selection hooks
  const { getSelectedFileObjects, clearSelection } = useSelection();

  // Fichiers à afficher basés sur le compteur
  const displayedFiles = useMemo(() => {
    return files.slice(0, displayCount);
  }, [files, displayCount]);

  const hasMore = displayCount < files.length;
  const remainingCount = files.length - displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + FILES_PER_PAGE, files.length));
  };

  // Réinitialiser le compteur quand la liste de fichiers change
  useMemo(() => {
    setDisplayCount(FILES_PER_PAGE);
  }, [files]);

  // 🆕 Handle create folder modal
  const handleOpenModal = (selectedFiles) => {
    setIsModalOpen(true);
  };

  // 🆕 Handle create folder confirmation
  const handleCreateFolder = async (data) => {
    console.log('Creating folder with data:', data);
    // TODO: API call to create folder and move files
    // This will be implemented in Phase 2
    
    // For now, just log and close
    alert(`Dossier "${data.folderName}" créé dans ${data.provider === 'google' ? 'Google Drive' : 'Dropbox'} avec ${data.files.length} fichiers!`);
    
    // Refresh the file list if you have a refresh function
    onFileMoved?.();
    
    // Clear selection
    clearSelection();
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 border-b border-gray-200">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
        Chargement des fichiers...
      </div>
    );
  }

  if (!files.length) {
    return (
      <div className="text-center py-12 text-gray-500 border-b border-gray-200">
        <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Aucun fichier trouvé</p>
      </div>
    );
  }

  // 🆕 Get selected file objects (only from displayed files for consistency)
  const selectedFiles = getSelectedFileObjects(displayedFiles);

  return (
    <>
      <div className="border-b border-gray-200">
        <div className="p-6 space-y-2">
          {displayedFiles.map(file => (
            <FileItem
              key={`${file.provider}-${file.id}`}
              file={file}
              userId={userId}
              onFolderClick={onFolderClick}
              onDownload={onDownload}
              downloading={downloading}
              onFileMoved={onFileMoved}
              onFileCopied={onFileCopied}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex flex-col items-center py-6 px-6 bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">
              Affichage de {displayedFiles.length} sur {files.length} fichiers
              <span className="text-gray-400 ml-1">
                ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
              </span>
            </p>
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-700 font-medium shadow-sm"
            >
              <ChevronDown className="w-4 h-4" />
              Charger plus de fichiers
            </button>
          </div>
        )}
      </div>

      {/* 🆕 Bulk Actions Toolbar - appears when files are selected */}
      <BulkActionsToolbar 
        files={displayedFiles} 
        onCreateFolder={handleOpenModal}
      />

      {/* 🆕 Create Folder Modal */}
      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedFiles={selectedFiles}
        onConfirm={handleCreateFolder}
      />
    </>
  );
};

// 🆕 Main component with SelectionProvider wrapper
export default function Files(props) {
  return (
    <SelectionProvider>
      <FilesContent {...props} />
    </SelectionProvider>
  );
}