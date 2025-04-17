import React, { useState, useEffect } from "react";
import { useFolder } from "../../context/FolderContext";
import { Container } from "react-bootstrap";
import { FaFolder,FaSearch } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

const Archive = () => {
  const { archivedFolders } = useFolder();
  const [archivedFoldersState, setArchivedFoldersState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync archivedFolders with local state
  useEffect(() => {
    setArchivedFoldersState(archivedFolders);
  }, [archivedFolders]);

  // Filter archived folders based on search query
  const filteredArchivedFolders = archivedFoldersState.filter((folder) =>
    (folder.folderName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (folder.client?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Archived Folders</h2>
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg  shadow-md"
            />
          </div>
        </div>

        {/* List of archived folders */}
        <ul className="space-y-4">
          {filteredArchivedFolders.length > 0 ? (
            filteredArchivedFolders.map((folder) => (
              <li
                key={folder.id}
                className="flex items-center justify-between p-4 border-b border-gray-300 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center">
                  <FaFolder size={30} className="me-3" />
                  <div>
                    <h5 className="font-semibold">{folder.folderName || "Unnamed Folder"}</h5>
                    <div className="text-gray-500 text-sm">
                      Client: {folder.client?.name || "Unnamed Client"}
                    </div>
                    <div className="text-sm text-muted">
                      {new Date(folder.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No archived folders found.</p>
          )}
        </ul>
      </div>
    </Container>
  );
};

export default Archive;
