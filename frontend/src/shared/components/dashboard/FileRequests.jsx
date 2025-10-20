import { Upload } from 'lucide-react';

const FileRequests = ({ requests = [] }) => {
  // Mock data
  const mockRequests = [
    {
      id: 1,
      title: 'Invoice Documents',
      requestedBy: 'Accounting Dept',
      priority: 'urgent',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      id: 2,
      title: 'Contract Signatures',
      requestedBy: 'Legal Team',
      priority: 'due-soon',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  const displayRequests = requests.length > 0 ? requests : mockRequests;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">File Requests</h3>
        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
          {displayRequests.length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {displayRequests.map((request) => (
          <div
            key={request.id}
            className={`p-4 ${request.bgColor} border ${request.borderColor} rounded-lg`}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-[#1A1A1A]">
                {request.title}
              </p>
              <span className={`text-xs ${request.textColor} font-medium capitalize`}>
                {request.priority.replace('-', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#666666] mb-3">
              Requested by {request.requestedBy}
            </p>
            <button
              className={`w-full px-3 py-2 ${request.buttonColor} text-white 
                rounded-lg text-xs font-medium transition flex items-center 
                justify-center space-x-2`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Files</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileRequests;