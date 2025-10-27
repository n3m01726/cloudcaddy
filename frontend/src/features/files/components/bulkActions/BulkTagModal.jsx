// frontend/src/features/files/components/BulkTagModal.jsx
import { useState } from 'react';
import { X, Tag, Loader2, Plus } from 'lucide-react';
import { Button, Input } from '@/shared/components';

const BulkTagModal = ({ isOpen, onClose, selectedFiles, onConfirm }) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tags.length === 0) return;

    setIsProcessing(true);
    try {
      await onConfirm({ tags, files: selectedFiles });
      setTags([]);
      setInputValue('');
      onClose();
    } catch (error) {
      console.error('Error adding tags:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setTags([]);
      setInputValue('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Tag className="text-indigo-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ajouter des tags</h2>
              <p className="text-sm text-gray-500">
                {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''} sélectionné{selectedFiles.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tag Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ajouter des tags
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Entrez un tag"
                disabled={isProcessing}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          {/* Tags Display */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags à appliquer
              </label>
              <div className="flex flex-wrap gap-2 bg-gray-50 rounded-lg p-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isProcessing}
                      className="hover:text-indigo-900 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Selected Files Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fichiers concernés
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
              disabled={isProcessing}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={tags.length === 0 || isProcessing}
              className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Application...
                </>
              ) : (
                <>
                  <Tag size={18} />
                  Appliquer les tags
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkTagModal;