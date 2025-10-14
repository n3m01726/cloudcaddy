import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Hook personnalisé pour récupérer et gérer les informations utilisateur avec photo
 */
export function useUserInfo(userId) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const url = `${API_URL}/auth/user/info/${userId}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.user) {
          setUserInfo(data.user);
          setError(null);
        } else {
          setError(data.error || 'Erreur inconnue');
        }
      } catch (err) {
        console.error('❌ Erreur fetch userInfo:', err);
        setError('Impossible de récupérer les informations utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return { userInfo, loading, error };
}

export default useUserInfo;