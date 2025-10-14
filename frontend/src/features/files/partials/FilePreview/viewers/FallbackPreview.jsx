// ============================================
// viewers/FallbackPreview.jsx (~60 lignes)
// ============================================
import { AlertCircle, ExternalLink, Download } from 'lucide-react';

/**
 * Viewer de fallback pour types non supportés
 * Affiche un message et des boutons d'action
 */
export default function FallbackPreview({ file, previewData, onDownload }) {
  const ext = file.name?.split('.').pop()?.toUpperCase() || 'INCONNU';

  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-lg">
      <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
      <p className="text-gray-600 mb-2 font-medium">Prévisualisation non disponible</p>
      <p className="text-sm text-gray-500 mb-4">Type de fichier: {ext}</p>
      
      <div className="flex gap-2">
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
        <button 
          onClick={() => onDownload(file)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </button>
      </div>
    </div>
  );
}