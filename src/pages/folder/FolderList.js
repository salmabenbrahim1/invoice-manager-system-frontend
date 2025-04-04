import React, { useEffect, useState } from 'react';
import { useFolder } from '../../components/folder/FolderContext';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import AddFolderForm from './AddFolderForm';
import { ContextMenu, ContextMenuTrigger } from '@radix-ui/react-context-menu';
import '../../styles/folderList.css';
import FolderContextMenu from '../../components/folder/FolderContextMenu';
import SideBar from '../../components/SideBar';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';
import UpdateFolderForm from './UpdateFolderForm';
import { FaFolder } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';

const FolderList = () => {
  const { folders, handleAddFolder, handleDeleteFolder,
    archiveFolder, toggleFavorite } = useFolder();

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);


  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [favoriteFoldersState, setFavoriteFoldersState] = useState([]);


  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteFolders")) || [];
    setFavoriteFoldersState(storedFavorites);
  }, []);

  useEffect(() => {
    if (favoriteFoldersState.length > 0) {
      localStorage.setItem("favoriteFolders", JSON.stringify(favoriteFoldersState));
    }
  }, [favoriteFoldersState]);

  const handleSaveFolder = (newFolder) => {
    handleAddFolder(newFolder);
    setShowAddModal(false);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const requestDeleteFolder = (folderId, folderName) => {
    setFolderToDelete({ id: folderId, name: folderName });
    setShowConfirmModal(true);
  };

  const deleteFolder = async () => {
    if (folderToDelete) {
      await handleDeleteFolder(folderToDelete.id);
      toast.success("Folder deleted successfully.");
    } else {
      toast.info("Folder deletion canceled.");
    }
    setFolderToDelete(null);
    setShowConfirmModal(false);
  };

  const filteredFolders = folders.filter((folder) => {
    const matchesSearch =
      (folder.folderName && folder.folderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (folder.client?.name && folder.client.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleAction = (action, folderId) => {
    const folder = folders.find((f) => f._id === folderId);
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
        toggleFavorite(folderId);
        const updatedFavorites = favoriteFoldersState.some(fav => fav._id === folderId)
          ? favoriteFoldersState.filter(fav => fav._id !== folderId)
          : [...favoriteFoldersState, folder];
        setFavoriteFoldersState(updatedFavorites);
        break;
      case 'archive':
        archiveFolder(folderId);
        break;
      default:
        break;
    }
  };

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <SideBar />

      <div className="d-flex flex-column flex-grow-1 p-4">
        <Row className="d-flex justify-content-between align-items-center mb-4">
          <Col>
            <h2 className="text-2xl font-semibold">My Folders</h2>
          </Col>
          <Col xs={12} md={6} lg={4} className="d-flex justify-content-end">
            <input
              type="text"
              placeholder="Search by folder name or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 pl-10 border-2 border-gray-400 rounded-lg bg-gray-100
               shadow-md transition-all hover:bg-gray-100"
            />
          </Col>
          <Col className="text-end">
            <Button
              className="px-4 py-2 add-folder-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Folder
            </Button>
          </Col>
        </Row>

        {/* Folder List */}
        <Row className="g-4">
          {filteredFolders.length === 0 ? (
            <Col xs={12}>
              <p className="text-center text-muted">No folders found</p>
            </Col>
          ) : (
            filteredFolders.map((folder) => {
              const isFavorite = favoriteFoldersState.some((fav) => fav._id === folder._id);
              return (
                <Col xs={12} md={6} lg={4} key={folder._id}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div
                        className={`folder-item ${selectedFolder === folder ? "selected" : ""}`}
                        onClick={() => setSelectedFolder(folder)}
                      >
                        <Card
                          className={`p-3 shadow-sm ${selectedFolder === folder ? "border-secondary" : ""}`}
                          style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="folder-icon me-3">
                              <FaFolder size={40} />
                            </div>
                            <div className="folder-details">
                              <div className="folder-name fw-semibold flex items-center">
                                {folder.folderName || "Unnamed Folder"}
                                {isFavorite && <FaStar className="text-warning ms-2" />}
                              </div>
                              <div className="folder-client text-muted">
                                {folder.client?.name || "No Client"}
                              </div>
                              <div className="folder-date text-muted small">
                                {formatDate(folder.createdAt)}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </ContextMenuTrigger>

                    {/* Folder Context Menu */}
                    <FolderContextMenu
                      folderId={folder._id}
                      onAction={handleAction}
                    />
                  </ContextMenu>
                </Col>
              );
            })
          )}
        </Row>
      </div>

      {/* Add Folder Form Modal */}
      <AddFolderForm
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSave={handleSaveFolder}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={deleteFolder}
        title="Delete Folder"
        message={`Are you sure you want to delete the folder "${folderToDelete?.name}"? This action cannot be undone.`}
      />
       {/* Update Folder Form Modal */}
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
