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
      setLoading(false);
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
      {/* Route publique pour les connexions - TOUJOURS accessible */}
      <Route 
        path="/*" 
        element={
          <Connections 
            userId={userId} 
            connectedServices={null}
            onServicesUpdate={checkAuthStatus}
          />
        } 
      />

      {/* Routes protégées avec MainLayout */}
      {isAuthenticated ? (
        <>
          <Route path="/" title="Dashboard" element={<MainLayout userId={userId}><DashboardHome userId={userId} /></MainLayout>} />
          <Route path="/files"  title="Explorer" element={<MainLayout userId={userId}><FileExplorer userId={userId} /></MainLayout>} />
          <Route path="/photos"  title="Photos Gallery" element={<MainLayout userId={userId}><div className="p-6">Photos Files - Coming Soon</div></MainLayout>} />
          <Route path="/shared"  title="File Shared" element={<MainLayout userId={userId}><div className="p-6">Shared Files - Coming Soon</div></MainLayout>} />
          <Route path="/requests"  title="File Requests" element={<MainLayout userId={userId}><div className="p-6">File Requests - Coming Soon</div></MainLayout>} />
          <Route path="/trash"  title="Tempo Trash" element={<MainLayout userId={userId}><div className="p-6">Trash - Coming Soon</div></MainLayout>} />
          <Route path="/settings"  title="Settings" element={<MainLayout userId={userId}><Settings userId={userId} onLogout={handleLogout} /></MainLayout>} />
          <Route path="/roadmap"  title="Roadmap" element={<MainLayout userId={userId}><Roadmap /></MainLayout>} />
          <Route path="/activity"  title="Activity Feed" element={<MainLayout userId={userId}><div className="p-6">Activity Feed - Coming Soon</div></MainLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        /* Routes non authentifiées - rediriger vers /connections */
        <>
          <Route path="/" element={<Navigate to="/connections" replace />} />
          <Route path="*" element={<Navigate to="/connections" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;