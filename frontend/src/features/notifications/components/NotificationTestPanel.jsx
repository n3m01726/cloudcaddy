// frontend/src/features/notifications/components/NotificationTestPanel.jsx
// Composant de test pour générer des notifications facilement (DEV ONLY)

import { useState } from 'react';
import { Bell, Zap, Upload, Trash2, Share2, Link2, XCircle, CheckCircle } from 'lucide-react';
import NotificationHelpers from '../utils/notificationHelpers';

export default function NotificationTestPanel({ userId }) {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState('');





  const testNotifications = [
    {
      icon: Link2,
      label: 'Connexion Google',
      color: 'bg-blue-500',
      user: 'Denis Lapointe',
      action: () => NotificationHelpers.onServiceConnected(userId, 'Google Drive')
    },
    {
      icon: XCircle,
      label: 'Déconnexion Dropbox',
      color: 'bg-red-500',
      user: 'Denis Lapointe',
      action: () => NotificationHelpers.onServiceDisconnected(userId, 'Dropbox')
    },
    {
      icon: Upload,
      label: 'Upload fichier',
      color: 'bg-green-500',
      user: 'Finley Menton',
      action: () => NotificationHelpers.onFileUploaded(userId, 'test-document.pdf', 'Google Drive')
    },
    {
      icon: Trash2,
      label: 'Suppression fichier',
      color: 'bg-orange-500',
      user: 'Iris Jackson',
      action: () => NotificationHelpers.onFileDeleted(userId, 'old-file.txt')
    },
    {
      icon: Share2,
      label: 'Partage fichier',
      color: 'bg-purple-500',
      user: 'Evelyn Robinson',
      action: () => NotificationHelpers.onFileShared(userId, 'report.xlsx', 'john@example.com')
    },
    {
      icon: CheckCircle,
      label: 'Succès générique',
      color: 'bg-teal-500',
      action: () => NotificationHelpers.onSuccess(userId, 'Opération terminée avec succès')
    },
    {
      icon: XCircle,
      label: 'Erreur générique',
      color: 'bg-red-600',
      action: () => NotificationHelpers.onError(userId, 'Une erreur est survenue')
    }
  ];

  const handleTest = async (testFn, label) => {
    try {
      setLoading(true);
      await testFn();
      setLastAction(`✅ ${label}`);
      
      // Auto-clear après 3s
      setTimeout(() => setLastAction(''), 3000);
    } catch (error) {
      console.error('Erreur test notification:', error);
      setLastAction(`❌ Erreur: ${label}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <h3 className="font-semibold">Test de notifications</h3>
        </div>
        <p className="text-xs text-white/80 mt-1">Panel de développement</p>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
        {testNotifications.map((test, index) => {
          const Icon = test.icon;
          return (
            <button
              key={index}
              onClick={() => handleTest(test.action, test.label, test.user)}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className={`w-10 h-10 ${test.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="">
                <div className='text-sm text-gray-700'>{test.user ? `${test.user}` : ''}</div>
                <div className='text-xs font-medium text-gray-500'>{test.label} on 2025-03-04</div>
              </div>
            </button>
    
          );
        })}
        
      </div>

      {/* Status */}
      {lastAction && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <p className="text-xs text-gray-600">{lastAction}</p>
        </div>
      )}

      {/* Warning */}
      <div className="border-t border-red-200 bg-red-50 p-3">
        <p className="text-xs text-red-600 font-medium">
          ⚠️ DEV ONLY - Retirer en production
        </p>
      </div>
    </div>
  );
}