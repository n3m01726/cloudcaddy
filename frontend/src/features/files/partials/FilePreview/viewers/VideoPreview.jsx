// ============================================
// viewers/VideoPreview.jsx (~70 lignes)
// ============================================
/**
 * Viewer pour les vidéos
 * Supporte MP4, WebM, MOV, AVI, MKV
 */
export default function VideoPreview({ file, previewData }) {
  const videoUrl = previewData.previewUrl || 
                   previewData.url || 
                   previewData.webContentLink ||
                   `https://drive.google.com/uc?export=download&id=${file.id}`;
  
  const mimeType = previewData.mimeType || file.mimeType || 'video/mp4';

  return (
    <div className="flex items-center justify-center bg-black rounded-lg h-[500px]">
      <video 
        controls 
        className="max-h-full max-w-full rounded"
        preload="metadata"
      >
        <source src={videoUrl} type={mimeType} />
        Votre navigateur ne supporte pas la vidéo.
      </video>
    </div>
  );
}