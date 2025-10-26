import { FaGoogle, FaDropbox } from 'react-icons/fa';
const StorageOverview = ({ storageData }) => {
  // Mock data
const mockData = {
  totalUsed: 8,
  totalAvailable: 10,
  providers: [
    { 
      name: 'Google Drive',
      used: 5.2,
      color: '#4285F4',
      icon: <FaGoogle className="text-[#4285F4]" />,
    },
    { 
      name: 'Dropbox',
      used: 2.8,
      color: '#0061FF',
      icon: <FaDropbox className="text-[#0061FF]" />,
    },
  ],
  byType: [
    { type: 'Documents', size: 3.2 },
    { type: 'Images', size: 2.8 },
    { type: 'Videos', size: 1.5 },
    { type: 'Others', size: 0.5 },
  ],
};

  const data = storageData || mockData;
  const percentage = (data.totalUsed / data.totalAvailable) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Storage Overview</h3>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#666666]">Total Storage</span>
          <span className="text-sm font-medium text-[#1A1A1A]">
            {data.totalUsed} GB / {data.totalAvailable} GB
          </span>
        </div>
        <div className="w-full bg-[#FAFAFA] rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#3B82F6] to-blue-600 rounded-full h-3 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* By Provider */}
      <div className="space-y-4 mb-6">
        {data.providers.map((provider, index) => {
          const providerPercentage = (provider.used / data.totalAvailable) * 100;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  
                  <span className="text-sm text-[#666666]">{provider.name}</span>
                </div>
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {provider.used} GB
                </span>
              </div>
              <div className="w-full bg-[#FAFAFA] rounded-full h-2">
                <div
                  className="rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${providerPercentage}%`,
                    backgroundColor: provider.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* By Type */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-3">
          By File Type
        </p>
        <div className="grid grid-cols-2 gap-3">
          {data.byType.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs text-[#666666]">{item.type}</span>
              <span className="text-xs font-medium text-[#1A1A1A]">
                {item.size} GB
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorageOverview;