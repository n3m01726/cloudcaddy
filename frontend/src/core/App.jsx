import { Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gérer le callback OAuth AVANT de check l'auth
    handleOAuthCallback();
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.has('auth')) {
      checkAuthStatus();
    }
  }, [searchParams]);

  const handleOAuthCallback = () => {
    const authStatus = searchParams.get('auth');
    const userIdFromUrl = searchParams.get('userId');
    const error = searchParams.get('error');

    console.log('🔍 OAuth Callback Check:', { authStatus, userIdFromUrl, error });

    if (error) {
      console.error('❌ OAuth error:', error);
      alert(`Erreur d'authentification: ${error}`);
      navigate('/connections', { replace: true });
      return;
    }

    if (authStatus === 'success' && userIdFromUrl) {
      console.log('✅ OAuth success! Saving userId:', userIdFromUrl);
      
      // Sauvegarder le userId
      localStorage.setItem('userId', userIdFromUrl);
      setUserId(userIdFromUrl);
      setIsAuthenticated(true);
      setLoading(false);
      
      // Nettoyer l'URL et rediriger vers le dashboard
      navigate('/', { replace: true });
    }
  };

  const checkAuthStatus = async () => {
    try {
      const storedUserId = localStorage.getItem('userId');
      
      console.log('🔍 Checking auth... userId:', storedUserId);

      if (storedUserId) {
        setUserId(storedUserId);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('userId');
    setUserId(null);
    setIsAuthenticated(false);
    navigate('/connections');
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

  return (
    <Routes>
      {/* Route publique pour les connexions */}
      <Route 
        path="/connections" 
        element={
          <Connections 
            userId={userId} 
            connectedServices={null}
            onServicesUpdate={checkAuthStatus}
          />
        } 
      />

      {/* Routes protégées */}
      {isAuthenticated ? (
        <Route path="/*" element={
          <MainLayout userId={userId}>
            <Routes>
              <Route path="/" element={<DashboardHome userId={userId} />} />
              <Route path="/files" element={<FileExplorer userId={userId} />} />
              <Route path="/photos" element={<div className="p-6">Photos Files - Coming Soon</div>} />
              <Route path="/shared"  element={<div className="p-6">Shared Files - Coming Soon</div>} />
              <Route path="/requests" element={<div className="p-6">File Requests - Coming Soon</div>} />
              <Route path="/trash" element={<div className="p-6">Trash - Coming Soon</div>} />
              <Route 
                path="/settings" 
                element={<Settings user={{ id: userId }} onLogout={handleLogout} />} 
              />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/activity" element={<div className="p-6">Activity Feed - Coming Soon</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/connections" element={<Connections userId={userId} />} />
            </Routes>
          </MainLayout>
        } />
      ) : (
        <div> Something happens.</div>
        
      )}
    </Routes>
  );
}

export default App;