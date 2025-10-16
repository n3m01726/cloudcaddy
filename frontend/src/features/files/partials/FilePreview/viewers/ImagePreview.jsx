
// ============================================
// ImagePreview.jsx - RESPONSIVE
// ============================================
import { useState } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function ImagePreview({ file, userId, previewData }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const imgSrc = `${API_URL}/files/${userId}/thumbnail/${file.provider}/${file.id}`;
  
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:h-[500px] bg-gray-50 rounded-lg p-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 mb-2 font-medium text-sm sm:text-base">Impossible de charger l'image</p>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">L'aperçu n'est pas disponible</p>
        {previewData?.webViewLink && (
          <a
            href={previewData.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir dans le cloud
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-900 rounded-lg p-2 sm:p-4 min-h-[300px] sm:h-[500px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500" />
            <p className="text-white text-xs sm:text-sm">Chargement...</p>
          </div>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={file.name}
        className="max-h-full max-w-full object-contain rounded shadow-lg"
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
      />
    </div>
  );
}
