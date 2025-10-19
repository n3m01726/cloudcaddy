// frontend/src/components/FileExplorer/partials/FileItem.jsx
import { useState, useEffect } from "react";
import { Folder, File, Download, Image, Music, Film, FileText, RefreshCw, MoreVertical, Star, Tag } from "lucide-react";
import FilePreviewModal from "../FilePreview/index";
import FileActions from "../../components/FileActions";
import TagManager from "../../../tagManager/components/TagManager";
import TagBadge from "../../../tagManager/components/TagBadge";
import { metadataService } from "@core/services/api";

// Composant FileTooltip intégré
function FileTooltip({ file, metadata, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  let timeoutId = null;

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMouseEnter = (e) => {
    timeoutId = setTimeout(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      
      let x = rect.left + rect.width / 2 - tooltipWidth / 2;
      let y = rect.top - tooltipHeight - 10;
      
      if (x < 10) x = 10;
      if (x + tooltipWidth > window.innerWidth - 10) {
        x = window.innerWidth - tooltipWidth - 10;
      }
      if (y < 10) {
        y = rect.bottom + 10;
      }
      
      setPosition({ x, y });
      setIsVisible(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const displayName = metadata?.customName || file.name;
  const tags = metadata?.tags || [];
  const starred = metadata?.starred || false;

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-[100] pointer-events-none"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl p-4 w-80 border border-gray-700 animate-in fade-in duration-150">
            <div className="flex items-start gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight break-words">
                  {displayName}
                </h4>
                {metadata?.customName && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    Original: {file.name}
                  </p>
                )}
              </div>
              {starred && (
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              )}
            </div>

            {metadata?.description && (
              <div className="mb-3 pb-3 border-b border-gray-700">
                <p className="text-xs text-gray-300 line-clamp-2">
                  {metadata.description}
                </p>
              </div>
            )}

            <div className="space-y-2 text-xs">
              {file.size && (
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-gray-400">💾</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              )}

              {file.modifiedTime && (
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-gray-400">📅</span>
                  <span>{formatDate(file.modifiedTime)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <span className="capitalize">{file.provider?.replace('_', ' ')}</span>
              </div>

              {tags.length > 0 && (
                <div className="flex items-start gap-2 text-gray-300">
                  <span className="text-gray-400">🏷️</span>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, idx) => {
                      const color = metadata?.tagColors?.[tag] || 'blue';
                      const colorClasses = {
                        blue: 'bg-blue-500/20 text-blue-300',
                        green: 'bg-green-500/20 text-green-300',
                        red: 'bg-red-500/20 text-red-300',
                        yellow: 'bg-yellow-500/20 text-yellow-300',
                        purple: 'bg-purple-500/20 text-purple-300',
                        pink: 'bg-pink-500/20 text-pink-300',
                        indigo: 'bg-indigo-500/20 text-indigo-300',
                        gray: 'bg-gray-500/20 text-gray-300'
                      };
                      
                      return (
                        <span 
                          key={idx} 
                          className={`px-2 py-0.5 rounded text-xs ${colorClasses[color] || colorClasses.blue}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
      <FileTooltip file={file} metadata={metadata}>
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
      </FileTooltip>

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

      {showActions && (
        <FileActions
          file={file}
          userId={userId}
          isOpen={showActions}
          onClose={() => setShowActions(false)}
          onSuccess={handleActionSuccess}
          onError={(error) => alert(`Erreur: ${error}`)}
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