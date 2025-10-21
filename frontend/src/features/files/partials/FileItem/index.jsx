// frontend/src/components/FileExplorer/partials/FileItem.jsx
import { useState, useEffect } from "react";
import { Folder, File, Download, Image, Music, Film, FileText, RefreshCw, MoreVertical, Star, Tag } from "lucide-react";
import FilePreviewModal from "@features/files/partials/FilePreview/index";
import FileActions from "@features/files/components/FileActions";
import TagManager from "@features/tagManager/components/TagManager";
import TagBadge from "@features/tagManager/components/TagBadge";
import { metadataService } from "@core/services/api";
import { formatDate, formatFileSize } from "@features/files/utils/formatters.js";


const fileIcons = {
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  webp: Image,
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileText,
  xlsx: FileText,
  mp3: Music,
  wav: Music,
  mp4: Film,
  mov: Film,
  default: File,
};

export default function FileItem({ 
  file, 
  userId, 
  onFolderClick, 
  onDownload, 
  downloading, 
  onFileMoved, 
  onFileCopied 
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  const ext = file.name.split('.').pop().toLowerCase();
  const IconComponent = file.type === 'folder' ? Folder : (fileIcons[ext] || fileIcons.default);

  useEffect(() => {
    loadMetadata();
  }, [file.id, file.provider, userId]);

  const loadMetadata = async () => {
    setLoadingMetadata(true);
    try {
      const response = await metadataService.getMetadata(userId, file.id, file.provider);
      
      if (response.success && response.metadata) {
        setMetadata(response.metadata);
      } else {
        setMetadata(null);
      }
    } catch (error) {
      console.error('Erreur chargement métadonnées:', error);
      setMetadata(null);
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleShare = (file) => {
    navigator.clipboard.writeText(file.url || '');
    alert("Lien copié !");
  };

  const handlePrint = (file) => {
    window.open(file.url, "_blank")?.print();
  };

  const handleActionSuccess = (action, result) => {
    if (action === 'move') {
      onFileMoved?.(file, result);
    } else if (action === 'copy') {
      onFileCopied?.(file, result);
    } else if (action === 'delete') {
      // Notifier le parent pour rafraîchir la liste
      onFileMoved?.(); // Réutilise le même callback pour rafraîchir
    }
  };

  const handleCloseTagManager = () => {
    setShowTagManager(false);
    setTimeout(() => loadMetadata(), 100);
  };

  const displayName = metadata?.customName || file.name;
  const tags = metadata?.tags || [];
  const tagColors = metadata?.tagColors || {};
  const starred = metadata?.starred || false;

  return (
    <>
      
        <div
          className={`flex items-center justify-between p-4 border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group ${
            file.type === 'folder' ? 'cursor-pointer' : ''
          } ${starred ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''}`}
          onClick={() => {
            if (file.type === 'folder') onFolderClick(file);
            else setShowPreview(true);
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <IconComponent 
                className={`w-8 h-8 ${
                  file.type === 'folder' ? 'text-blue-500' : 'text-gray-400'
                } flex-shrink-0 transition-transform group-hover:scale-110`} 
              />
              {starred && (
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 absolute -top-1 -right-1" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium truncate">{displayName}</h3>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag) => {
                      const color = tagColors[tag] || 'blue';
                      return (
                        <TagBadge 
                          key={tag} 
                          tag={tag} 
                          size="sm"
                          color={color}
                        />
                      );
                    })}
                    {tags.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-0.5">
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {metadata?.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {metadata.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowTagManager(true); 
              }}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all hover:scale-110"
              title="Gérer les tags"
            >
              <Tag className="w-5 h-5" />
            </button>
            
            {file.type !== 'folder' && (
              <button
                onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                disabled={downloading === file.id}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110 disabled:opacity-100 disabled:hover:scale-100"
                title="Télécharger"
              >
                {downloading === file.id ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            )}
            
            <button
              onClick={(e) => { e.stopPropagation(); setShowActions(true); }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all hover:scale-110"
              title="Plus d'actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
   

      {showPreview && (
        <FilePreviewModal
          file={file}
          userId={userId}
          metadata={metadata}
          onClose={() => setShowPreview(false)}
          onDownload={onDownload}
          onShare={handleShare}
          onPrint={handlePrint}
        />
      )}

      {/* Actions Modal (s'ouvre via right-click OU MoreVertical) */}
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
          onUpdate={(newMetadata) => setMetadata(newMetadata)}
        />
      )}
    </>
  );
}