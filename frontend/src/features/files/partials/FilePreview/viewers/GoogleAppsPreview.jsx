// ============================================
// GoogleAppsPreview.jsx - RESPONSIVE
// ============================================
export default function GoogleAppsPreview({ file, previewData }) {
  const embedUrl = previewData.embedLink || `${previewData.webViewLink}?embedded=true`;

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:h-[500px] bg-gray-50 rounded-lg">
        <p className="text-gray-400 text-sm">Lien de prévisualisation non disponible</p>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className="w-full min-h-[400px] sm:h-[500px] border-0 rounded-lg bg-white"
      title={file.name}
      sandbox="allow-same-origin allow-scripts allow-forms"
    />
  );
}