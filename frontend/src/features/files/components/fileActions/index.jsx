// frontend/src/features/files/components/FileActions.jsx
import React, { useState } from 'react';
import FileActionsMenu from './FileActionsMenu';
import DeleteConfirmModal from './DeleteConfirmModal';
import FolderActionModal from './FolderActionModal';
import { handleMove, handleCopy, handleDelete } from './utils/files';

export default function FileActions({ file, userId, isOpen, position, onClose, onSuccess, onError, onOpenInfo }) {
  const [action, setAction] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onActionClick = (type) => {
    if (type === 'delete') setShowDeleteModal(true);
    else if (type === 'info') onOpenInfo?.();
    else {
      setAction(type);
      setShowFolderModal(true);
    }
  };

  const onFolderSelect = async (folder) => {
    if (!action) return;
    const handler = action === 'move' ? handleMove : handleCopy;
    await handler(userId, file, folder, onSuccess, onError);
    setShowFolderModal(false);
    setAction(null);
    onClose();
  };

  const onDeleteConfirm = async () => {
    await handleDelete(userId, file, onSuccess, onError);
    setShowDeleteModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <FileActionsMenu 
        file={file} 
        position={position} 
        onClose={onClose} 
        onActionClick={onActionClick} 
      />
      <FolderActionModal 
        isOpen={showFolderModal} 
        action={action} 
        file={file} 
        userId={userId} 
        onClose={() => { setShowFolderModal(false); setAction(null); }} 
        onSelect={onFolderSelect} 
      />
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        file={file} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={onDeleteConfirm} 
      />
    </>
  );
}
