// Composant principal de l'application
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FileExplorer from '@features/files/pages/FileExplorer';
import Connections from '@features/auth/pages/Connections';
import Settings from '@features/auth/pages/Settings';
import Navbar from '@shared/components/Navbar';
import { authService } from '@core/services/api';
import useUserInfo from '@shared/hooks/useUserInfo';
import { Cloud } from 'lucide-react';

function App() {
  const [userId, setUserId] = useState(null);
  const [connectedServices, setConnectedServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basicUser, setBasicUser] = useState(null);
  const navigate = useNavigate();

  // Hook pour récupérer les infos utilisateur avec photo
  const { userInfo, loading: userInfoLoading } = useUserInfo(userId);

  useEffect(() => {
    // Vérifier si l'utilisateur revient d'une authentification OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const returnedUserId = urlParams.get('userId');
    const error = urlParams.get('error');

    if (error) {
      alert(`Erreur d'authentification: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
      return;
    }

    if (authStatus === 'success' && returnedUserId) {
      // Sauvegarder l'ID utilisateur dans localStorage
      localStorage.setItem('userId', returnedUserId);
      setUserId(returnedUserId);
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Charger les informations de l'utilisateur
      loadUserStatus(returnedUserId);
    } else {
      // Vérifier si un utilisateur est déjà connecté
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        setUserId(savedUserId);
        loadUserStatus(savedUserId);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const loadUserStatus = async (id) => {
    try {
      const response = await authService.checkStatus(id);
      setBasicUser(response.user);
      setConnectedServices(response.connectedServices);
    } catch (err) {
      console.error('Erreur lors du chargement du statut:', err);
      // Si l'utilisateur n'existe plus, on nettoie
      localStorage.removeItem('userId');
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('userId');
      setUserId(null);
      setBasicUser(null);
      setConnectedServices(null);
      navigate('/');
    }
  };

  const hasConnectedServices = connectedServices && 
    (connectedServices.google_drive || connectedServices.dropbox);

  // Combiner les infos de base avec les infos complètes (incluant la photo)
  const user = userInfo || basicUser;

  if (loading || (userId && userInfoLoading && !basicUser)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header fixe */}
      {user && (
        <header className="w-full bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto pl-4 pr-6 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-10">
            <div className="flex items-center justify-between h-16">
              {/* Logo et titre */}
              <div className="flex items-center gap-3">
                <a href="/files" className="flex items-center gap-3">
                  <div>
                    <Cloud className="w-8 h-8 text-indigo-600" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    driveNest
                  </span>
                </a>
              </div>
              
              {/* Menu utilisateur à droite */}
              <Navbar user={user} onLogout={handleLogout} />
            </div>
          </div>
        </header>
      )}

      {/* Contenu principal avec padding-top pour compenser le header fixed */}
      <main className={`${user ? 'pt-24' : ''} pb-8`}>
        <Routes>
          {/* Route de connexion */}
          <Route 
            path="/" 
            element={
              !userId ? (
                <div className="max-w-2xl mx-auto px-6 text-center">
                  <div className="bg-white rounded-lg shadow-xl p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Bienvenue sur driveNest
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Connectez vos services cloud préférés et gérez tous vos fichiers depuis une seule interface.
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={async () => {
                          try {
                            const { authUrl } = await authService.getGoogleAuthUrl();
                            window.location.href = authUrl;
                          } catch {
                            alert('Erreur lors de la connexion');
                          }
                        }}
                        className="px-8 py-3 bg-white text-gray-950 border-gray-400 border-1 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                      >
                        Se connecter avec Google Drive
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/files" replace />
              )
            } 
          />

          {/* Route pour la page des connexions */}
          <Route 
            path="/connections" 
            element={
              userId ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Connections 
                    userId={userId} 
                    connectedServices={connectedServices}
                    onServicesUpdate={() => loadUserStatus(userId)}
                  />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Route pour l'explorateur de fichiers */}
          <Route 
            path="/files" 
            element={
              userId && hasConnectedServices ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FileExplorer userId={userId} />
                </div>
              ) : userId ? (
                <Navigate to="/connections" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Route pour les Settings */}
          <Route 
            path="/settings" 
            element={
              userId ? (
                <Settings user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Route par défaut - redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-900">
        <span className="inline-flex items-center rounded-md bg-blue-950 my-3 px-3 py-2 text-xs font-medium text-blue-200 inset-ring inset-ring-blue-500/20">
          ALPHA v0.0.8
        </span>
        <p className="mt-1 text-gray-900">
          © 2025 driveNest Inc. • Made with ❤️ by{' '}
          <a href="#">
            <b className="underline underline-offset-4 hover:text-blue-400">the driveNest Team</b>
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;