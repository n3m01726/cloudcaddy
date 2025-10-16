import { FileText, FileSpreadsheet, Image as ImageIcon, FileCode, MoreHorizontal } from 'lucide-react';
import { formatFileSize } from '@/features/files/utils/formatFileSize';
import { formatDate } from '@/features/files/utils/formatDate';

const RecentFiles = ({ files = [], onViewAll }) => {
  // Mock data si pas de fichiers fournis
  const mockFiles = [
    {
      id: 1,
      name: 'Project_Proposal_2024.pdf',
      size: 2400000,
      modifiedTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      mimeType: 'application/pdf',
      provider: 'google',
    },
    {
      id: 2,
      name: 'Budget_Q4_2024.xlsx',
      size: 856000,
      modifiedTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      provider: 'dropbox',
    },
    {
      id: 3,
      name: 'Team_Photo_Sept.jpg',
      size: 4200000,
      modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      mimeType: 'image/jpeg',
      provider: 'google',
    },
    {
      id: 4,
      name: 'Invoice_2024_OCT.pdf',
      size: 1800000,
      modifiedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      mimeType: 'application/pdf',
      provider: 'dropbox',
    },
    {
      id: 5,
      name: 'Marketing_Deck_Final.pptx',
      size: 12300000,
      modifiedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      provider: 'google',
    },
  ];

  const displayFiles = files.length > 0 ? files : mockFiles;

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) {
      return { Icon: FileText, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return { Icon: FileSpreadsheet, bgColor: 'bg-green-100', iconColor: 'text-green-600' };
    }
    if (mimeType.includes('image')) {
      return { Icon: ImageIcon, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' };
    }
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return { Icon: FileCode, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' };
    }
    return { Icon: FileText, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  const getProviderIcon = (provider) => {
    if (provider === 'google') return '🔵';
    if (provider === 'dropbox') return '🔷';
    return '📁';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Files</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-[#3B82F6] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-1">
        {displayFiles.map((file) => {
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
                <span className="text-lg">
                  {getProviderIcon(file.provider)}
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