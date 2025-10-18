import { Folder, MoreHorizontal, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAccess = ({ folders = [] }) => {
  const navigate = useNavigate();

  // Convertir les fichiers starred en format folders
  const displayFolders = folders.length > 0 
    ? folders.slice(0, 4).map(file => ({
        id: file.id,
        name: file.name,
        color: 'text-yellow-500',
        fileCount: 1,
        provider: file.provider,
      }))
    : [];

  if (displayFolders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Quick Access</h3>
        </div>
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-[#999999] text-sm">Aucun favori</p>
          <p className="text-[#999999] text-xs mt-1">
            Ajoutez des fichiers aux favoris pour un accès rapide
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
          onClick={() => navigate('/photos')}
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
              <Star className={`w-5 h-5 ${folder.color} fill-current`} />
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