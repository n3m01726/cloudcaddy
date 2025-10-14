// ============================================
// FilePreview/index.jsx (~80 lignes)
// Composant principal de prévisualisation de fichiers
// Remplace l'ancien FilePreviewModal.jsx de 494 lignes
// ============================================

import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';
import PreviewSidebar from './PreviewSidebar';
import { usePreviewLoader } from './hooks/usePreviewLoader';
import { useMetadataPanel } from './hooks/useMetadataPanel';

/**
 * Modal de prévisualisation de fichiers
 * Gère l'affichage et la navigation dans les fichiers
 * 
 * @param {Object} file - Fichier à prévisualiser
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} metadata - Métadonnées du fichier (tags, description, etc.)
 * @param {Function} onClose - Callback de fermeture
 * @param {Function} onDownload - Callback de téléchargement
 * @param {Function} onShare - Callback de partage
 */
export default function FilePreview({ 
  file, 
  userId, 
  metadata,
  onClose, 
  onDownload, 
  onShare 
}) {
  // Chargement des données de preview via l'API
  const { previewData, loading, error } = usePreviewLoader(file, userId);
  
  // Gestion de l'affichage de la sidebar de métadonnées
  const { showMetadata, toggle, show } = useMetadataPanel(true);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec titre et actions */}
        <PreviewHeader 
          file={file}
          metadata={metadata}
          onDownload={onDownload}
          onShare={onShare}
          onClose={onClose}
        />

        {/* Contenu principal : Preview + Sidebar */}
        <div className="flex overflow-hidden" style={{ height: 'calc(90vh - 120px)' }}>
          {/* Zone de preview */}
          <PreviewContent 
            file={file}
            userId={userId}
            previewData={previewData}
            loading={loading}
            error={error}
            showMetadata={showMetadata}
            onDownload={onDownload}
          />

          {/* Sidebar de métadonnées (conditionnelle) */}
          {showMetadata && (
            <PreviewSidebar 
              file={file}
              metadata={metadata}
              previewData={previewData}
              onClose={toggle}
            />
          )}

          {/* Bouton pour réafficher la sidebar si masquée */}
          {!showMetadata && (
            <button
              onClick={show}
              className="absolute right-4 top-20 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors  cursor-pointer"
              title="Afficher les détails"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Export nommé pour flexibilité
export { FilePreview };