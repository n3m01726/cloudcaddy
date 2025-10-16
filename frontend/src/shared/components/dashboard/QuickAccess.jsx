import { Folder, MoreHorizontal } from 'lucide-react';

const QuickAccess = ({ folders = [] }) => {
  // Mock data
  const mockFolders = [
    { id: 1, name: 'Work Docs', color: 'text-yellow-500', fileCount: 24 },
    { id: 2, name: 'Client Files', color: 'text-blue-500', fileCount: 18 },
    { id: 3, name: 'Photos', color: 'text-green-500', fileCount: 142 },
    { id: 4, name: 'Personal', color: 'text-purple-500', fileCount: 67 },
  ];

  const displayFolders = folders.length > 0 ? folders : mockFolders;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Quick Access</h3>
        <button className="text-[#999999] hover:text-[#1A1A1A]">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {displayFolders.map((folder) => (
          <div
            key={folder.id}
            className="p-3 bg-[#FAFAFA] rounded-lg cursor-pointer hover:bg-[#F5F5F5] transition"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Folder className={`w-5 h-5 ${folder.color}`} />
              <span className="text-sm font-medium text-[#1A1A1A]">
                {folder.name}
              </span>
            </div>
            <p className="text-xs text-[#999999]">{folder.fileCount} files</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;