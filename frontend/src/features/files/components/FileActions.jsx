import React, { useState } from 'react';
import { Move, Copy, Trash2, X, AlertTriangle } from 'lucide-react';
import { filesService } from '../../../core/services/api';
import FolderSelector from './FolderSelector';

export default function FileActions({ 
  file, 
  userId, 
  isOpen, 
  position = { top: 0, left: 0 },
  onClose, 
  onSuccess,
  onError 
}) {
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = (actionType) => {
    if (actionType === 'delete') {
      setShowDeleteConfirm(true);
    } else {
      setAction(actionType);
      setShowFolderSelector(true);
    }
  };

  const handleFolderSelect = async (folder) => {
    if (!action) return;

    setLoading(true);
    try {
      let response;
      
      if (action === 'move') {
        response = await filesService.moveFile(
          userId, 
          file.provider, 
          file.id, 
          folder.id
        );
      } else if (action === 'copy') {
        response = await filesService.copyFile(
          userId, 
          file.provider, 
          file.id, 
          folder.id
        );
      }

      if (response.success) {
        onSuccess?.(action, response.result);
        onClose();
      } else {
        onError?.(response.error || 'Erreur lors de l\'opération');
      }
    } catch (err) {
      console.error('Erreur lors de l\'opération:', err);
      onError?.(err.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
      setShowFolderSelector(false);
      setAction(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await filesService.deleteFile(
        userId,
        file.provider,
        file.id
      );

      if (response.success) {
        onSuccess?.('delete', response.result);
        onClose();
      } else {
        onError?.(response.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      onError?.(err.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu Actions */}
      {!showDeleteConfirm && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Actions</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="py-2">
            <button
              onClick={() => handleAction('move')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Move className="w-4 h-4 text-gray-600" />
              <span>Déplacer</span>
            </button>

            <button
              onClick={() => handleAction('copy')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4 text-gray-600" />
              <span>Copier</span>
            </button>

            <button
              onClick={() => handleAction('delete')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="px-3 py-2 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Traitement en cours...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-md"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Confirmer la suppression</h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-gray-700 mb-2">
              Êtes-vous sûr de vouloir supprimer ce fichier ?
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
              <strong>{file.name}</strong>
            </p>
            <p className="text-sm text-red-600 mt-3">
              ⚠️ Cette action est irréversible.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-2 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Suppression...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Folder Selector */}
      <FolderSelector
        isOpen={showFolderSelector}
        onClose={() => {
          setShowFolderSelector(false);
          setAction(null);
        }}
        onSelect={handleFolderSelect}
        userId={userId}
        currentProvider={file.provider}
        title={action === 'move' ? 'Déplacer vers...' : 'Copier vers...'}
      />
    </>
  );
}