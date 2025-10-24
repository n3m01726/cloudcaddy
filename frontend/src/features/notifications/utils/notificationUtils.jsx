import React from 'react';
import {
  Share2,
  CloudUpload,
  Trash,
  FilePen,
  FilePlus,
  RefreshCw,
  Workflow,
  CircleCheckBig,
  ShieldAlert,
  Bell,
  Upload
} from 'lucide-react';

// Format relatif
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date)) return '';
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
};

// Format pour separator/date grouping
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date)) return '';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
};

export const getTypeIcon = (type) => {
  const icons = {
    file_shared: { Icon: Share2, color: 'text-blue-500' },
    file_uploaded: { Icon: CloudUpload, color: 'text-emerald-500' },
    file_deleted: { Icon: Trash, color: 'text-red-500' },
    file_modified: { Icon: FilePen, color: 'text-amber-500' },
    file_created: { Icon: FilePlus, color: 'text-teal-500' },
    all_synced: { Icon: RefreshCw, color: 'text-indigo-500' },
    service_connected: { Icon: Workflow, color: 'text-violet-500' },
    success: { Icon: CircleCheckBig, color: 'text-lime-500' },
    error: { Icon: ShieldAlert, color: 'text-rose-500' },
    upload: { Icon: Upload, color: 'text-cyan-500' }, // si tu utilises 'upload' comme type
    default: { Icon: Bell, color: 'text-gray-400' }
  };

  const { Icon, color } = icons[type] || icons.default;
  // Rendre via une variable commençant par majuscule
  return <Icon className={`w-7 h-7 ${color}`} />;
};