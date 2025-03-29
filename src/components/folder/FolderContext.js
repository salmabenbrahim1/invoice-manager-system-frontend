import React, { createContext, useState, useEffect,useContext } from 'react';
import { getFolders,deleteFolder,addFolder} from '../../services/FolderService';
import { toast } from 'react-toastify';

export const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);


export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [archivedFolders, setArchivedFolders] = useState([]); 
  const [favoriteFolders, setFavoriteFolders] = useState([]); 


  // Add a folder
  const handleAddFolder = async (folder) => {
    try{
      const newFolder = await addFolder(folder); 
      setFolders((folders) => [...folders, newFolder]); 
      return newFolder; 
    }catch (error) {
      console.error("Failed to add client:", error);

    }
    };

  // Delete a folder 
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
    <FolderContext.Provider value={{ folders, handleAddFolder, handleDeleteFolder,archiveFolder,archivedFolders, favoriteFolders, toggleFavorite }}>
      {children}
    </FolderContext.Provider>
  );
};
