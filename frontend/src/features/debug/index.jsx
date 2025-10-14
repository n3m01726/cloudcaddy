import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function DebugPage() {
  const [userId, setUserId] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const testUserInfo = async () => {
    if (!userId) {
      alert('Veuillez entrer un userId');
      return;
    }

    setLoading(true);
    const info = {
      timestamp: new Date().toISOString(),
      steps: []
    };

    try {
      // Test 1: Vérifier la connexion au backend
      info.steps.push({ name: 'Connexion backend', status: 'testing' });
      const pingResponse = await fetch(`${API_URL}/health`).catch(() => null);
      info.steps[0].status = pingResponse?.ok ? 'success' : 'error';
      info.steps[0].details = pingResponse ? `Status: ${pingResponse.status}` : 'Backend inaccessible';

      // Test 2: Vérifier l'existence de l'utilisateur
      info.steps.push({ name: 'Utilisateur en DB', status: 'testing' });
      const statusResponse = await fetch(`${API_URL}/auth/status/${userId}`);
      const statusData = await statusResponse.json();
      info.steps[1].status = statusData.success ? 'success' : 'error';
      info.steps[1].details = JSON.stringify(statusData, null, 2);

      // Test 3: Récupérer les infos utilisateur
      info.steps.push({ name: 'Infos utilisateur', status: 'testing' });
      const userResponse = await fetch(`${API_URL}/auth/user/info/${userId}`);
      const userData = await userResponse.json();
      info.steps[2].status = userData.success ? 'success' : 'error';
      info.steps[2].details = JSON.stringify(userData, null, 2);
      info.steps[2].user = userData.user;

      // Test 4: Vérifier l'URL de l'image
      if (userData.user?.picture) {
        info.steps.push({ name: 'Test chargement image', status: 'testing' });
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            info.steps[3].status = 'success';
            info.steps[3].details = `Image chargée: ${img.width}x${img.height}px`;
            resolve();
          };
          img.onerror = (e) => {
            info.steps[3].status = 'error';
            info.steps[3].details = `Erreur de chargement: ${e.type}`;
            reject(e);
          };
          img.src = userData.user.picture;
        }).catch(() => {});
      }

    } catch (error) {
      console.error('Erreur lors du test:', error);
    } finally {
      setDebugInfo(info);
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Page de Debug - Avatar</h1>

        {/* Formulaire de test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Entrez l'userId"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={testUserInfo}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Test en cours...
                </>
              ) : (
                'Lancer le test'
              )}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            UserId actuel: {localStorage.getItem('userId') || 'Aucun'}
          </p>
        </div>

        {/* Résultats */}
        {debugInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Résultats du test - {debugInfo.timestamp}
            </h2>

            <div className="space-y-4">
              {debugInfo.steps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon status={step.status} />
                    <h3 className="font-semibold text-gray-900">{step.name}</h3>
                  </div>
                  {step.details && (
                    <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                      {step.details}
                    </pre>
                  )}
                  {step.user?.picture && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Prévisualisation de l'avatar:</p>
                      <div className="flex items-center gap-4">
                        <img
                          src={step.user.picture}
                          alt="Avatar"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                        <div>
                          <p className="text-sm font-medium">{step.user.name}</p>
                          <p className="text-xs text-gray-500">{step.user.email}</p>
                          <a 
                            href={step.user.picture} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            Ouvrir l'image
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations système */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informations système</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>API URL:</strong> {API_URL}
            </div>
            <div>
              <strong>Frontend URL:</strong> {window.location.origin}
            </div>
            <div>
              <strong>LocalStorage userId:</strong> {localStorage.getItem('userId') || 'Non défini'}
            </div>
            <div>
              <strong>User Agent:</strong> {navigator.userAgent.slice(0, 50)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}