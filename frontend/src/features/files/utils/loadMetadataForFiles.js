import { metadataService } from '../../../core/services/api';
export const loadMetadataForFiles = async (filesList, userId, setMetadata) => {
  try {
    const metadataPromises = filesList.map((file) =>
      metadataService
        .getMetadata(userId, file.id, file.provider)
        .then((res) => (res.success && res.metadata ? res.metadata : null))
        .catch(() => null)
    );
    const metadataResults = await Promise.all(metadataPromises);
    const validMetadata = metadataResults.filter((m) => m !== null);
    setMetadata(validMetadata);
    console.log(
      '📚 Métadonnées chargées:',
      validMetadata.length,
      'sur',
      filesList.length
    );
  } catch (err) {
    console.error('Erreur chargement métadonnées:', err);
  }
};
