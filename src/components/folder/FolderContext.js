import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFolders, deleteFolder, addFolder, updateFolder } from '../../services/FolderService';
import { toast } from 'react-toastify';

export const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);


export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [archivedFolders, setArchivedFolders] = useState([]);
  const [favoriteFolders, setFavoriteFolders] = useState([]);


  // Add a folder from API
  const handleAddFolder = async (folder) => {
    try {
      const newFolder = await addFolder(folder);
      setFolders((folders) => [...folders, newFolder]);
      return newFolder;
    } catch (error) {
      console.error("Failed to add client:", error);

    }
  };

  // Delete a folder from API
  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      setFolders((prevFolders) => prevFolders.filter(folder => folder._id !== folderId));
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder. Please try again.');
    }
  };

  // Fetch folders from API 
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const data = await getFolders();

        setFolders(data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };
    fetchFolders();
  }, []);



  // Update an existing folder from API
  const handleUpdateFolder = async (folderId, updatedData) => {
    const updatedFolder = await updateFolder(folderId, updatedData);
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder._id === folderId ? { ...folder, ...updatedFolder } : folder
      )
    );
  };

  // Archive folders
  const archiveFolder = (folderId) => {
    const folderToArchive = folders.find((folder) => folder._id === folderId);
    if (!folderToArchive) return;

    setArchivedFolders([...archivedFolders, folderToArchive]);
    setFolders(folders.filter((folder) => folder._id !== folderId));
  };

  // Favorite folders
  const toggleFavorite = (folderId) => {
    setFavoriteFolders((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav._id === folderId);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav._id !== folderId); // Remove
      } else {
        const folderToAdd = folders.find((f) => f._id === folderId);
        return [...prevFavorites, folderToAdd];
      }
    });
  };

  return (
    <FolderContext.Provider value={{ folders, archivedFolders, favoriteFolders, handleAddFolder, handleDeleteFolder, archiveFolder, handleUpdateFolder, toggleFavorite }}>
      {children}
    </FolderContext.Provider>
  );
};
