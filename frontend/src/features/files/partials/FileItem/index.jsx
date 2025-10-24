// frontend/src/features/files/components/FileItem/index.jsx (ADAPTED VERSION)
import { useState } from "react";
import { RefreshCw, Download, MoreVertical, Tag as TagIcon, Check } from "lucide-react";
import { formatFileSize } from "@shared/utils/formatters";
import FilePreviewModal from "@features/files/partials/FilePreview";
import FileActions from "@features/files/components/FileActions";
import TagManager from "@features/tagManager/components/TagManager";
import TagBadge from "@features/tagManager/components/TagBadge";

import { useFileMetadata } from "./hooks/useFileMetadata";
import { useFileActionsMenu } from "./hooks/useFileActionsMenu";
import { getFileIcon } from "./utils/FileIcons";
import { useSelection } from "@features/files/context/SelectionContext"; // 🆕 NEW

export default function FileItem({
  file,
  userId,
  onFolderClick,
  onDownload,
  downloading,
  onFileMoved,
  onFileCopied,
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);

  // 🆕 Selection context
  const { isSelectionMode, isFileSelected, toggleFileSelection } = useSelection();
  const isSelected = isFileSelected(file.id);

  const { metadata, setMetadata, loading, loadMetadata } = useFileMetadata(file, userId);
  const { position, visible, setVisible, openAtCursor, openAtButton } = useFileActionsMenu();

  const Icon = getFileIcon(file);

  const handleActionSuccess = (action, result) => {
    if (action === "move") onFileMoved?.(file, result);
    else if (action === "copy") onFileCopied?.(file, result);
    else if (action === "delete") onFileMoved?.();
  };

  const handleActionError = (err) => alert(`Erreur: ${err}`);

  const handleMetadataUpdate = (newData) => setMetadata(newData);

  const handleCloseTagManager = async () => {
    setShowTagManager(false);
    await new Promise((r) => setTimeout(r, 300));
    await loadMetadata();
    onFileMoved?.();
  };

  // 🆕 Handle row click with selection support
  const handleRowClick = (e) => {
    // If in selection mode or using modifier keys, toggle selection
    if (isSelectionMode || e.shiftKey || e.metaKey || e.ctrlKey) {
      e.preventDefault();
      toggleFileSelection(file.id);
      return;
    }

    // Normal click behavior
    if (file.type === "folder") {
      onFolderClick(file);
    } else {
      setShowPreview(true);
    }
  };

  // 🆕 Handle checkbox click
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    toggleFileSelection(file.id);
  };

  const displayName = metadata?.customName || file.name;
  const tags = metadata?.tags || [];
  const tagColors = metadata?.tagColors || {};
  const starred = metadata?.starred || false;

  return (
    <>
      <div
        className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group ${
          file.type === "folder" ? "cursor-pointer" : ""
        } ${
          starred
            ? "ring-2 ring-yellow-200 bg-yellow-50 border-yellow-200 hover:bg-yellow-50 hover:ring-yellow-300 hover:border-yellow-100"
            : ""
        } ${
          isSelected
            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-400"
            : ""
        }`}
        onClick={handleRowClick}
        onContextMenu={openAtCursor}
      >
        {/* 🆕 SELECTION CHECKBOX - Left side */}
        <div className="flex items-center mr-3 bg-gray-100">
          {(isSelectionMode || isSelected) ? (
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxClick}
                onClick={(e) => e.stopPropagation()}
                className="sr-only peer"
              />
              <div className={`
                w-5 h-5 border-2 rounded transition-all flex-shrink-0
                ${isSelected 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 hover:border-blue-400'}
                flex items-center justify-center
              `}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
            </label>
          ) : (
            <div 
              className="w-5 h-5 border-2 border-transparent rounded opacity-0 group-hover:opacity-100 hover:border-gray-300 transition-all flex-shrink-0"
              onClick={handleCheckboxClick}
            />
          )}
        </div>

        {/* SECTION GAUCHE — nom + tags + infos */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon
            className={`w-8 h-8 ${
              file.type === "folder" ? "text-blue-500" : "text-gray-400"
            } flex-shrink-0`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{displayName}</h3>
              {loading && (
                <RefreshCw className="w-3 h-3 text-gray-400 animate-spin flex-shrink-0" />
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag) => (
                    <TagBadge
                      key={tag}
                      tag={tag}
                      size="sm"
                      color={tagColors[tag] || "blue"}
                    />
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-0.5">
                      +{tags.length - 3} autres
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              {file.type !== "folder" && (
                <span>{file.size ? formatFileSize(file.size) : "N/A"}</span>
              )}
              <span>Modifié le: {new Date(file.modifiedTime).toLocaleDateString()}</span>
            </div>

            {metadata?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                {metadata.description}
              </p>
            )}
          </div>
        </div>

        {/* SECTION DROITE — boutons */}
        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTagManager(true);
            }}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            title="Gérer les tags"
          >
            <TagIcon className="w-5 h-5" />
          </button>

          {file.type !== "folder" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file);
              }}
              disabled={downloading === file.id}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-100"
              title="Télécharger"
            >
              {downloading === file.id ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={openAtButton}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Plus d'actions"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* === MODALES === */}

      {showPreview && (
        <FilePreviewModal
          file={file}
          userId={userId}
          onClose={() => setShowPreview(false)}
          onDownload={onDownload}
        />
      )}

      {visible && (
        <FileActions
          file={file}
          userId={userId}
          isOpen={visible}
          position={position}
          onClose={() => setVisible(false)}
          onSuccess={handleActionSuccess}
          onError={handleActionError}
          onOpenInfo={() => {
            setVisible(false);
            setShowTagManager(true);
          }}
        />
      )}

      {showTagManager && (
        <TagManager
          file={file}
          userId={userId}
          isOpen={showTagManager}
          onClose={handleCloseTagManager}
          onUpdate={handleMetadataUpdate}
        />
      )}
    </>
  );
}