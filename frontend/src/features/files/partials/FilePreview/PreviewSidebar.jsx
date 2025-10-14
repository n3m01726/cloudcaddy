// ============================================
// PreviewSidebar.jsx (~130 lignes)
// ============================================
import { X, HardDrive, Calendar, Tag, Star } from 'lucide-react';
import { formatFileSize, formatDate } from './utils/formatters';

/**
 * Sidebar de métadonnées du fichier
 * Affiche toutes les informations détaillées : taille, date, tags, description, etc.
 */
export default function PreviewSidebar({ 
  file, 
  metadata, 
  onClose 
}) {
  const tags = metadata?.tags || [];
  const hasCustomName = metadata?.customName && metadata.customName !== file.name;

  return (
    <div className="w-1/3 border-l bg-gray-50 p-4 overflow-auto">
      {/* Header de la sidebar */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Détails</h4>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          title="Masquer les détails"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contenu des métadonnées */}
      <div className="space-y-4">
        {/* Taille du fichier */}
        {file.size && (
          <MetadataItem
            icon={<HardDrive className="w-4 h-4" />}
            label="Taille"
            value={formatFileSize(file.size)}
          />
        )}

        {/* Date de modification */}
        {file.modifiedTime && (
          <MetadataItem
            icon={<Calendar className="w-4 h-4" />}
            label="Modifié le"
            value={formatDate(file.modifiedTime)}
          />
        )}

        {/* Provider (source cloud) */}
        <MetadataItem
          icon={<ProviderIcon provider={file.provider} />}
          label="Source"
          value={formatProviderName(file.provider)}
        />

        {/* Type de fichier */}
        <MetadataItem
          label="Type"
          value={`${file.name.split('.').pop().toUpperCase()} ${file.type === 'folder' ? 'Dossier' : 'Fichier'}`}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {tags.map((tag, idx) => (
                <TagBadge 
                  key={idx} 
                  tag={tag} 
                  color={metadata?.tagColors?.[tag] || 'blue'} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Description complète */}
        {metadata?.description && (
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <span className="text-sm font-medium">Description</span>
            </div>
            <p className="text-sm text-gray-700 pl-6 whitespace-pre-wrap">
              {metadata.description}
            </p>
          </div>
        )}

        {/* Nom original (si renommé) */}
        {hasCustomName && (
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <span className="text-sm font-medium">Nom original</span>
            </div>
            <p className="text-sm text-gray-700 pl-6 break-words">
              {file.name}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================
// Composants utilitaires internes
// ============================================

/**
 * Item de métadonnée générique (icône + label + valeur)
 */
function MetadataItem({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-600 mb-1">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-sm text-gray-900 pl-6">{value}</p>
    </div>
  );
}

/**
 * Badge de tag avec couleur
 */
function TagBadge({ tag, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <span 
      className={`px-2 py-1 rounded text-xs border ${colorClasses[color] || colorClasses.blue}`}
    >
      {tag}
    </span>
  );
}

/**
 * Icône du provider cloud
 */
function ProviderIcon({ provider }) {
  // Mapping des couleurs par provider
  const providerColors = {
    google_drive: 'from-blue-500 to-purple-500',
    dropbox: 'from-blue-400 to-blue-600',
    mega: 'from-red-500 to-orange-500',
    onedrive: 'from-blue-500 to-cyan-500'
  };

  const gradient = providerColors[provider] || 'from-gray-400 to-gray-600';

  return (
    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${gradient}`} />
  );
}

/**
 * Formate le nom du provider pour affichage
 */
function formatProviderName(provider) {
  const names = {
    google_drive: 'Google Drive',
    dropbox: 'Dropbox',
    mega: 'MEGA',
    onedrive: 'OneDrive'
  };

  return names[provider] || provider?.replace('_', ' ') || 'Inconnu';
}
