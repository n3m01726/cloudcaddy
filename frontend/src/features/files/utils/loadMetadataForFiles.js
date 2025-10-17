import { metadataService } from '@core/services/api.js';
export const loadMetadataForFiles = async (filesList, userId, setMetadata) => {
  try {
    const metadataPromises = filesList.map((file) =>
      metadataService
        .getMetadata(userId, file.id, file.provider)
        .then((res) => {
          if (res.success && res.metadata) {
            // ✅ S'assurer que fileId est bien présent
            return {
              ...res.metadata,
              fileId: file.id // ← IMPORTANT : ajouter explicitement fileId
            };
          }
          return null;
        })
        .catch(() => null)
    );
    
    const metadataResults = await Promise.all(metadataPromises);
    const validMetadata = metadataResults.filter((m) => m !== null);
    
    console.log('📚 Métadonnées chargées:', validMetadata.length, 'sur', filesList.length);
    console.log('📊 Métadonnées détaillées:', validMetadata); // ← DEBUG
    
    setMetadata(validMetadata);
  } catch (err) {
    console.error('Erreur chargement métadonnées:', err);
  }
};