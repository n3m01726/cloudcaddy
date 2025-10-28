import { useState, useEffect, useCallback } from 'react';
import { authService, filesService } from '@core/services';


/**
 * Hook pour gérer toutes les données du dashboard
 */
export function useDashboardData(userId) {
  const [data, setData] = useState({
    recentFiles: [],
    starredFiles: [],
    activities: [],
    sharedFiles: [],
    fileRequests: [],
    storage: null,
    connectedServices: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger toutes les données du dashboard
  const loadDashboardData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Appels API parallèles pour optimiser
      const [filesResponse, starredResponse, authStatus] = await Promise.allSettled([
        filesService.listFiles(userId),
        filesService.getStarred(userId),
        authService.checkStatus(userId),
      ]);

      // Fichiers récents (limiter à 5)
      const recentFiles = filesResponse.status === 'fulfilled' 
        ? filesResponse.value.files
            .sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))
            .slice(0, 5)
        : [];

      // Fichiers favoris
      const starredFiles = starredResponse.status === 'fulfilled'
        ? starredResponse.value.files || []
        : [];

      // Services connectés
      const connectedServices = authStatus.status === 'fulfilled'
        ? authStatus.value.connectedServices
        : { google_drive: false, dropbox: false };

      // Calculer le storage (basé sur les fichiers)
      const storage = calculateStorage(
        filesResponse.status === 'fulfilled' ? filesResponse.value.files : []
      );

      // Générer les activités (basées sur les fichiers récents)
      const activities = generateActivities(recentFiles);

      // TODO: Ajouter l'API pour shared files et file requests
      const sharedFiles = [];
      const fileRequests = [];

      setData({
        recentFiles,
        starredFiles,
        activities,
        sharedFiles,
        fileRequests,
        storage,
        connectedServices,
      });

    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError('Impossible de charger les données du dashboard');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger au montage
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Fonction pour refresh
  const refresh = useCallback(() => {
    return loadDashboardData();
  }, [loadDashboardData]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}

/**
 * Calcule les statistiques de stockage
 */
function calculateStorage(files) {
  const totalUsed = files.reduce((sum, file) => sum + (file.size || 0), 0);
  const totalGB = totalUsed / (1024 * 1024 * 1024);

  // Calculer par provider
  const byProvider = {};
  files.forEach(file => {
    const provider = file.provider;
    if (!byProvider[provider]) {
      byProvider[provider] = 0;
    }
    byProvider[provider] += file.size || 0;
  });

  const providers = Object.entries(byProvider).map(([provider, bytes]) => ({
    name: provider === 'google_drive' ? 'Google Drive' : 'Dropbox',
    used: bytes / (1024 * 1024 * 1024),
    color: provider === 'google_drive' ? '#4285F4' : '#0061FF',
    icon: provider === 'google_drive' ? '🔵' : '🔷',
  }));

  // Calculer par type de fichier
  const byType = {
    documents: 0,
    images: 0,
    videos: 0,
    others: 0,
  };

  files.forEach(file => {
    const mime = file.mimeType?.toLowerCase() || '';
    const size = file.size || 0;

    if (mime.includes('document') || mime.includes('pdf') || mime.includes('text')) {
      byType.documents += size;
    } else if (mime.includes('image')) {
      byType.images += size;
    } else if (mime.includes('video')) {
      byType.videos += size;
    } else {
      byType.others += size;
    }
  });

  return {
    totalUsed: totalGB.toFixed(1),
    totalAvailable: 10, // TODO: Récupérer depuis l'API
    providers,
    byType: [
      { type: 'Documents', size: (byType.documents / (1024 * 1024 * 1024)).toFixed(1) },
      { type: 'Images', size: (byType.images / (1024 * 1024 * 1024)).toFixed(1) },
      { type: 'Videos', size: (byType.videos / (1024 * 1024 * 1024)).toFixed(1) },
      { type: 'Others', size: (byType.others / (1024 * 1024 * 1024)).toFixed(1) },
    ],
  };
}

/**
 * Génère des activités basées sur les fichiers récents
 */
function generateActivities(files) {
  return files.slice(0, 5).map((file, index) => {
    const types = ['upload', 'edit', 'share'];
    const type = types[index % types.length];

    return {
      id: file.id,
      type,
      user: 'You',
      action: type === 'upload' ? 'uploaded' : type === 'edit' ? 'edited' : 'shared',
      target: file.name,
      time: new Date(file.modifiedTime),
      icon: type === 'upload' ? 'Upload' : type === 'edit' ? 'Edit3' : 'Share2',
      bgColor: type === 'upload' ? 'bg-green-100' : type === 'edit' ? 'bg-purple-100' : 'bg-blue-100',
      iconColor: type === 'upload' ? 'text-green-600' : type === 'edit' ? 'text-purple-600' : 'text-blue-600',
    };
  });
}

export default useDashboardData;