import React, { useState, useEffect } from "react";
import { folderService } from '../../services/FolderService';
import { Container } from "react-bootstrap";
import { FaFolder, FaSearch, FaFileAlt, FaUndo, FaTrash } from "react-icons/fa";
import SidebarAccountant from "../../components/accountant/SidebarAccountant";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "../../components/modals/ConfirmModal";

const Archive = () => {
  const [archivedFolders, setArchivedFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchArchivedFolders();
  }, []);

  const fetchArchivedFolders = async () => {
    setIsLoading(true);
    try {
      const allFolders = await folderService.getMyFolders();
      const archived = allFolders.filter(folder => folder.archived === true);
      setArchivedFolders(archived);
    } catch (error) {
      console.error("Error loading folders:", error);
      toast.error("Failed to load archived folders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchive = async (folderId, e) => {
    e.stopPropagation();
    try {
      await folderService.unarchiveFolder(folderId);
      setArchivedFolders(prev => prev.filter(folder => folder.id !== folderId));
      toast.success("Folder unarchived successfully!");
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Unarchive error:", error);
      toast.error("Failed to unarchive folder");
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
      setArchivedFolders(prev => prev.filter(folder => folder.id !== folderToDelete));
      toast.success("Folder deleted successfully!");
      if (selectedFolder?.id === folderToDelete) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete folder");
    } finally {
      setShowDeleteModal(false);
      setFolderToDelete(null);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    navigate(`/archive/${folder.id}/invoices`);
  };

  const filteredArchivedFolders = archivedFolders.filter(folder =>
    (folder.folderName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (folder.client?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="d-flex vh-100 p-0 bg-gray-50">
      <SidebarAccountant />
      <div className="d-flex flex-column flex-grow-1 p-4 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Archived Folders</h2>
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredArchivedFolders.length > 0 ? (
              filteredArchivedFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border bg-white rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 ${selectedFolder?.id === folder.id
                    ? "border-violet-400 ring-2 ring-blue-100"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex items-start sm:items-center space-x-4 w-full sm:w-auto">
                    <FaFolder className="text-violet-800 mt-1 sm:mt-0" size={45} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {folder.folderName || "Unnamed folder"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Client: {folder.client?.name || "No client specified"}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-gray-500">
                          Created: {new Date(folder.createdAt).toLocaleDateString()}
                        </span>
                        {folder.archivedAt && (
                          <span className="text-xs text-gray-500">
                            Archived: {new Date(folder.archivedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                    <button
                      className="px-3 py-1.5 bg-blue-50 text-violet-600 rounded-md hover:bg-blue-100 flex items-center space-x-2 transition-colors"
                      onClick={(e) => handleUnarchive(folder.id, e)}
                    >
                      <FaUndo size={14} />
                      <span>Unarchive</span>
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center space-x-2 transition-colors"
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
                    : "No archived folders found"}
                </p>
              </div>
            )}
          </div>
        )}

        {selectedFolder && (
          <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedFolder.folderName || "Unnamed folder"}
                </h3>
                <p className="text-gray-600">
                  Client: {selectedFolder.client?.name || "No client specified"}
                </p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Archived
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Creation Date</h4>
                <p className="text-xs text-gray-500">
                  {new Date(selectedFolder.createdAt).toLocaleString("en-GB", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
              {selectedFolder.archivedAt && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Archived Date</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedFolder.archivedAt).toLocaleString("en-GB", {
                      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Documents</h4>
              {selectedFolder.documents && selectedFolder.documents.length > 0 ? (
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
          message="Are you sure you want to permanently delete this folder?"
        />
      </div>
    </Container>
  );
};

export default Archive;
