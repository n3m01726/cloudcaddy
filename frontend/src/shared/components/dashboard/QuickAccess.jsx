import { Folder, MoreHorizontal, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAccess = ({ folders = [] }) => {
  const navigate = useNavigate();

  // Convertir les fichiers starred en format folders
  const displayFolders = folders.length > 0 
    ? folders.slice(0, 4).map(file => ({
        id: file.id,
        name: file.name,
        color: 'text-yellow-500',
        bgColor: 'yellow-100',
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
          <p className="text-[#999999] text-sm">No Quick Access found</p>
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
      </div>

      <div className="space-3">
        {displayFolders.map((folder) => (
                     <div
                       key={folder.id}
                       className="flex items-center justify-between p-3 rounded-lg 
                         hover:bg-[#F9FAFB] transition cursor-pointer"
                     >
                       <div className="flex items-center space-x-3 flex-1 min-w-0">
                         <div className={`w-5 h-5 bg-${folder.bgColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                           <Zap className={`w-5 h-5 ${folder.color}`} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-[#1A1A1A] truncate">
                              {folder.name}
                           </p>
                           <p className="text-xs text-[#999999]">
                              {folder.provider === 'google_drive' ? 'Google Drive' : 'Dropbox'}
                           </p>
                         </div>
                       </div>
                       
                       <div className="flex items-center space-x-4 flex-shrink-0">
                         <span className="text-xs text-[#999999]">
                          
                         </span>
                         <button className="text-[#999999] hover:text-[#1A1A1A]">
                           <MoreHorizontal className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;




