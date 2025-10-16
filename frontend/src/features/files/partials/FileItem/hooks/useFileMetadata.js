import { useState, useRef, useEffect } from "react";
import { metadataService } from "@core/services/api";

export function useFileMetadata(file, userId) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const loadMetadata = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await metadataService.getMetadata(userId, file.id, file.provider);
      setMetadata(response.success ? response.metadata : null);
    } catch (err) {
      console.error("❌ Erreur chargement métadonnées:", err);
      setMetadata(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => { loadMetadata(); }, [file.id, file.provider, userId]);

  return { metadata, setMetadata, loading, loadMetadata };
}
