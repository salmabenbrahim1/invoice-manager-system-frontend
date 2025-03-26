import React, { createContext, useState, useEffect } from 'react';
import { getFolders,deleteFolder as deleteFolderFromService } from '../../services/FolderService';
import { toast } from 'react-toastify';

export const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);

  // Add a new folder to state
  const addFolder = (folder) => {
    setFolders((prevFolders) => [...prevFolders, folder]);
  };

  // Delete a folder from state
  const deleteFolder = async (folderId) => {
    try {
      await deleteFolderFromService(folderId); 
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

  return (
    <FolderContext.Provider value={{ folders, addFolder, deleteFolder }}>
      {children}
    </FolderContext.Provider>
  );
};
