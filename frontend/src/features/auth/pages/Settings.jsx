// Page des paramètres utilisateur
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@core/services/api';
import ConnectServices from '@features/auth/components/ConnectServices';

import { useUserInfo } from '@shared/hooks/useUserInfo';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Database,
  Trash2,
  LogOut,
  ChevronRight,
  Shield,
  Link2
} from 'lucide-react';

function Settings ({ userId, onLogout, user }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');

  // 🔹 Hook principal : si userId n’est pas fourni, tente d’utiliser user?.id
  const { userInfo, loading, error } = useUserInfo(userId || user?.id);
  const userData = userInfo || user;

  // 🔸 États de chargement et d’erreur
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Chargement des informations utilisateur...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-600">
        Erreur : {error}
      </div>
    );
  }
  const handleDeleteAccount = () => {
    if (confirm('⚠️ ATTENTION !\n\nÊtes-vous sûr de vouloir supprimer votre compte ?\n\nCette action est irréversible et supprimera :\n- Toutes vos connexions aux services cloud\n- Toutes vos métadonnées (tags, favoris)\n- Toutes vos données utilisateur\n\nVos fichiers sur Google Drive et Dropbox ne seront PAS supprimés.')) {
      if (confirm('Confirmez-vous vraiment la suppression de votre compte ?\n\nTapez "SUPPRIMER" pour confirmer.')) {
        // TODO: Implémenter la suppression du compte
        alert('Fonctionnalité de suppression de compte à venir');
      }
    }
  };

  const settingsSections = [
    {
      id: 'account',
      title: 'Compte',
      icon: User,
      description: 'Gérez vos informations personnelles'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Configurez vos préférences de notification'
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: Lock,
      description: 'Gérez la sécurité de votre compte'
    },
    {
      id: 'appearance',
      title: 'Apparence',
      icon: Palette,
      description: 'Personnalisez l\'interface'
    },
    {
      id: 'storage',
      title: 'Stockage',
      icon: Database,
      description: 'Gérez vos données et cache'
    }
    ,
    {
      id: 'connections',
      title: 'Connexions',
      icon: Link2,
      description: 'Gérez vos connexions aux services cloud, ajoutez ou supprimez des services.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 mt-10">
        {/* Grille des paramètres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`bg-white rounded-xl shadow-lg border p-6 text-left hover:shadow-xl transition-all ${
                  activeSection === section.id 
                    ? 'border-indigo-500 ring-2 ring-indigo-200' 
                    : 'border-gray-100 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Section active */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          {activeSection === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-indigo-600" />
                Informations du compte
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{userData?.email || 'Non disponible'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Utilisateur
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm">
                    <p className="text-gray-600">{userData?.id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-indigo-600" />
                Notifications
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>À venir :</strong> Configurez vos préférences de notification pour rester informé des changements importants.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                Sécurité
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Connexion sécurisée</h4>
                      <p className="text-green-800 text-sm">
                        Votre compte utilise OAuth2 pour se connecter aux services cloud. Aucun mot de passe n'est stocké.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>À venir :</strong> Authentification à deux facteurs, journal d'activité, sessions actives.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-6 h-6 text-indigo-600" />
                Apparence
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>À venir :</strong> Mode sombre, personnalisation des couleurs, taille de la police.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'storage' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="w-6 h-6 text-indigo-600" />
                Stockage et données
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>À venir :</strong> Gestion du cache, téléchargement de vos données, statistiques d'utilisation.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'connections' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Link2 className="w-6 h-6 text-indigo-600" />
                Connexions aux services cloud
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                    Gérez vos connexions aux services cloud, ajoutez ou supprimez des services.
                    <span
                      onClick={() => navigate('/connections')}
                      className="text-indigo-600 ml-1 underline underline-offset-2 hover:text-indigo-800 underline underline-offset-4 cursor-pointer"
                    > 
                    Cliquez ici pour gérer vos services cloud
                    </span>.
                </p>
              </div>

            </div>
            
          )}



        </div>

        {/* Zone dangereuse */}
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Zone dangereuse
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Supprimer le compte
                </h3>
                <p className="text-sm text-red-700">
                  Supprime définitivement votre compte et toutes vos données. Cette action est irréversible.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex-shrink-0"
              >
                Supprimer
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">
                  Se déconnecter
                </h3>
                <p className="text-sm text-orange-700">
                  Déconnectez-vous de votre session actuelle.
                </p>
              </div>
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;