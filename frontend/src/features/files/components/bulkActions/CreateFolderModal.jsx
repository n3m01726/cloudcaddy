// frontend/src/features/files/components/CreateFolderModal.jsx
import { useState } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components';
import { Input } from '@/shared/components';

const CreateFolderModal = ({ isOpen, onClose, selectedFiles, onConfirm }) => {
  const [folderName, setFolderName] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('google');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsCreating(true);
    try {
      await onConfirm({
        folderName: folderName.trim(),
        provider: selectedProvider,
        files: selectedFiles
      });
      
      // Reset and close
      setFolderName('');
      setSelectedProvider('google');
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFolderName('');
      setSelectedProvider('google');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FolderPlus className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Créer un dossier</h2>
              <p className="text-sm text-gray-500">
                {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''} sélectionné{selectedFiles.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Folder Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du dossier
            </label>
            <Input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Mon nouveau dossier"
              disabled={isCreating}
              autoFocus
              className="w-full"
            />
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Créer dans
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedProvider('google')}
                disabled={isCreating}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${selectedProvider === 'google'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'}
                  disabled:opacity-50
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded"></div>
                  <span className="font-semibold">Google Drive</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('dropbox')}
                disabled={isCreating}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${selectedProvider === 'dropbox'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'}
                  disabled:opacity-50
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded"></div>
                  <span className="font-semibold">Dropbox</span>
                </div>
              </button>
            </div>
          </div>

          {/* Selected Files Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fichiers à déplacer
            </label>
            <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
              {selectedFiles.slice(0, 5).map((file, index) => (
                <div key={index} className="text-sm text-gray-600 py-1">
                  • {file.name}
                </div>
              ))}
              {selectedFiles.length > 5 && (
                <div className="text-sm text-gray-500 py-1 font-medium">
                  ... et {selectedFiles.length - 5} autre{selectedFiles.length - 5 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!folderName.trim() || isCreating}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <FolderPlus size={18} />
                  Créer le dossier
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;