import React, { useState, useEffect } from "react";
import { folderService } from '../../services/FolderService';
import { Container } from "react-bootstrap";
import { FaFolder, FaSearch, FaFileAlt, FaTrash, FaStar } from "react-icons/fa";
import SidebarAccountant from "../../components/accountant/SidebarAccountant";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "../../components/modals/ConfirmModal";

const Favorites = () => {
  const [favoriteFolders, setFavoriteFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteFolders();
  }, []);

  const fetchFavoriteFolders = async () => {
    setIsLoading(true);
    try {
      const allFolders = await folderService.getMyFolders();
      const favorites = allFolders.filter(folder => folder.favorite === true && !folder.archived);
      setFavoriteFolders(favorites);
    } catch (error) {
      console.error("Error loading favorite folders:", error);
      toast.error("Failed to load favorite folders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (folderId, e) => {
    e.stopPropagation();
    try {
      await folderService.unmarkAsFavorite(folderId);
      setFavoriteFolders(prev => prev.filter(folder => folder.id !== folderId));
      toast.success("Removed from favorites!");
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const handleDeleteClick = (folderId, e) => {
    e.stopPropagation();
    setFolderToDelete(folderId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await folderService.deleteFolder(folderToDelete);
      setFavoriteFolders(prev => prev.filter(folder => folder.id !== folderToDelete));
      toast.success("Folder deleted successfully!");
      if (selectedFolder?.id === folderToDelete) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    } finally {
      setShowDeleteModal(false);
      setFolderToDelete(null);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    navigate(`/favorites/${folder.id}/invoices`);
  };

  const filteredFolders = favoriteFolders.filter(folder => {
    const nameMatch = folder.folderName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const clientMatch = folder.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    return nameMatch || clientMatch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container fluid className="d-flex vh-100 p-0 bg-gray-50">
      <SidebarAccountant />

      <div className="d-flex flex-column flex-grow-1 p-4 overflow-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="h3 fw-bold text-dark mb-2 d-flex align-items-center">
            <FaStar className="text-warning me-2" />
            Favorite Folders
          </h2>

          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFolders.length > 0 ? (
              filteredFolders.map(folder => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border bg-white rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 ${selectedFolder?.id === folder.id
                      ? "border-yellow-400 ring-2 ring-yellow-100"
                      : "border-gray-200"
                    }`}
                >
                  <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                    <div className={`p-3 rounded-lg ${folder.favorite ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <FaFolder size={24} />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800">
                          {folder.folderName || "Unnamed folder"}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        Client: {folder.client?.name || "No client specified"}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>Created: {formatDate(folder.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                    <button
                      className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 flex items-center gap-2 transition-colors"
                      onClick={(e) => handleRemoveFromFavorites(folder.id, e)}
                    >
                      <FaStar size={14} />
                      <span>Unfavorite</span>
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center gap-2 transition-colors"
                      onClick={(e) => handleDeleteClick(folder.id, e)}
                    >
                      <FaTrash size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <FaFolder className="mx-auto text-gray-300" size={48} />
                <p className="mt-4 text-gray-500">
                  {searchQuery
                    ? "No folders match your search criteria"
                    : "No favorite folders found"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selected Folder Details */}
        {selectedFolder && (
          <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedFolder.folderName || "Folder Details"}
                </h3>
                <p className="text-gray-600">
                  Client: {selectedFolder.client?.name || "No client specified"}
                </p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Favorite
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Creation Date</h4>
                <p>{formatDate(selectedFolder.createdAt)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Documents</h4>
              {selectedFolder.documents?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {selectedFolder.documents.map((doc, index) => (
                    <li key={index} className="py-3 flex items-center">
                      <FaFileAlt className="text-gray-400 mr-3" />
                      <span className="text-gray-700">{doc.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <FaFileAlt className="mx-auto text-gray-300" size={32} />
                  <p className="mt-2 text-gray-500">No documents in this folder</p>
                </div>
              )}
            </div>
          </div>
        )}

        <ConfirmModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to permanently delete this folder?"
          confirmText="Delete"
          confirmVariant="danger"
        />
      </div>
    </Container>
  );
};

export default Favorites;