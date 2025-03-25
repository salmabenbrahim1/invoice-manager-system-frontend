import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { FaTrash, FaEdit, FaStar, FaArchive, FaFolderOpen } from 'react-icons/fa';
import '../../styles/contextMenu.css';

const FolderContextMenu = ({ folderId, onAction }) => {
  return (
    <ContextMenu id={`folder-${folderId}`} className="context-menu">
      <MenuItem onClick={() => onAction('delete', folderId)}>
        <FaTrash color="red" /> Delete
      </MenuItem>
      <MenuItem onClick={() => onAction('modify', folderId)}>
        <FaEdit color="blue" /> Modify
      </MenuItem>
      <MenuItem onClick={() => onAction('favorite', folderId)}>
        <FaStar color="gold" /> Add to Favorites
      </MenuItem>
      <MenuItem onClick={() => onAction('archive', folderId)}>
        <FaArchive color="black" /> Archive
      </MenuItem>
      <MenuItem onClick={() => onAction('details', folderId)}>
        <FaFolderOpen color="gray" /> Folder Details
      </MenuItem>
    </ContextMenu>
  );
};

export default FolderContextMenu;