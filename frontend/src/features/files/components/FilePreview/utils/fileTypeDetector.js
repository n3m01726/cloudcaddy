/**
 * Détecte le type de fichier pour choisir le bon viewer
 * @param {Object} file - Objet fichier
 * @param {string} mimeType - Type MIME du fichier
 * @returns {string} Type détecté (google-apps|image|video|audio|pdf|text|fallback)
 */
export const detectFileType = (file, mimeType = '') => {
  const ext = file.name?.split('.').pop()?.toLowerCase() || '';
  const mime = (mimeType || file.mimeType || '').toLowerCase();

  // Documents Google (Google Docs, Sheets, Slides)
  if (mime.includes('google-apps')) {
    return 'google-apps';
  }

  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext) || 
      mime.startsWith('image/')) {
    return 'image';
  }

  // Vidéos
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext) || 
      mime.startsWith('video/')) {
    return 'video';
  }

  // Audio
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext) || 
      mime.startsWith('audio/')) {
    return 'audio';
  }

  // PDF
  if (ext === 'pdf' || mime === 'application/pdf') {
    return 'pdf';
  }

  // Texte
  if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(ext) || 
      mime.startsWith('text/')) {
    return 'text';
  }

  // Fallback pour types non supportés
  return 'fallback';
};