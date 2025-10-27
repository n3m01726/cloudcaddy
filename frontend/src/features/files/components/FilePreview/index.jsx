import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';
import PreviewSidebar from './PreviewSidebar';
import { usePreviewLoader } from './hooks/usePreviewLoader';
import { useMetadataPanel } from './hooks/useMetadataPanel';

/**
 * Modal de prévisualisation de fichiers - VERSION RESPONSIVE
 * Adaptée pour mobile, tablette et desktop
 */
export default function FilePreview({ 
  file, 
  userId, 
  metadata,
  onClose, 
  onDownload, 
  onShare 
}) {
  const { previewData, loading, error } = usePreviewLoader(file, userId);
  const { showMetadata, toggle, show } = useMetadataPanel(true);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
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

        {/* Contenu principal : Preview + Sidebar (flex-1 pour prendre l'espace restant) */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Zone de preview - Pleine largeur sur mobile, 2/3 sur desktop si sidebar ouverte */}
          <div className={`${showMetadata ? 'lg:w-2/3' : 'w-full'} overflow-auto transition-all`}>
            <PreviewContent 
              file={file}
              userId={userId}
              previewData={previewData}
              loading={loading}
              error={error}
              showMetadata={showMetadata}
              onDownload={onDownload}
            />
          </div>

          {/* Sidebar de métadonnées - Cachée sur mobile, visible sur desktop */}
          {showMetadata && (
            <div className="hidden lg:block lg:w-1/3">
              <PreviewSidebar 
                file={file}
                metadata={metadata}
                previewData={previewData}
                onClose={toggle}
              />
            </div>
          )}

          {/* Bouton flottant pour afficher les détails (mobile) */}
          {!showMetadata && (
            <button
              onClick={show}
              className="fixed bottom-6 right-6 lg:absolute lg:right-4 lg:top-20 p-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-colors z-10"
              title="Afficher les détails"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Modal Sidebar pour mobile (en overlay) */}
        {showMetadata && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={toggle}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-auto animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <PreviewSidebar 
                file={file}
                metadata={metadata}
                previewData={previewData}
                onClose={toggle}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}