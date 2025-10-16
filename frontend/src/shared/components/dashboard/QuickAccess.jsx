import { Folder, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAccess = ({ folders = [] }) => {
  const navigate = useNavigate();

  // Fonction pour assigner une couleur selon le type de fichier
  const getFolderColor = (file) => {
    const mime = file.mimeType?.toLowerCase() || '';
    
    if (mime.includes('pdf') || mime.includes('document')) {
      return 'text-blue-500';
    }
    if (mime.includes('spreadsheet') || mime.includes('excel')) {
      return 'text-green-500';
    }
    if (mime.includes('image')) {
      return 'text-purple-500';
    }
    if (mime.includes('video')) {
      return 'text-red-500';
    }
    if (mime.includes('presentation')) {
      return 'text-orange-500';
    }
    
    // Couleur par défaut
    return 'text-yellow-500';
  };

  // Convertir les fichiers starred en format folders
  const displayFolders = folders.length > 0 
    ? folders.slice(0, 4).map(file => ({
        id: file.id,
        name: file.name,
        color: getFolderColor(file),
        provider: file.provider,
        mimeType: file.mimeType,
      }))
    : [];

  if (displayFolders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Quick Access</h3>
        </div>
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-[#999999] text-sm">No quick access items</p>
          <p className="text-[#999999] text-xs mt-1">
            Add files to quick access for faster access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Quick Access</h3>
        <button 
          onClick={() => navigate('/files?tab=starred')}
          className="text-[#999999] hover:text-[#1A1A1A]"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {displayFolders.map((folder) => (
          <div
            key={folder.id}
            className="p-3 bg-[#FAFAFA] rounded-lg cursor-pointer hover:bg-[#F5F5F5] transition"
            onClick={() => navigate('/files')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Folder className={`w-5 h-5 ${folder.color}`} />
              <span className="text-sm font-medium text-[#1A1A1A] truncate flex-1">
                {folder.name}
              </span>
            </div>
            <p className="text-xs text-[#999999]">
              {folder.provider === 'google_drive' ? 'Google Drive' : 'Dropbox'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;