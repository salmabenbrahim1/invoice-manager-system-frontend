import React, { useEffect, useState } from 'react';
import { useFolder } from '../../context/FolderContext';
import { Container, Row, Col, Card } from 'react-bootstrap';
import SidebarAccountant from '../../components/accountant/SidebarAccountant';
import AddFolderForm from '../../components/folder/AddFolderForm';
import { ContextMenu, ContextMenuTrigger } from '@radix-ui/react-context-menu';
import '../../styles/folderList.css';
import FolderContextMenu from '../../components/folder/FolderContextMenu';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { toast } from 'react-toastify';
import UpdateFolderForm from '../../components/folder/UpdateFolderForm';
import { FaFolder, FaStar, FaSearch} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FolderList = () => {
  const { folders, handleDeleteFolder, archiveFolder, toggleFavorite } = useFolder();
  
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [favoriteFolders, setFavoriteFolders] = useState([]);

  const navigate = useNavigate(); 

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteFolders")) || [];
    setFavoriteFolders(storedFavorites);
  }, []);

  useEffect(() => {
    if (favoriteFolders.length > 0) {
      localStorage.setItem("favoriteFolders", JSON.stringify(favoriteFolders));
    }
  }, [favoriteFolders]);

  const handleSaveFolder = (createdFolder) => {
    setShowAddModal(false);
    toast.success(`Folder "${createdFolder.folderName}" created successfully.`);
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
        toggleFavorite(folderId);
        const updatedFavorites = favoriteFolders.some(fav => fav.id === folderId)
          ? favoriteFolders.filter(fav => fav.id !== folderId)
          : [...favoriteFolders, folder];
        setFavoriteFolders(updatedFavorites);
        break;
      case 'archive':
        archiveFolder(folderId);
        break;
      default:
        break;
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId); // Set the selected folder

    // Navigate to the invoice list for the clicked folder
    navigate(`/my-folders/${folderId}/invoices`);
  };

  return (
    <Container fluid className="flex h-screen vh-100 p-0">
      <SidebarAccountant />

      <div className="flex flex-col flex-grow p-6 overflow-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-semibold">My Folders</h2>
          </div>
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
            <div>
              <button
                className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition duration-200 add-folder-button"
                onClick={() => setShowAddModal(true)}
              >
                + Add Folder
              </button>
            </div>
          </div>
        </div>

        {/* Folder List */}
        <Row className="g-4">
          {filteredFolders.length === 0 ? (
            <Col xs={12}>
              <p className="text-center text-muted">No folders found</p>
            </Col>
          ) : (
            filteredFolders.map((folder) => {
              const isFavorite = favoriteFolders.some((fav) => fav.id === folder.id);
              return (
                <Col xs={12} md={6} lg={4} key={folder.id}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div
                        className={`folder-item ${selectedFolder === folder ? "selected" : ""}`}
                        onClick={() => handleFolderClick(folder.id)} 
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
                      folderId={folder.id}
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
