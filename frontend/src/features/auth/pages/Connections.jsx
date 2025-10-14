// Page de gestion des connexions aux services cloud
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@core/services/api';
import { Cloud, CheckCircle, XCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

function Connections({ userId, connectedServices, onServicesUpdate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      setLoadingProvider('google_drive');
      const { authUrl } = await authService.getGoogleAuthUrl(userId);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur lors de la connexion à Google Drive:', error);
      alert('Erreur lors de la connexion à Google Drive');
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleConnectDropbox = async () => {
    try {
      setLoading(true);
      setLoadingProvider('dropbox');
      const { authUrl } = await authService.getDropboxAuthUrl(userId);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur lors de la connexion à Dropbox:', error);
      alert('Erreur lors de la connexion à Dropbox');
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleDisconnect = async (provider) => {
    const providerName = provider === 'google_drive' ? 'Google Drive' : 'Dropbox';
    
    if (!confirm(`Êtes-vous sûr de vouloir déconnecter ${providerName} ?\n\nVous devrez vous reconnecter pour accéder à vos fichiers.`)) {
      return;
    }

    try {
      setLoading(true);
      setLoadingProvider(provider);
      await authService.disconnect(userId, provider);
      await onServicesUpdate();
      alert(`${providerName} a été déconnecté avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la déconnexion de ${providerName}:`, error);
      alert(`Erreur lors de la déconnexion de ${providerName}`);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const hasConnectedServices = connectedServices && 
    (connectedServices.google_drive || connectedServices.dropbox);

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gérer vos connexions
        </h1>
        <p className="text-gray-600">
          Connectez ou déconnectez vos services cloud préférés
        </p>
      </div>

      {/* Carte Google Drive */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path d="M7.71 3.5L1.13 15L4.55 21L11.13 9L7.71 3.5Z" fill="#0066DA"/>
                  <path d="M14.9 3.5L8.32 15L11.74 21L18.32 9L14.9 3.5Z" fill="#00AC47"/>
                  <path d="M14.9 3.5H7.71L11.13 9L14.9 3.5Z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Google Drive</h3>
                <p className="text-sm text-gray-500 mt-1">Stockage cloud de Google</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectedServices?.google_drive ? (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Connecté
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                  <XCircle className="w-4 h-4" />
                  Non connecté
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            {connectedServices?.google_drive ? (
              <button
                onClick={() => handleDisconnect('google_drive')}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'google_drive' && <Loader2 className="w-4 h-4 animate-spin" />}
                Déconnecter
              </button>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'google_drive' && <Loader2 className="w-4 h-4 animate-spin" />}
                Connecter Google Drive
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carte Dropbox */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#0061FF">
                  <path d="M6 1.5L0 5L6 8.5L12 5L6 1.5Z"/>
                  <path d="M18 1.5L12 5L18 8.5L24 5L18 1.5Z"/>
                  <path d="M0 11.5L6 15L12 11.5L6 8L0 11.5Z"/>
                  <path d="M12 11.5L18 15L24 11.5L18 8L12 11.5Z"/>
                  <path d="M6 16L12 19.5L18 16L12 12.5L6 16Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dropbox</h3>
                <p className="text-sm text-gray-500 mt-1">Plateforme de stockage cloud</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectedServices?.dropbox ? (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Connecté
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                  <XCircle className="w-4 h-4" />
                  Non connecté
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            {connectedServices?.dropbox ? (
              <button
                onClick={() => handleDisconnect('dropbox')}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'dropbox' && <Loader2 className="w-4 h-4 animate-spin" />}
                Déconnecter
              </button>
            ) : (
              <button
                onClick={handleConnectDropbox}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'dropbox' && <Loader2 className="w-4 h-4 animate-spin" />}
                Connecter Dropbox
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bouton pour aller aux fichiers */}
      {hasConnectedServices && (
        <div className="inline-flex items-center gap-4 justify-center w-full">
          <button
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          ><ArrowLeft className="w-5 h-5" />
            Retour aux paramètres
          </button>
          <button
            onClick={() => navigate('/files')}
            className="inline-flex items-center gap-2 ml-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          > Accéder à mes fichiers
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
      )}

      {/* Message si aucun service connecté */}
      {!hasConnectedServices && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Premier pas</h4>
              <p className="text-blue-800 text-sm">
                Connectez au moins un service cloud pour commencer à gérer vos fichiers depuis une interface unique.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Connections;