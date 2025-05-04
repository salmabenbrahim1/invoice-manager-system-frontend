import { createContext, useContext, useState, useEffect } from 'react';
import { folderService } from '../services/FolderService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
   // the current folder is the one selected by the user 


  const [archivedFolders, setArchivedFolders] = useState([]);
  const [favoriteFolders, setFavoriteFolders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch folders created by the authenticated user
  const fetchFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedFolders = await folderService.getMyFolders();
      setFolders(fetchedFolders); // Set the fetched folders
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a folder and update state
  const createFolder = async (folderData) => {
    setLoading(true);
    setError(null);
    try {
      const newFolder = await folderService.createFolder(folderData);
      setFolders((prev) => [...prev, newFolder]); // Add the new folder to the list
      return newFolder;
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow for components to handle
    } finally {
      setLoading(false);
    }
  };

// Update folder by id and update state
const updateFolder = async (folderId, updatedFolderData) => {
  setLoading(true);
  setError(null);
  try {
    const updatedFolder = await folderService.updateFolder(folderId, updatedFolderData);
    setFolders((prev) => prev.map(folder => folder.id === folderId ? updatedFolder : folder)); // Update the folder in the list
    return updatedFolder;
  } catch (err) {
    setError(err.message);
    throw err; // Rethrow for components to handle
  } finally {
    setLoading(false);
  }
};

 // Delete folder by id and update state
 const deleteFolder = async (folderId) => {
  setLoading(true);
  setError(null);
  try {
    await folderService.deleteFolder(folderId);
    setFolders((prev) => prev.filter(folder => folder.id !== folderId)); 
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


// Archive folders
const archiveFolder = (folderId) => {
  const folderToArchive = folders.find((folder) => folder.id === folderId);
  if (!folderToArchive) return;

  setArchivedFolders((prevArchived) => [...prevArchived, folderToArchive]);
  setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== folderId));
};

// Favorite folders
const toggleFavorite = (folderId) => {
  setFavoriteFolders((prevFavorites) => {
    const isFavorite = prevFavorites.some((fav) => fav.id === folderId);
    if (isFavorite) {
      return prevFavorites.filter((fav) => fav.id !== folderId);
    } else {
      const folderToAdd = folders.find((f) => f.id === folderId);
      return [...prevFavorites, folderToAdd];
    }
  });
};

// Set the current folder when a folder is selected
  const setFolderList = (folderList) => {
    setFolders(folderList);
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        favoriteFolders,
        archivedFolders,
        loading,
        error,
        createFolder,
        setFolderList,
        fetchFolders,
        updateFolder, 
        deleteFolder,
        toggleFavorite,
        archiveFolder,
        favoriteFolders,
        archivedFolders


        
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
