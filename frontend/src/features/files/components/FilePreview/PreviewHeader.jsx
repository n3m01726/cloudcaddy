import { X, Download, Share2, Maximize, Star, MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * Header de la modal de preview - RESPONSIVE
 * Actions regroupées dans un menu sur mobile
 */
export default function PreviewHeader({ 
  file, 
  metadata, 
  onDownload, 
  onShare, 
  onClose 
}) {
  const [showActions, setShowActions] = useState(false);
  const displayName = metadata?.customName || file.name;
  const starred = metadata?.starred || false;

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50 flex-shrink-0">
      {/* Titre et description */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-lg truncate flex items-center gap-2">
            <span className="truncate">{displayName}</span>
            {starred && (
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </h3>
          {metadata?.description && (
            <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5 hidden sm:block">
              {metadata.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions - Desktop (tous les boutons visibles) */}
      <div className="hidden sm:flex items-center gap-1">
        <button 
          onClick={() => onDownload(file)} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Télécharger"
        >
          <Download className="w-5 h-5 text-gray-700" />
        </button>
        
        <button 
          onClick={() => onShare?.(file)} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Partager"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>

        <button 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Agrandir"
        >
          <Maximize className="w-5 h-5 text-gray-700" />
        </button>

        {/* Séparateur */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Actions - Mobile (menu déroulant) */}
      <div className="sm:hidden flex items-center gap-1 relative">
        <button 
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Actions"
        >
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>

        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Menu déroulant mobile */}
        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowActions(false)}
            />
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] z-50">
              <button 
                onClick={() => {
                  onDownload(file);
                  setShowActions(false);
                }} 
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-gray-700" />
                <span className="text-sm">Télécharger</span>
              </button>
              
              <button 
                onClick={() => {
                  onShare?.(file);
                  setShowActions(false);
                }} 
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Share2 className="w-4 h-4 text-gray-700" />
                <span className="text-sm">Partager</span>
              </button>

              <button 
                onClick={() => setShowActions(false)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Maximize className="w-4 h-4 text-gray-700" />
                <span className="text-sm">Agrandir</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}