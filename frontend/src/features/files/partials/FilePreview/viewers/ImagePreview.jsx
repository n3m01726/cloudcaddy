// ============================================
// viewers/ImagePreview.jsx
// ============================================
import { useState } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

/**
 * Viewer pour les images utilisant le proxy backend
 * Contourne les problèmes CORS en chargeant via le serveur
 */
export default function ImagePreview({ file, userId, previewData }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // ✅ Utiliser DIRECTEMENT le proxy backend
  const imgSrc = `${API_URL}/files/${userId}/thumbnail/${file.provider}/${file.id}`;
  
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    console.error('❌ Impossible de charger l\'image via le proxy');
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    console.log('✅ Image chargée via proxy backend');
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-lg">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 mb-2 font-medium">Impossible de charger l'image</p>
        <p className="text-sm text-gray-500 mb-4">L'aperçu n'est pas disponible</p>
        {previewData?.webViewLink && (
          <a
            href={previewData.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir dans Google Drive
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-900 rounded-lg p-4 h-[500px] relative">
      {/* Spinner de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <p className="text-white text-sm">Chargement de l'image...</p>
          </div>
        </div>
      )}
      
      {/* Image */}
      <img
        src={imgSrc}
        alt={file.name}
        className="max-h-full max-w-full object-contain rounded shadow-lg"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
      />
    </div>
  );
}