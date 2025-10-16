import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

/**
 * DashboardHome - Page principale du dashboard
 * Affiche une vue d'ensemble de tous les fichiers et activités
 */
const DashboardHome = () => {
  const navigate = useNavigate();
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les fichiers récents au montage
  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    try {
      // TODO: Remplacer par un vrai appel API
      // const response = await api.get('/files/recent?limit=5');
      // setRecentFiles(response.data);
      
      // Pour l'instant, on laisse vide pour utiliser les mock data
      setRecentFiles([]);
    } catch (error) {
      console.error('Error loading recent files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllFiles = () => {
    navigate('/files');
  };

  const handleViewActivity = () => {
    navigate('/activity');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#666666]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Welcome Banner */}
      <WelcomeBanner onViewActivity={handleViewActivity} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Two Column Layout: Recent Files + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Files - 2/3 width */}
        <div className="lg:col-span-2">
          <RecentFiles 
            files={recentFiles} 
            onViewAll={handleViewAllFiles}
          />
        </div>

        {/* Quick Access - 1/3 width */}
        <div className="lg:col-span-1">
          <QuickAccess />
        </div>
      </div>

      {/* Storage & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorageOverview />
        <ActivityFeed />
      </div>

      {/* Shared Files & File Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SharedFiles />
        <FileRequests />
      </div>

    </div>
  );
};

export default DashboardHome;