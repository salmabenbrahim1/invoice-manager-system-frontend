import React, { useState, useEffect } from "react";
import { FaFolder, FaStar,FaSearch } from "react-icons/fa";
import { useFolder } from "../../components/folder/FolderContext";
import { Container, Button } from "react-bootstrap";
import SideBar from "../../components/Sidebar";

const Favorite = () => {
  const { favoriteFolders, toggleFavorite } = useFolder();
  const [favoriteFoldersState, setFavoriteFoldersState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteFolders");
    if (storedFavorites) {
      setFavoriteFoldersState(JSON.parse(storedFavorites));
    }
  }, []);




  const handleRemoveFavorite = (folderId) => {
    toggleFavorite(folderId);

    // using localStorage:
    //updating the local state and localStorage after the change
    const updatedFavorites = favoriteFolders.filter((folder) => folder._id !== folderId);
    setFavoriteFoldersState(updatedFavorites);

    // saving the updated favorites in localStorage
    localStorage.setItem("favoriteFolders", JSON.stringify(updatedFavorites));
  };


  const filteredFavoriteFolders = favoriteFoldersState.filter((folder) =>
    (folder.folderName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (folder.client?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <SideBar />
      <div className="d-flex flex-column flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-2xl font-semibold">Favorite Folders</h2>
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

        {/* List of favorite folders */}
        <ul className="list-unstyled">
          {filteredFavoriteFolders.length > 0 ? (
            filteredFavoriteFolders.map((folder) => (
              <li key={folder._id} className="d-flex justify-content-between align-items-center p-3 mb-3 border rounded bg-white shadow-sm">
                <div className="d-flex align-items-center">
                  <FaFolder size={30} className="me-3 text-primary" />
                  <div>
                    <h5 className="mb-1">{folder.folderName || "Unnamed Folder"}</h5>
                    <small className="text-muted">Client: {folder.client?.name || "Unnamed Client"}</small>
                    <br />
                    <small className="text-muted">{new Date(folder.createdAt).toLocaleString()}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <FaStar className="text-warning me-2" />
                  <Button variant="danger" size="sm" onClick={() => handleRemoveFavorite(folder._id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No favorite folders found.</p>
          )}
        </ul>
      </div>
    </Container>
  );
};

export default Favorite;
