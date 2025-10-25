import React, { useState } from 'react';
import { Move, Copy, Trash2, X, AlertTriangle, Info } from 'lucide-react';
import { filesService } from '@core/services/api';
import FolderSelector from '@features/files/components/FolderSelector';

export default function FileActions({ 
  file, 
  userId, 
  isOpen, 
  position = { top: 200, left: 200 },
  onClose, 
  onSuccess,
  onError,
  onOpenInfo
}) {
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const validateParams = (actionType, folder) => {
    if (!userId || !file?.provider || !file?.id) {
      setErrorMessage("Paramètres invalides : utilisateur ou fichier manquant.");
      return false;
    }
    if (actionType !== 'delete' && !folder?.id) {
      setErrorMessage("Aucun dossier sélectionné pour l'opération.");
      return false;
    }
    return true;
  };

  const handleAction = (actionType) => {
    setErrorMessage(null);
    if (actionType === 'delete') {
      setShowDeleteConfirm(true);
    } else if (actionType === 'info') {
      onOpenInfo?.();
      onClose();
    } else {
      setAction(actionType);
      setShowFolderSelector(true);
    }
  };

  const handleFolderSelect = async (folder) => {
    if (!action || !validateParams(action, folder)) return;

    setLoading(true);
    try {
      let response;
      
      if (action === 'move') {
        response = await filesService.moveFile(
          userId, 
          file.provider, 
          file.id, 
          folder.id,
          { oldParentId: file.parents?.[0] }
        );
      } else if (action === 'copy') {
        response = await filesService.copyFile(
          userId, 
          file.provider, 
          file.id, 
          folder.id,
          {} // Passer un objet vide pour options
        );
      }

      if (response.success) {
        onSuccess?.(action, response.result);
        onClose();
      } else {
        const errorMsg = response.error || `Erreur lors de l'opération ${action}.`;
        setErrorMessage(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      console.error(`Erreur lors de l'opération ${action}:`, err);
      const errorMsg = err.response?.status === 500 
        ? "Erreur serveur : impossible de traiter l'opération. Veuillez réessayer plus tard."
        : err.message || "Erreur inattendue lors de l'opération.";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
      setShowFolderSelector(false);
      setAction(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!validateParams('delete')) return;

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
        const errorMsg = response.error || "Erreur lors de la suppression.";
        setErrorMessage(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const errorMsg = err.response?.status === 500 
        ? "Erreur serveur : impossible de supprimer le fichier. Veuillez réessayer plus tard."
        : err.message || "Erreur inattendue lors de la suppression.";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Menu Actions */}
      {!showDeleteConfirm && (
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

          {errorMessage && (
            <div className="px-3 py-2 bg-red-50 border-b border-red-200 flex items-center space-x-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="py-2 space-y-1">
            <button
              onClick={() => handleAction('info')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              <Info className="w-4 h-4" />
              <span>Lire les informations</span>
            </button>

            <button
              onClick={() => handleAction('move')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              <Move className="w-4 h-4" />
              <span>Déplacer</span>
            </button>

            <button
              onClick={() => handleAction('copy')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              <Copy className="w-4 h-4" />
              <span>Copier</span>
            </button>

            <button
              onClick={() => handleAction('delete')}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>

          {loading && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex items-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Traitement en cours...</span>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-md p-4"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Confirmer la suppression</h3>
            </div>
            <button onClick={() => setShowDeleteConfirm(false)} className="ml-auto text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4">
            <p className="text-gray-700 mb-2">
              Êtes-vous sûr de vouloir supprimer ce fichier ?
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
              <strong>{file.name}</strong>
            </p>
            <p className="text-sm text-red-600 mt-3">
              ⚠️ Cette action est irréversible. Le fichier sera définitivement supprimé.
            </p>
            {errorMessage && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                <AlertTriangle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 border-t border-gray-200 pt-3 bg-gray-50">
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