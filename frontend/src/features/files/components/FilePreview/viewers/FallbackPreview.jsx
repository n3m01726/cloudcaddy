// ============================================
// FallbackPreview.jsx - RESPONSIVE
// ============================================
import { AlertCircle, ExternalLink, Download } from 'lucide-react';

export default function FallbackPreview({ file, previewData, onDownload }) {
  const ext = file.name?.split('.').pop()?.toUpperCase() || 'INCONNU';

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:h-[500px] bg-gray-50 rounded-lg p-4">
      <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3" />
      <p className="text-gray-600 mb-2 font-medium text-sm sm:text-base">Prévisualisation non disponible</p>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">Type de fichier: {ext}</p>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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