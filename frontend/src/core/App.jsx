import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layout
import MainLayout from '@/shared/components/layout/MainLayout';

// Pages
import DashboardHome from '@/features/dashboard/pages/DashboardHome';
import FileExplorer from '@/features/files/pages/FileExplorer';
import Connections from '@/features/auth/pages/Connections';
import Settings from '@/features/auth/pages/Settings';
import Roadmap from '@/features/roadmap/components/Roadmap';

// Styles
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Vérifier si l'utilisateur est connecté
      // const response = await api.get('/auth/status');
      // setIsAuthenticated(response.data.authenticated);
      
      // Pour l'instant, on considère l'utilisateur connecté
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#666666]">Loading CloudHub...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, afficher seulement les routes publiques
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/connections" element={<Connections />} />
        <Route path="*" element={<Navigate to="/connections" replace />} />
      </Routes>
    );
  }

  // Si authentifié, afficher le layout complet
  return (
    <MainLayout>
      <Routes>
        {/* Dashboard Home */}
        <Route path="/" element={<DashboardHome />} />
        
        {/* File Management */}
        <Route path="/files" element={<FileExplorer />} />
        <Route path="/photos" element={<FileExplorer filter="photos" />} />
        <Route path="/shared" element={<FileExplorer filter="shared" />} />
        <Route path="/requests" element={<div className="p-6">File Requests - Coming Soon</div>} />
        <Route path="/trash" element={<div className="p-6">Trash - Coming Soon</div>} />
        
        {/* Settings & Config */}
        <Route path="/connections" element={<Connections />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/roadmap" element={<Roadmap />} />
        
        {/* Activity */}
        <Route path="/activity" element={<div className="p-6">Activity Feed - Coming Soon</div>} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;