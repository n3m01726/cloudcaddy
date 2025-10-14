// ============================================
// viewers/TextPreview.jsx (~50 lignes)
// ============================================
/**
 * Viewer pour les fichiers texte
 * Affiche le contenu dans un pre formaté
 */
export default function TextPreview({ previewData }) {
  const content = previewData.content || 'Contenu texte non disponible';

  return (
    <div className="bg-gray-50 rounded-lg h-[500px] overflow-auto">
      <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
        {content}
      </pre>
    </div>
  );
}