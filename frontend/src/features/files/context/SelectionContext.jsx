import { createContext, useContext, useState, useCallback } from 'react';

const SelectionContext = createContext(null);

export const SelectionProvider = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Toggle selection for a single file
  const toggleFileSelection = useCallback((fileId) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      
      // Exit selection mode if no files selected
      if (newSet.size === 0) {
        setIsSelectionMode(false);
      } else if (!isSelectionMode) {
        setIsSelectionMode(true);
      }
      
      return newSet;
    });
  }, [isSelectionMode]);

  // Select all files
  const selectAll = useCallback((fileIds) => {
    setSelectedFiles(new Set(fileIds));
    setIsSelectionMode(true);
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
    setIsSelectionMode(false);
  }, []);

  // Check if a file is selected
  const isFileSelected = useCallback((fileId) => {
    return selectedFiles.has(fileId);
  }, [selectedFiles]);

  // Get selected file objects from the list
  const getSelectedFileObjects = useCallback((allFiles) => {
    return allFiles.filter(file => selectedFiles.has(file.id));
  }, [selectedFiles]);

  const value = {
    selectedFiles,
    selectedCount: selectedFiles.size,
    isSelectionMode,
    toggleFileSelection,
    selectAll,
    clearSelection,
    isFileSelected,
    getSelectedFileObjects,
    setIsSelectionMode
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

// Custom hook to use selection context
export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};