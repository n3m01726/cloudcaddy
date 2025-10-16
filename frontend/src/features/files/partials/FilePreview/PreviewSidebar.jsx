import { X, HardDrive, Calendar, Tag } from 'lucide-react';

import { formatFileSize } from "@features/files/utils/formatFileSize";
import { formatDate } from "@features/files/utils/formatDate";

/**
* Sidebar de métadonnées du fichier - RESPONSIVE
* Sur mobile: Modal en bas, sur desktop: sidebar à droite
*/
export default function PreviewSidebar({ 
  file, 
  metadata, 
  onClose 
}) {
  const tags = metadata?.tags || [];
  const hasCustomName = metadata?.customName && metadata.customName !== file.name;

  return (
    <div className="w-full h-full border-l bg-gray-50 p-4 overflow-auto">
      {/* Header de la sidebar */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-50 pb-2 border-b lg:border-none">
        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Détails</h4>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          title="Masquer les détails"
        >
          <X className="w-5 h-5" />
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
            <p className="text-sm text-gray-700 pl-6 whitespace-pre-wrap break-words">
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
      <p className="text-sm text-gray-900 pl-6 break-words">{value}</p>
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