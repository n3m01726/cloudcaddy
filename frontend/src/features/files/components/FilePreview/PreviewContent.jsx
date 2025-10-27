import { Loader2, AlertCircle, ExternalLink, Download } from 'lucide-react';
import { 
  GoogleAppsPreview,
  ImagePreview,
  VideoPreview,
  AudioPreview,
  PDFPreview,
  TextPreview,
  FallbackPreview 
} from './viewers';
import { detectFileType } from './utils/fileTypeDetector';

/**
 * Composant qui gère l'affichage du contenu de preview - RESPONSIVE
 */
export default function PreviewContent({ 
  file, 
  userId,
  previewData, 
  loading, 
  error,
  showMetadata,
  onDownload 
}) {
  // État de chargement
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:h-[500px] bg-gray-50 rounded-lg p-4">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-500 mb-3" />
        <span className="text-gray-600 font-medium text-sm sm:text-base">Chargement...</span>
      </div>
    );
  }

  // État d'erreur
  if (error || !previewData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:h-[500px] bg-gray-50 rounded-lg p-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 mb-2 font-medium text-sm sm:text-base text-center">
          {error || 'Prévisualisation non disponible'}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 text-center px-4">
          Le fichier ne peut pas être prévisualisé dans le navigateur
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto px-4">
          {previewData?.webViewLink && (
            <a 
              href={previewData.webViewLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir dans le cloud
            </a>
          )}
          <button 
            onClick={() => onDownload(file)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>
      </div>
    );
  }

  // Détection du type de fichier
  const fileType = detectFileType(file, previewData.mimeType);

  // Mapping des viewers
  const viewers = {
    'google-apps': GoogleAppsPreview,
    'image': ImagePreview,
    'video': VideoPreview,
    'audio': AudioPreview,
    'pdf': PDFPreview,
    'text': TextPreview,
    'fallback': FallbackPreview
  };

  const ViewerComponent = viewers[fileType] || FallbackPreview;

  // Props communes à tous les viewers
  const viewerProps = {
    file,
    userId,
    previewData,
    onDownload
  };

  return (
    <div className="w-full p-2 sm:p-4 overflow-auto">
      <ViewerComponent {...viewerProps} />
    </div>
  );
}