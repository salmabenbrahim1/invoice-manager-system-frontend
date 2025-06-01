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


  const archiveFolder = async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      await folderService.archiveFolder(folderId);

      const archived = folders.find((f) => f.id === folderId);
      if (archived) {
        archived.archived = true;
        setArchivedFolders((prev) => [...prev, archived]);
        setFolders((prev) => prev.filter((f) => f.id !== folderId));
      }

      toast.success("Folder successfully archived! !");
    } catch (err) {
      setError(err.message);
      toast.error("Error archiving folder!");
    } finally {
      setLoading(false);
    }
  };

  const unarchiveFolder = async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      await folderService.unarchiveFolder(folderId);

      const unarchived = archivedFolders.find((f) => f.id === folderId);
      if (unarchived) {
        unarchived.archived = false;
        setFolders((prev) => [...prev, unarchived]);
        setArchivedFolders((prev) => prev.filter((f) => f.id !== folderId));
      }

      toast.success("Folder successfully unarchived!");
    } catch (err) {
      setError(err.message);
      toast.error("Error unarchiving folder!");
    } finally {
      setLoading(false);
    }
  };

  // Favorite folders
  const toggleFavorite = async (folderId) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    try {
      if (folder.favorite) {
        await folderService.unmarkAsFavorite(folderId);
      } else {
        await folderService.markAsFavorite(folderId);
      }

      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId ? { ...f, favorite: !f.favorite } : f
        )
      );

      toast.success(`Folder ${folder.favorite ? 'removed from favorites' : 'added to favorites'}!`);
    } catch (err) {
      toast.error("Error while updating favorites!");
      console.error(err);
    }
  };



  // Set the current folder when a folder is selected
  const setFolderList = (folderList) => {
    setFolders(folderList);
  };
  const fetchFoldersByAccountant = async (accountantId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFoldersByAccountant(accountantId);
      setFolders(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
    const fetchIndependentAccountantFolders = async (accountantId) => {
    setLoading(true);
    try {
      const data = await folderService.getFoldersByIndependentAccountant(accountantId);
      setFolders(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <FolderContext.Provider
      value={{
        folders,
        loading,
        error,
        createFolder,
        setFolderList,
        fetchFolders,
        updateFolder,
        deleteFolder,
        toggleFavorite,
        favoriteFolders,
        archiveFolder,
        unarchiveFolder,
        fetchFoldersByAccountant,
                fetchIndependentAccountantFolders,




      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
