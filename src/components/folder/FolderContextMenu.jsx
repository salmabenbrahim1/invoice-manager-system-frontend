import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from '@radix-ui/react-context-menu';
import { 
  FaTrash, 
  FaEdit, 
  FaStar, 
  FaArchive, 
  FaFolderOpen,
  FaUserTie 
} from 'react-icons/fa';
import '../../styles/contextMenu.css';

const FolderContextMenu = ({ folderId, onAction }) => {
  return (
    <ContextMenuContent className="context-menu">
      <ContextMenuItem 
        className="react-contextmenu-item"
        onSelect={() => onAction('modify', folderId)}
      >
        <FaEdit className="menu-icon" /> Modify
      </ContextMenuItem>
      <ContextMenuItem 
        className="react-contextmenu-item"
        onSelect={() => onAction('favorite', folderId)}
      >
        <FaStar className="menu-icon" /> Favorite
      </ContextMenuItem>
      <ContextMenuItem 
        className="react-contextmenu-item"
        onSelect={() => onAction('archive', folderId)}
      >
        <FaArchive className="menu-icon" /> Archive
      </ContextMenuItem>
      <ContextMenuSeparator className="context-menu-separator" />
      <ContextMenuItem 
        className="react-contextmenu-item"
        onSelect={() => onAction('details', folderId)}
      >
        <FaFolderOpen className="menu-icon" /> Details
      </ContextMenuItem>
      <ContextMenuItem 
        className="react-contextmenu-item"
        onSelect={() => onAction('clientInfo', folderId)}
      >
        <FaUserTie className="menu-icon" /> Client Info
      </ContextMenuItem>
      <ContextMenuSeparator className="context-menu-separator" />
      <ContextMenuItem 
        className="react-contextmenu-delete-item danger-item"
        onSelect={() => onAction('delete', folderId)}
      >
        <FaTrash className="menu-icon" /> Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default FolderContextMenu;