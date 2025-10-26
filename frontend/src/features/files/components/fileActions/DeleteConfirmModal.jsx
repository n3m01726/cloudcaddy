import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, file, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-md p-4">
      <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
        <div className="p-2 bg-red-100 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
        <h3 className="font-semibold text-gray-900">Confirmer la suppression</h3>
        <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700"><X className="w-4 h-4"/></button>
      </div>
      <p className="py-4 text-gray-700">Êtes-vous sûr de vouloir supprimer <strong>{file.name}</strong> ?</p>
      <div className="flex justify-end space-x-2 border-t border-gray-200 pt-3">
        <button onClick={onClose} className="px-4 py-2 border rounded-lg">Annuler</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2">
          <Trash2 className="w-4 h-4"/>Supprimer
        </button>
      </div>
    </div>
  );
}
