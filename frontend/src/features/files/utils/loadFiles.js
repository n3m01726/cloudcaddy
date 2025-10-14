import { filesService } from '../../../core/services/api';
import { loadMetadataForFiles } from './loadMetadataForFiles';
export const loadFiles = async (
  folderId,
  folderName,
  provider,
  userId,
  setFiles,
  setMetadata,
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
    // Charger les métadonnées pour tous les fichiers affichés
    await loadMetadataForFiles(filesList, userId, setMetadata);
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
