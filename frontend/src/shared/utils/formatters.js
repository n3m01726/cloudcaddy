export function formatDate(dateInput, { mode = 'default' } = {}) {
  if (!dateInput) return mode === 'notif' ? '' : 'N/A';
  
  const date = new Date(dateInput);
  const now = new Date();
  const diff = now - date;

  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  // --- Mode relatif ("il y a ...") ---
  if (mode === 'relative') {
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // --- Mode notification ---
  if (mode === 'notif') {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (sameDay(date, now)) return "Aujourd'hui";
    if (sameDay(date, yesterday)) return "Hier";

    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  // --- Mode par défaut (classique) ---
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}




export function formatFileSize(bytes) {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

