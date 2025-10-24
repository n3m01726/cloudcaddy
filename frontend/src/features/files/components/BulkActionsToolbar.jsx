// frontend/src/features/files/components/BulkActionsToolbar.jsx
import { useState } from 'react';
import { useSelection } from '../context/SelectionContext';
import { FolderPlus, X, Download, Trash2, Tag, Move } from 'lucide-react';
import { Button } from '@/shared/components';

const BulkActionsToolbar = ({ files, onCreateFolder, onBulkTag, onBulkMove, onBulkDelete, onBulkDownload }) => {
  const { selectedCount, clearSelection, getSelectedFileObjects } = useSelection();

  if (selectedCount === 0) return null;

  const selectedFiles = getSelectedFileObjects(files);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl border-t border-blue-500 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Selection info */}
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-semibold text-lg">
                {selectedCount} {selectedCount === 1 ? 'fichier sélectionné' : 'fichiers sélectionnés'}
              </span>
            </div>
            
            <button
              onClick={clearSelection}
              className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
              title="Désélectionner tout"
            >
              <X size={20} />
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Create Folder */}
            <Button
              onClick={() => onCreateFolder(selectedFiles)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all hover:scale-105"
            >
              <FolderPlus size={20} />
              Créer un dossier
            </Button>

            {/* Download All */}
            <button
              onClick={() => onBulkDownload?.(selectedFiles)}
              className="text-white hover:bg-white/10 rounded-lg p-2.5 transition-all"
              title="Télécharger la sélection"
            >
              <Download size={20} />
            </button>

            {/* Move/Transfer */}
            <button
              onClick={() => onBulkMove?.(selectedFiles)}
              className="text-white hover:bg-white/10 rounded-lg p-2.5 transition-all"
              title="Déplacer vers..."
            >
              <Move size={20} />
            </button>

            {/* Tag */}
            <button
              onClick={() => onBulkTag?.(selectedFiles)}
              className="text-white hover:bg-white/10 rounded-lg p-2.5 transition-all"
              title="Ajouter des tags"
            >
              <Tag size={20} />
            </button>

            {/* Delete */}
            <button
              onClick={() => onBulkDelete?.(selectedFiles)}
              className="text-red-200 hover:bg-red-500/20 rounded-lg p-2.5 transition-all"
              title="Supprimer la sélection"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
