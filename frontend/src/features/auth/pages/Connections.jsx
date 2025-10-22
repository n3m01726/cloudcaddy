// frontend/src/features/auth/pages/Connections.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@core/services/api';
import ConnectServices from '@features/auth/components/ConnectServices';

function Connections({ userId, connectedServices: initialServices, onServicesUpdate }) {
  const navigate = useNavigate();
  const [connectedServices, setConnectedServices] = useState(initialServices);
  const [loading, setLoading] = useState(false); // ✅ Commencer à false
  const [error, setError] = useState(null);

  // Charger les services connectés seulement si on a un userId
  useEffect(() => {
    // ✅ Si pas de userId, pas besoin de charger → pas de loading
    if (!userId) {
      setLoading(false);
      setConnectedServices(null);
      return;
    }

    // ✅ Si on a déjà les services initiaux, pas besoin de charger
    if (initialServices) {
      setConnectedServices(initialServices);
      setLoading(false);
      return;
    }

    // ✅ Charger seulement si userId existe et pas de services initiaux
    loadConnectedServices();
  }, [userId, initialServices]);

  const loadConnectedServices = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.checkStatus(userId);
      if (response.success) {
        setConnectedServices(response.connectedServices);
      }
    } catch (err) {
      console.error('Erreur chargement services:', err);
      setError('Impossible de charger les services connectés');
    } finally {
      setLoading(false);
    }
  };

  const handleServicesUpdate = async () => {
    await loadConnectedServices();
    onServicesUpdate?.();
  };

  const hasConnectedServices = connectedServices && 
    (connectedServices.google_drive || connectedServices.dropbox);

  // ✅ Loading screen seulement si vraiment en train de charger
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#666666]">Chargement des services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête avec icône moderne */}
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

      {/* Message d'erreur global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-900 font-medium">Erreur</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Message si pas encore de userId (première visite) */}
      {!userId && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cloud className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Bienvenue !</h4>
              <p className="text-amber-800 text-sm">
                Connectez votre premier service cloud pour commencer à utiliser CloudHub.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Composant ConnectServices réutilisé */}
      <ConnectServices 
        userId={userId}
        connectedServices={connectedServices}
        onUpdate={handleServicesUpdate}
      />

      {/* Message si aucun service connecté (mais userId existe) */}
      {userId && !hasConnectedServices && (
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

      {/* Boutons de navigation (si services connectés) */}
      {hasConnectedServices && (
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux paramètres
          </button>
          
          <button
            onClick={() => navigate('/files')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
          >
            Accéder à mes fichiers
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Informations de sécurité */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Sécurité et confidentialité</h4>
            <p className="text-green-800 text-sm">
              Vos données sont protégées. Nous stockons uniquement les tokens OAuth2 nécessaires pour accéder à vos fichiers. 
              Aucun mot de passe n'est conservé, et vous pouvez révoquer l'accès à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connections;