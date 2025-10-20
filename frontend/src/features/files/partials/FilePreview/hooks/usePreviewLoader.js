// ============================================
// hooks/usePreviewLoader.js
// ============================================
import { useState, useEffect } from 'react';

/**
 * Hook pour charger les données de preview depuis l'API
 * @param {Object} file - Fichier à prévisualiser
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object} { previewData, loading, error, reload }
 */
export const usePreviewLoader = (file, userId) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPreview = async () => {
    if (!file || !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${API_URL}/files/${userId}/preview/${file.provider}/${file.id}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Données preview reçues:', data);
      
      if (data.success && data.preview) {
        setPreviewData(data.preview);
      } else {
        setError(data.error || 'Impossible de charger la prévisualisation');
      }
    } catch (err) {
      console.error('❌ Erreur preview:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [file, userId]);

  return {
    previewData,
    loading,
    error,
    reload: loadPreview
  };
};
