// ============================================
// PreviewHeader.jsx (~70 lignes)
// ============================================
import { X, Download, Share2, Maximize, Star } from 'lucide-react';

/**
 * Header de la modal de preview
 * Affiche le nom, description, et actions du fichier
 */
export default function PreviewHeader({ 
  file, 
  metadata, 
  onDownload, 
  onShare, 
  onClose 
}) {
  const displayName = metadata?.customName || file.name;
  const starred = metadata?.starred || false;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
      {/* Titre et description */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate flex items-center gap-2">
            {displayName}
            {starred && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </h3>
          {metadata?.description && (
            <p className="text-sm text-gray-600 truncate mt-0.5">
              {metadata.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onDownload(file)} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          title="Télécharger"
        >
          <Download className="w-5 h-5 text-gray-700" />
        </button>
        
        <button 
          onClick={() => onShare(file)} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          title="Partager"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>

        <button 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          title="Agrandir"
        >
          <Maximize className="w-5 h-5 text-gray-700" />
        </button>

        {/* Séparateur */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}