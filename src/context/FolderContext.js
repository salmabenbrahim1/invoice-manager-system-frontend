import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFolders, deleteFolder, addFolder, updateFolder } from '../services/FolderService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);

  // the current folder is the one selected by the user 
  const [currentFolder, setCurrentFolder] = useState(null);
  const { folderId } = useParams();

  const [archivedFolders, setArchivedFolders] = useState([]);
  const [favoriteFolders, setFavoriteFolders] = useState([]);

  // Add a folder from API
  const handleAddFolder = async (folder) => {
    try {
      const newFolder = await addFolder(folder);
      setFolders((prevFolders) => [...prevFolders, newFolder]);
      return newFolder;
    } catch (error) {
      console.error('Failed to add folder:', error);
      toast.error('Failed to add folder. Please try again.');
    }
  };


  // Delete a folder from API
  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== folderId));
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder. Please try again.');
    }
  };

  // Fetch all folders 
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

  useEffect(() => {
    const updateCurrentFolder = () => {
      if (folders.length > 0) {
        if (!folderId) {
          // Default to first folder if no folderId in URL
          setCurrentFolder(folders[0]);
        } else {
          const folderToSet = folders.find((folder) => folder.id === folderId);
          if (folderToSet) {
            setCurrentFolder(folderToSet);
          } else {
            console.error('Folder not found.');
          }
        }
      }
    };
    updateCurrentFolder();
  }, [folderId, folders]);
  
  // Update an existing folder from API
  const handleUpdateFolder = async (folderId, updatedData) => {
    try {
      const updatedFolder = await updateFolder(folderId, updatedData);
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId ? { ...folder, ...updatedFolder } : folder
        )
      );
    } catch (error) {
      console.error('Failed to update folder:', error);
      toast.error('Failed to update folder. Please try again.');
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

  // Ensuring `currentFolder` is always updated when folder is switched 
  const handleFolderSwitch = (folderId) => {
    const folderToSet = folders.find((folder) => folder.id === folderId);
    if (folderToSet) {
      setCurrentFolder(folderToSet);
    } else {
      console.error('Folder not found.');
    }
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        currentFolder,
        setCurrentFolder,
        archivedFolders,
        favoriteFolders,
        handleAddFolder,
        handleDeleteFolder,
        archiveFolder,
        handleUpdateFolder,
        toggleFavorite,
        handleFolderSwitch,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
