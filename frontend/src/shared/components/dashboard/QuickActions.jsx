import { Upload, FolderPlus, Share2, RefreshCw } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      id: 'upload',
      icon: Upload,
      label: 'Upload Files',
      bgColor: 'bg-[#DBEAFE]',
      iconColor: 'text-[#3B82F6]',
      onClick: () => console.log('Upload files'),
    },
    {
      id: 'folder',
      icon: FolderPlus,
      label: 'New Folder',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      onClick: () => console.log('New folder'),
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share Link',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClick: () => console.log('Share link'),
    },
    {
      id: 'sync',
      icon: RefreshCw,
      label: 'Sync Files',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      onClick: () => console.log('Sync files'),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className="bg-white rounded-xl p-4 flex items-center space-x-3 
              border border-gray-200 hover:border-[#3B82F6] hover:shadow-md 
              transition-all duration-200"
          >
            <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <span className="font-medium text-[#1A1A1A]">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;