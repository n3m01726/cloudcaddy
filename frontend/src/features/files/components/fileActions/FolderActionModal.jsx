import React from 'react';
import FolderSelector from '../bulkActions/FolderSelector';

export default function FolderActionModal({ isOpen, action, file, userId, onClose, onSelect }) {
  if (!isOpen) return null;
  return (
    <FolderSelector
      isOpen={isOpen}
      title={action === 'move' ? 'Déplacer vers...' : 'Copier vers...'}
      currentProvider={file.provider}
      userId={userId}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
}
