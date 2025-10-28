export default function PDFPreview({ file, previewData }) {
  const pdfUrl = previewData.previewUrl || 
                 previewData.url ||
                 `https://drive.google.com/file/d/${file.id}/preview`;

  return (
    <iframe
      src={pdfUrl}
      className="w-full min-h-[400px] sm:h-[500px] border-0 rounded-lg"
      title={file.name}
    />
  );
}