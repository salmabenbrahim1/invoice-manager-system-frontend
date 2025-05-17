import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaFolder, FaStar, FaSearch, FaRegCalendarAlt } from 'react-icons/fa';
import { ContextMenu, ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { toast } from 'react-toastify';

import { useFolder } from '../../context/FolderContext';
import { useClient } from '../../context/ClientContext';
import { useAuth } from '../../context/AuthContext';

import SidebarAccountant from '../../components/accountant/SidebarAccountant';
import AddFolderForm from '../../components/folder/AddFolderForm';
import InternalAddFolderForm from '../../components/folder/InternalAddFolderForm';
import FolderContextMenu from '../../components/folder/FolderContextMenu';
import ConfirmModal from '../../components/modals/ConfirmModal';
import UpdateFolderForm from '../../components/folder/UpdateFolderForm';

import '../../styles/folderList.css';

const FolderList = () => {
  const { folders, archiveFolder, toggleFavorite, fetchFolders, deleteFolder } = useFolder();
  const { clients, fetchAccountantClients } = useClient();
  const { user } = useAuth();

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch clients for the internal accountant
    if (user?.id) fetchAccountantClients(user.id);
  }, [user, fetchAccountantClients]);

  useEffect(() => {
    // Fetch folders from API
    fetchFolders();
  }, []);

  const handleSaveFolder = (createdFolder) => {
    setShowAddModal(false);
    toast.success(`Folder "${createdFolder.folderName}" created successfully.`);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const requestDeleteFolder = (id, name) => {
    setFolderToDelete({ id, name });
    setShowConfirmModal(true);
  };

  const handleDeleteFolder = async () => {
    if (folderToDelete) {
      await deleteFolder(folderToDelete.id);
      toast.success('Folder deleted successfully.');
    }
    setFolderToDelete(null);
    setShowConfirmModal(false);
  };

  const handleAction = async (action, folderId) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    switch (action) {
      case 'delete':
        requestDeleteFolder(folderId, folder.folderName);
        break;
      case 'modify':
        setFolderToEdit(folder);
        setShowEditModal(true);
        break;
      case 'favorite':
        await toggleFavorite(folderId);
        await fetchFolders();
        break;
      case 'archive':
        archiveFolder(folderId);
        break;
      default:
        break;
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId);
    navigate(`/my-folders/${folderId}/invoices`);
  };

  const filteredFolders = folders.filter((folder) => {
    const matchesSearch =
      (folder.folderName && folder.folderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (folder.client?.name && folder.client.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch && !folder.archived;
  });

  return (
    <Container fluid className="flex h-screen vh-100 p-0">
      <SidebarAccountant />

      <div className="flex flex-col flex-grow p-6 overflow-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold">My Folders</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-md"
              />
            </div>
            <button
              className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition duration-200 add-folder-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Folder
            </button>
          </div>
        </div>

        <Row className="g-4">
          {filteredFolders.length === 0 ? (
            <Col xs={12}>
              <p className="text-center text-muted">No folders found</p>
            </Col>
          ) : (
            filteredFolders.map((folder) => (
              <Col xs={12} md={6} lg={4} key={folder.id}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div
                      className={`folder-item ${selectedFolder === folder.id ? 'selected' : ''}`}
                      onClick={() => handleFolderClick(folder.id)}
                    >
                      <Card
                        className={`p-3 shadow-sm ${selectedFolder === folder.id ? 'border-secondary' : ''}`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      >
                        <div className="d-flex align-items-center">
                          <div className="folder-icon me-3">
                            <FaFolder size={40} />
                          </div>
                          <div className="folder-details">
                            <div className="folder-name fw-semibold flex items-center">
                              {folder.folderName || 'Unnamed Folder'}
                              {folder.favorite && <FaStar className="text-warning ms-2" />}
                            </div>
                            <div className="folder-client text-muted">
                              {folder.client?.name || 'No Client'}
                            </div>
                            <div className="d-flex align-items-center text-muted small mt-2">
                              <span className="me-4 d-flex align-items-center">
                                <FaRegCalendarAlt className="me-1" />
                                {formatDate(folder.createdAt)}
                              </span>
                              <span className="me-2">•</span>
                              <span>Invoices: {folder.invoiceCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </ContextMenuTrigger>

                  <FolderContextMenu folderId={folder.id} onAction={handleAction} />
                </ContextMenu>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* Add Folder Modal */}
      {user?.role === 'INTERNAL_ACCOUNTANT' ? (
        <InternalAddFolderForm
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSave={(folder) => console.log('New folder:', folder)}
          clients={clients}
        />
      ) : (
        <AddFolderForm
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSave={handleSaveFolder}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        title="Delete Folder"
        message={`Are you sure you want to delete the folder "${folderToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteFolder}
      />

      {/* Edit Folder Modal */}
      {showEditModal && folderToEdit && (
        <UpdateFolderForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          folderData={folderToEdit}
        />
      )}
    </Container>
  );
};

export default FolderList;
