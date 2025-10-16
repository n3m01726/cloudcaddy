import { FileText, FileSpreadsheet, Folder, MoreHorizontal } from 'lucide-react';

const SharedFiles = ({ sharedFiles = [] }) => {
  // Mock data
  const mockFiles = [
    {
      id: 1,
      name: 'Marketing_Strategy.pdf',
      sharedBy: 'Alex Martin',
      isNew: true,
      icon: FileText,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      name: 'Sales_Data_Q3.xlsx',
      sharedBy: 'Emma Wilson',
      isNew: true,
      icon: FileSpreadsheet,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 3,
      name: 'Design Assets',
      sharedBy: 'Design Team',
      isNew: true,
      icon: Folder,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  const displayFiles = sharedFiles.length > 0 ? sharedFiles : mockFiles;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Shared with Me</h3>
        <span className="px-2 py-1 bg-[#DBEAFE] text-[#3B82F6] text-xs font-medium rounded-full">
          {displayFiles.filter(f => f.isNew).length} New
        </span>
      </div>

      <div className="space-y-3">
        {displayFiles.map((file) => {
          const Icon = file.icon;
          
          return (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 bg-[#FAFAFA] rounded-lg 
                hover:bg-[#F5F5F5] cursor-pointer transition"
            >
              <div className={`w-10 h-10 ${file.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${file.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                  {file.name}
                </p>
                <p className="text-xs text-[#999999]">
                  Shared by {file.sharedBy}
                </p>
              </div>
              {file.isNew && (
                <span className="w-2 h-2 bg-[#3B82F6] rounded-full flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SharedFiles;