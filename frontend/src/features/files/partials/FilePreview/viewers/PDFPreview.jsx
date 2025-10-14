// ============================================
// viewers/PDFPreview.jsx (~50 lignes)
// ============================================
/**
 * Viewer pour les fichiers PDF
 * Utilise l'iframe de Google Drive
 */
export default function PDFPreview({ file, previewData }) {
  const pdfUrl = previewData.previewUrl || 
                 previewData.url ||
                 `https://drive.google.com/file/d/${file.id}/preview`;

  return (
    <iframe
      src={pdfUrl}
      className="w-full h-[500px] border-0 rounded-lg"
      title={file.name}
    />
  );
}