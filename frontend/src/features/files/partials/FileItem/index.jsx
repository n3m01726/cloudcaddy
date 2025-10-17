// frontend/src/features/files/components/FileItem.jsx
import { useState, useEffect, useRef } from "react";
import { Folder, File, Download, Image, Music, Film, FileText, RefreshCw, MoreVertical, Tag as TagIcon } from "lucide-react";
import FilePreviewModal from "@features/files/partials/FilePreview";
import FileActions from "@features/files/components/FileActions";
import TagManager from "@features/tagManager/components/TagManager";
import TagBadge from "@features/tagManager/components/TagBadge";
import { metadataService } from "@core/services/api";
import { formatFileSize } from "@features/files/utils/formatFileSize";

const fileIcons = {
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileText,
  xlsx: FileText,
  mp3: Music,
  mp4: Film,
  default: File,
};

export default function FileItem({ 
  file, 
  metadata: metadataFromProps, // ← Renommer la prop pour éviter conflit
  userId, 
  onFolderClick, 
  onDownload, 
  downloading, 
  onFileMoved, 
  onFileCopied 
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
  const [showTagManager, setShowTagManager] = useState(false);
  const [metadata, setMetadata] = useState(metadataFromProps || null); // ← Initialiser avec props
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  
  const isLoadingRef = useRef(false);

  const ext = file.name.split('.').pop().toLowerCase();
  const IconComponent = file.type === 'folder' ? Folder : (fileIcons[ext] || fileIcons.default);

  // ✅ Synchroniser avec les props si elles changent
  useEffect(() => {
    if (metadataFromProps) {
      setMetadata(metadataFromProps);
    }
  }, [metadataFromProps]);

  // ✅ Charger les métadonnées seulement si pas déjà fournies
  useEffect(() => {
    if (!metadataFromProps) {
      loadMetadata();
    }
  }, [file.id, file.provider, userId, metadataFromProps]);

  const loadMetadata = async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoadingMetadata(true);
    
    try {
      const response = await metadataService.getMetadata(
        userId,
        file.id,
        file.provider
      );
      
      if (response.success && response.metadata) {
        setMetadata(response.metadata);
      } else {
        setMetadata(null);
      }
    } catch (error) {
      console.error('❌ Erreur chargement métadonnées:', error);
      setMetadata(null);
    } finally {
      setLoadingMetadata(false);
      isLoadingRef.current = false;
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const x = e.clientX;
    const y = e.clientY;
    
    const menuWidth = 200;
    const menuHeight = 200;
    const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
    const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
    
    setActionPosition({ top: adjustedY, left: adjustedX });
    setShowActions(true);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left;
    const y = rect.bottom + 5;
    
    const menuWidth = 200;
    const menuHeight = 200;
    const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth + rect.width : x;
    const adjustedY = y + menuHeight > window.innerHeight ? rect.top - menuHeight - 5 : y;
    
    setActionPosition({ top: adjustedY, left: adjustedX });
    setShowActions(true);
  };

  const handleActionSuccess = (action, result) => {
    if (action === 'move') {
      onFileMoved?.(file, result);
    } else if (action === 'copy') {
      onFileCopied?.(file, result);
    } else if (action === 'delete') {
      onFileMoved?.();
    }
  };

  const handleActionError = (error) => {
    alert(`Erreur: ${error}`);
  };

  const handleMetadataUpdate = (newMetadata) => {
    setMetadata(newMetadata);
  };

  const handleCloseTagManager = async () => {
    setShowTagManager(false);
    await new Promise(resolve => setTimeout(resolve, 300));
    await loadMetadata();
    onFileMoved?.();
  };

  const displayName = metadata?.customName || file.name;
  const tags = metadata?.tags || [];
  const tagColors = metadata?.tagColors || {};
  const starred = metadata?.starred || false;

  return (
    <>
      <div
        className={`flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group ${
          file.type === 'folder' ? 'cursor-pointer' : ''
        } ${starred ? 'ring-2 ring-yellow-200 bg-yellow-50 border-yellow-200 hover:bg-yellow-50 hover:ring-yellow-300 hover:border-yellow-100' : ''}`}
        onClick={() => {
          if (file.type === 'folder') onFolderClick(file);
          else setShowPreview(true);
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Section principale : Icône + Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <IconComponent 
            className={`w-7 h-7 sm:w-8 sm:h-8 ${file.type === 'folder' ? 'text-blue-500' : 'text-gray-400'} flex-shrink-0`} 
          />
          
          <div className="flex-1 min-w-0">
            {/* Nom + Tags + Loading */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm sm:text-base truncate">{displayName}</h3>
              
              {loadingMetadata && (
                <RefreshCw className="w-3 h-3 text-gray-400 animate-spin flex-shrink-0" />
              )}
                  {/* Tags - Masqués sur très petit écran, visibles sur mobile moyen+ */}
            {tags.length > 0 && (
              <div className="hidden xs:flex flex-wrap gap-1 mb-2"> 
                {tags.slice(0, 2).map((tag) => (
                  <TagBadge 
                    key={tag} 
                    tag={tag} 
                    size="sm"
                    color={tagColors[tag] || 'blue'}
                  />
                ))}
                {tags.length > 2 && (
                  <span className="text-xs text-gray-500 px-1.5 py-0.5">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            )}
            </div>
            
            {/* Infos : Taille + Date */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              {file.type !== 'folder' && file.size && (
                <>
                  <span className="font-medium">{formatFileSize(file.size)}</span>
                  <span>•</span>
                </>
              )}
              <span>Modifié le : {new Date(file.modifiedTime).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}</span>
            </div>

            {/* Description - Desktop uniquement - BLOC SÉPARÉ */}
            {metadata?.description && (
              <p className="hidden md:block text-sm text-gray-600 mt-1 line-clamp-1">
                {metadata.description}
              </p>
            )}
          </div>
        </div>

        {/* Boutons d'action - Toujours visibles sur mobile, hover sur desktop */}
        <div className="flex items-center gap-1 sm:gap-2 ml-3 sm:ml-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
          {/* Bouton Tags */}
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              setShowTagManager(true); 
            }}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            title="Gérer les tags"
          >
            <TagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Bouton Download */}
          {file.type !== 'folder' && (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                onDownload(file); 
              }}
              disabled={downloading === file.id}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-100"
              title="Télécharger"
            >
              {downloading === file.id ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          )}
          
          {/* Bouton Actions */}
          <button
            onClick={handleMoreClick}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Plus d'actions"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {showPreview && (
        <FilePreviewModal
          file={file}
          userId={userId}
          onClose={() => setShowPreview(false)}
          onDownload={onDownload}
        />
      )}

      {showActions && (
        <FileActions
          file={file}
          userId={userId}
          isOpen={showActions}
          position={actionPosition}
          onClose={() => setShowActions(false)}
          onSuccess={handleActionSuccess}
          onError={handleActionError}
          onOpenInfo={() => {
            setShowActions(false);
            setShowTagManager(true);
          }}
        />
      )}

      {showTagManager && (
        <TagManager
          file={file}
          userId={userId}
          isOpen={showTagManager}
          onClose={handleCloseTagManager}
          onUpdate={handleMetadataUpdate}
        />
      )}
    </>
  );
}