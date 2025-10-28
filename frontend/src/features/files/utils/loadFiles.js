import { filesService } from '@core/services';


export const loadFiles = async (
  folderId,
  folderName,
  provider,
  userId,
  setFiles,
  setMetadata, // ← Garder pour compatibilité mais ne plus utiliser
  setProviderStates,
  setLoading,
  setError,
  setSearchQuery
) => {
  setLoading(true);
  setError(null);
  setSearchQuery('');
  
  try {
    const response = await filesService.listFiles(userId, folderId);
    const filesList = response.files || [];
    setFiles(filesList);

    // ❌ NE PLUS charger les métadonnées ici
    // Chaque FileItem va les charger lui-même
    
    if (provider) {
      setProviderStates((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          currentFolder: folderId,
          currentFolderName: folderName,
        },
      }));
    }
  } catch (err) {
    setError('Erreur lors du chargement des fichiers');
    console.error(err);
  } finally {
    setLoading(false);
  }
};