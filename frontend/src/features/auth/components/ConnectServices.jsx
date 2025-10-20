// frontend/src/features/auth/components/ConnectServices.jsx
import { useState } from 'react';
import { Check, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@core/services/api';

export default function ConnectServices({ userId, connectedServices, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState(null);

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      setLoadingProvider('google_drive');
      setError(null);
      const { authUrl } = await authService.getGoogleAuthUrl(userId);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Erreur connexion Google Drive:', err);
      setError('Erreur lors de la connexion à Google Drive');
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleConnectDropbox = async () => {
    try {
      setLoading(true);
      setLoadingProvider('dropbox');
      setError(null);
      const { authUrl } = await authService.getDropboxAuthUrl(userId);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Erreur connexion Dropbox:', err);
      setError('Erreur lors de la connexion à Dropbox');
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleDisconnect = async (provider) => {
    const providerName = provider === 'google_drive' ? 'Google Drive' : 'Dropbox';
    
    if (!confirm(
      `⚠️ Êtes-vous sûr de vouloir déconnecter ${providerName} ?\n\n` +
      `Vous devrez vous reconnecter pour accéder à vos fichiers.\n\n` +
      `Vos fichiers sur ${providerName} ne seront PAS supprimés.`
    )) {
      return;
    }

    try {
      setLoading(true);
      setLoadingProvider(provider);
      setError(null);
      await authService.disconnect(userId, provider);
      await onUpdate?.();
      
      // Message de succès
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2';
      successMsg.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>${providerName} déconnecté avec succès</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      
    } catch (err) {
      console.error(`Erreur déconnexion ${providerName}:`, err);
      setError(`Erreur lors de la déconnexion de ${providerName}`);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-900 font-medium">Erreur</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Google Drive Card */}
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
                {loadingProvider === 'google_drive' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Déconnecter
              </button>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'google_drive' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Connecter Google Drive
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropbox Card */}
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
                {loadingProvider === 'dropbox' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Déconnecter
              </button>
            ) : (
              <button
                onClick={handleConnectDropbox}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'dropbox' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Connecter Dropbox
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}