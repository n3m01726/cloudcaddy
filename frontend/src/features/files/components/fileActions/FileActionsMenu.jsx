// frontend/src/features/files/components/FileActionsMenu.jsx
import React from 'react';
import { Move, Copy, Trash2, X, Info, FolderPlus, FolderUp, FileUp } from 'lucide-react';

export default function FileActionsMenu({ file, position = { top: 200, left: 200 }, onClose, onActionClick }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-56"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >

        <div className="flex flex-col py-2">
          <button onClick={() => onActionClick('info')} className="flex items-center gap-2 px-3 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left">
            <FolderPlus className="w-5 h-5" />Nouveau dossier
          </button>
<div className='flex flex-col mt-2 mb-2 border-y border-gray-300 py-1'>
          <button onClick={() => onActionClick('info')} className="flex items-center gap-2 px-3 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left">
            <FileUp className="w-5 h-5" /> importer des fichiers
          </button>
          <button onClick={() => onActionClick('info')} className="flex items-center gap-2 px-3 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left">
            <FolderUp className="w-5 h-5" /> Importer un dossier
          </button>
</div>
<div className='flex flex-col mb-2 border-b border-gray-300 pb-1'>
          <button onClick={() => onActionClick('info')} className="flex items-center gap-2 px-3 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left">
            <Info className="w-5 h-5" /> Lire les informations
          </button>
          <button onClick={() => onActionClick('move')} className="flex items-center gap-2 px-3 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left">
            <Move className="w-5 h-5" /> Déplacer
          </button>
          <button onClick={() => onActionClick('copy')} className="flex items-center gap-2 px-3 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left">
            <Copy className="w-5 h-5" /> Copier
          </button>
</div>          
          <button onClick={() => onActionClick('delete')} className="flex items-center gap-2 px-3 py-2 text-md text-red-600 hover:bg-red-50 w-full text-left">
            <Trash2 className="w-5 h-5" /> Supprimer
          </button>




        </div>
      </div>
    </>
  );
}


<div className='mt-2 mb-2 border-b border-gray-600'>
  <button>test 1</button> 
  <button>test 2</button>
</div>