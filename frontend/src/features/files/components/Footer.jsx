export default function Footer({ files }) {
  const folderCount = files.filter(f => f.type === 'folder').length;
  const fileCount = files.filter(f => f.type !== 'folder').length;

  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
        {folderCount} dossier{folderCount > 1 ? 's' : ''} • {fileCount} fichier{fileCount > 1 ? 's' : ''}
      </p>
    </div>
  );
}