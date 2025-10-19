import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  WelcomeBanner,
  QuickActions,
  RecentFiles,
  QuickAccess,
  StorageOverview,
  ActivityFeed,
  SharedFiles,
  FileRequests,
} from '@/shared/components/dashboard';

const DashboardHome = ({ userId }) => { // ← Reçoit userId en prop
  const navigate = useNavigate();
  
  // Charger les données du dashboard
  const { data, loading, error, refresh } = useDashboardData(userId);

  const handleViewAllFiles = () => {
    navigate('/files');
  };

  const handleViewActivity = () => {
    navigate('/activity');
  };

  if (!userId) {
    navigate('/connections');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"> {/* ← Hauteur écran - topbar */}
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#666666]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
 {/* Welcome Banner */}
    <WelcomeBanner userId={userId} onViewActivity={handleViewActivity} /> {/* ← Ajouter userId */}

      {/* Quick Actions */}
      <QuickActions />

      {/* Two Column Layout: Recent Files + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentFiles 
            files={data.recentFiles} 
            onViewAll={handleViewAllFiles}
          />
        </div>

        <div className="lg:col-span-1">
          <QuickAccess folders={data.starredFiles} />
        </div>
      </div>

      {/* Storage & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorageOverview storageData={data.storage} />
        <ActivityFeed activities={data.activities} />
      </div>

      {/* Shared Files & File Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SharedFiles sharedFiles={data.sharedFiles} />
        <FileRequests requests={data.fileRequests} />
      </div>

    </div>
  );
};

export default DashboardHome;