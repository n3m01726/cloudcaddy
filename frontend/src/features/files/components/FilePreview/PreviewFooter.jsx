// ============================================
// PreviewFooter.jsx (~80 lignes)
// ============================================
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

/**
 * Footer de la modal de preview (optionnel)
 * Affiche la navigation entre fichiers et infos rapides
 */
export default function PreviewFooter({ 
  file,
  currentIndex,
  totalFiles,
  onPrevious,
  onNext,
  showQuickInfo = false
}) {
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < totalFiles - 1;

  return (
    <div className="flex items-center justify-between p-3 border-t bg-gray-50">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`p-2 rounded-lg transition-colors ${
            hasPrevious 
              ? 'hover:bg-gray-200 text-gray-700' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Fichier précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm text-gray-600 min-w-[80px] text-center">
          {currentIndex + 1} / {totalFiles}
        </span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`p-2 rounded-lg transition-colors ${
            hasNext 
              ? 'hover:bg-gray-200 text-gray-700' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Fichier suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Info rapide (optionnel) */}
      {showQuickInfo && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Info className="w-4 h-4" />
            <span>{file.name.split('.').pop().toUpperCase()}</span>
          </div>
          {file.size && (
            <span>
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </span>
          )}
        </div>
      )}

      {/* Placeholder pour équilibrer le layout */}
      {!showQuickInfo && <div className="w-[100px]" />}
    </div>
  );
}