export default function TextPreview({ previewData }) {
  const content = previewData.content || 'Contenu texte non disponible';

  return (
    <div className="bg-gray-50 rounded-lg min-h-[300px] sm:h-[500px] overflow-auto">
      <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
        {content}
      </pre>
    </div>
  );
}