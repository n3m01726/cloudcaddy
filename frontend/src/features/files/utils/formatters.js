export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}


export function formatFileSize(bytes) {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

