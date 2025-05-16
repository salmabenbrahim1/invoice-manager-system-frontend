import React, { useState, useEffect } from "react";
import { folderService } from '../../services/FolderService';
import { Container } from "react-bootstrap";
import { FaFolder, FaSearch, FaFileAlt } from "react-icons/fa";
import SidebarAccountant from "../../components/accountant/SidebarAccountant";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Archive = () => {
  const [archivedFoldersState, setArchivedFoldersState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null); // 👈 Dossier sélectionné
  const navigate = useNavigate();

  // Charger les dossiers archivés
  const fetchArchivedFolders = async () => {
    try {
      const allFolders = await folderService.getMyFolders();
      const archived = allFolders.filter(folder => folder.archived === true);
      setArchivedFoldersState(archived);
    } catch (error) {
      console.error("Erreur lors du chargement des dossiers :", error);
      toast.error("Erreur lors du chargement des dossiers archivés");
    }
  };

  useEffect(() => {
    fetchArchivedFolders();
  }, []);

  const handleUnarchive = async (folderId) => {
    try {
      await folderService.unarchiveFolder(folderId);
      setArchivedFoldersState((prev) =>
        prev.filter((folder) => folder.id !== folderId)
      );
      toast.success("Dossier désarchivé avec succès !");
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Erreur lors du désarchivage :", error);
      toast.error("Erreur lors du désarchivage du dossier");
    }
  };

  const handleDelete = async (folderId) => {
    try {
      await folderService.deleteFolder(folderId);
      setArchivedFoldersState((prev) =>
        prev.filter((folder) => folder.id !== folderId)
      );
      toast.success("Dossier supprimé avec succès !");
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Erreur lors de la suppression du dossier");
    }
  };

const handleFolderClick = (folder) => {
  setSelectedFolder(folder);
  navigate(`/archive/${folder.id}/invoices`);
};

  const filteredArchivedFolders = archivedFoldersState.filter((folder) =>
    (folder.folderName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (folder.client?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <SidebarAccountant />
      <div className="d-flex flex-column flex-grow-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Dossiers Archivés</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-md"
            />
          </div>
        </div>

        <ul className="space-y-4">
          {filteredArchivedFolders.length > 0 ? (
            filteredArchivedFolders.map((folder) => (
              <li
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className={`flex items-center justify-between p-4 border-b border-gray-300 bg-white shadow-md rounded-lg hover:shadow-lg cursor-pointer transition-shadow duration-300 ${
                  selectedFolder?.id === folder.id ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                <div className="flex items-center">
                  <FaFolder size={30} className="me-3 text-blue-600" />
                  <div>
                    <h5 className="font-semibold">{folder.folderName || "Dossier sans nom"}</h5>
                    <div className="text-gray-500 text-sm">
                      Client: {folder.client?.name || "Client sans nom"}
                    </div>
                    <div className="text-sm text-muted">
                      {new Date(folder.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnarchive(folder.id);
                    }}
                  >
                    Désarchiver
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(folder.id);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Aucun dossier archivé trouvé.</p>
          )}
        </ul>

        {/* Section : contenu du dossier sélectionné */}
        {selectedFolder && (
          <div className="mt-6 p-4 border rounded-lg shadow bg-gray-50">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Contenu du dossier : {selectedFolder.folderName}
            </h3>
            <p><strong>Client :</strong> {selectedFolder.client?.name || "Client inconnu"}</p>
            <p><strong>Date de création :</strong> {new Date(selectedFolder.createdAt).toLocaleString()}</p>

            {/* 🔽 Exemple de documents (à adapter selon ta structure réelle) */}
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Documents</h4>
              {selectedFolder.documents && selectedFolder.documents.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedFolder.documents.map((doc, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FaFileAlt className="text-gray-600" />
                      <span>{doc.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun document trouvé dans ce dossier.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Archive;
