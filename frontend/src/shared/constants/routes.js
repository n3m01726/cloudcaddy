// frontend/src/shared/constants/routes.js

import {
  Home,
  Folder,
  Cable,
  Settings,
  Map,
  Bell,
  Image,
  Share2,
  Inbox,
  Trash2,
} from 'lucide-react';

/**
 * Définition centralisée des routes principales de l’app
 * Utilisée pour les menus, titres de page, navigation, etc.
 */

export const ROUTES = {
  DASHBOARD: { path: '/', title: 'Dashboard', icon: Home },
  FILES: { path: '/files', title: 'Explorer', icon: Folder },
  EXPLORER: { path: '/explorer', title: 'Explorer', icon: Folder },
  CONNECTIONS: { path: '/connections', title: 'Cloud Connections', icon: Cable },
  SETTINGS: { path: '/settings', title: 'Settings', icon: Settings },
  ROADMAP: { path: '/roadmap', title: 'Roadmap', icon: Map },
  NOTIFICATIONS: { path: '/notifications', title: 'Notifications', icon: Bell },
  PHOTOS: { path: '/photos', title: 'Photos Gallery', icon: Image },
  SHARED: { path: '/shared', title: 'Shared Files', icon: Share2 },
  REQUESTS: { path: '/requests', title: 'File Requests', icon: Inbox },
  TRASH: { path: '/trash', title: 'Tempo Trash', icon: Trash2 },
};

/**
 * Renvoie le titre associé à un chemin donné
 * → pour usage dans usePageTitle, breadcrumbs, etc.
 */
export const getRouteTitle = (pathname = '') => {
  const route = Object.values(ROUTES).find((r) =>
    pathname === r.path || pathname.startsWith(r.path)
  );
  return route ? route.title : 'Dashboard';
};
