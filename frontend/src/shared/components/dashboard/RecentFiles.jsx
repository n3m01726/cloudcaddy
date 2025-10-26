import { Folder, FileText, FileSpreadsheet, Image as ImageIcon, FileCode, MoreHorizontal } from 'lucide-react';
import { formatDate, formatFileSize } from "@shared/utils//formatters.js";

const RecentFiles = ({ files = [], onViewAll }) => {
  
  if (files.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Files</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-[#999999]">Aucun fichier récent</p>
          <button
            onClick={onViewAll}
            className="mt-4 text-sm text-[#3B82F6] hover:underline"
          >
            Explorer vos fichiers
          </button>
        </div>
      </div>
    );
  }

  const getFileIcon = (mimeType) => {
    const mime = mimeType?.toLowerCase() || '';
    
    if (mime.includes('pdf')) {
      return { Icon: FileText, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
    }
    if (mime.includes('spreadsheet') || mime.includes('excel')) {
      return { Icon: FileSpreadsheet, bgColor: 'bg-green-100', iconColor: 'text-green-600' };
    }
    if (mime.includes('image')) {
      return { Icon: ImageIcon, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' };
    }
    if (mime.includes('presentation') || mime.includes('powerpoint')) {
      return { Icon: FileCode, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' };
    }
    return { Icon: Folder, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  const getProviderIcon = (provider) => {
    if (provider === 'google_drive') return '🔵';
    if (provider === 'dropbox') return '🔷';
    return '📁';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Files</h3>
        <button
          onClick={onViewAll}
          className="text-sm underline underline-offset-4 text-blue-500 hover:text-blue-600"
        >
          View All
        </button>
      </div>

      <div className="space-y-1">
        {files.map((file) => {
          const { Icon, bgColor, iconColor } = getFileIcon(file.mimeType);
          
          return (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-lg 
                hover:bg-[#F9FAFB] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#999999]">
                    Modified {formatDate(file.modifiedTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-xs text-[#999999]">
                  {formatFileSize(file.size)}
                </span>
                <button className="text-[#999999] hover:text-[#1A1A1A]">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentFiles;