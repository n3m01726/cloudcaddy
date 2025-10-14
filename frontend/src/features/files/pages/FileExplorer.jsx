// Nouveau import
import FilePreview from '../components/FileExplorer/FileExplorer'

// Utilisation (identique)
<FilePreview 
  file={selectedFile}
  userId={userId}
  metadata={metadata}
  onClose={() => setShowPreview(false)}
  onDownload={handleDownload}
  onShare={handleShare}
/>