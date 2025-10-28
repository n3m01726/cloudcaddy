import { useState } from 'react';

/**
 * Hook pour gérer l'affichage de la sidebar de métadonnées
 * @returns {Object} { showMetadata, toggle, show, hide }
 */
export const useMetadataPanel = (initialState = true) => {
  const [showMetadata, setShowMetadata] = useState(initialState);

  return {
    showMetadata,
    toggle: () => setShowMetadata(prev => !prev),
    show: () => setShowMetadata(true),
    hide: () => setShowMetadata(false)
  };
};