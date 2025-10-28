export default function AudioPreview({ file, previewData }) {
  const audioUrl = previewData.previewUrl || 
                   previewData.url || 
                   previewData.webContentLink ||
                   `https://drive.google.com/uc?export=download&id=${file.id}`;
  
  const mimeType = previewData.mimeType || file.mimeType || 'audio/mpeg';

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg min-h-[300px] sm:h-[500px] p-4">
      <div className="text-white mb-6 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>
        <p className="font-medium text-sm sm:text-base px-4 truncate">{file.name}</p>
      </div>
      <audio 
        controls 
        className="w-full max-w-md"
        preload="metadata"
      >
        <source src={audioUrl} type={mimeType} />
        Votre navigateur ne supporte pas l'audio.
      </audio>
    </div>
  );
}