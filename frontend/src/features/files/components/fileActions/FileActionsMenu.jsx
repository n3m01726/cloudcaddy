// frontend/src/features/files/components/FileActionsMenu.jsx
import React from 'react';
import { Move, Copy, Trash2, X, Info } from 'lucide-react';

export default function FileActionsMenu({ file, position = { top: 200, left: 200 }, onClose, onActionClick }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 p-2"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-900">Actions sur {file.name}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="py-2 space-y-1">
          <button onClick={() => onActionClick('info')} className="action-btn"><Info className="w-4 h-4"/>Lire les informations</button>
          <button onClick={() => onActionClick('move')} className="action-btn"><Move className="w-4 h-4"/>Déplacer</button>
          <button onClick={() => onActionClick('copy')} className="action-btn"><Copy className="w-4 h-4"/>Copier le fichier</button>
          <button onClick={() => onActionClick('delete')} className="action-btn text-red-600"><Trash2 className="w-4 h-4"/>Supprimer</button>
        </div>
      </div>
    </>
  );
}
