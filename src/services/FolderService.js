import axios from 'axios';

const API_URL = 'http://localhost:9090/api/folders';

// Helper to get auth config
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const folderService = {
  // Create a new folder (with new or existing client)
  createFolder: async (folderData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(API_URL, folderData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create folder';
      throw new Error(message);
    }
  },


  // Get folders created by the authenticated user
  getMyFolders: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/my-folders`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch folders';
      throw new Error(message);
    }
  },

   // Update a folder by ID
   updateFolder: async (folderId, updatedFolderData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(`${API_URL}/${folderId}`, updatedFolderData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to update folder with id ${folderId}`;
      throw new Error(message);
    }
  },

  // Delete a folder by ID
  deleteFolder: async (folderId) => {
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/${folderId}`, config);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to delete folder with id ${folderId}`;
      throw new Error(message);
    }
  },



// Archive folder
archiveFolder: async (folderId) => {
  try {
    const config = getAuthConfig();
    const response = await axios.put(`${API_URL}/${folderId}/archive`, {}, config);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      `Failed to archive folder with id ${folderId}`;
    throw new Error(message);
  }
},

// Unarchive folder
unarchiveFolder: async (folderId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(`${API_URL}/${folderId}/unarchive`, {}, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to unarchive folder with id ${folderId}`;
      throw new Error(message);
    }
  },


  markAsFavorite: async (folderId) => {
  try {
    const config = getAuthConfig();
    await axios.put(`${API_URL}/${folderId}/favorite`, {}, config);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to mark as favorite';
    throw new Error(message);
  }
},

unmarkAsFavorite: async (folderId) => {
  try {
    const config = getAuthConfig();
    await axios.put(`${API_URL}/${folderId}/unfavorite`, {}, config);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to unmark as favorite';
    throw new Error(message);
  }
},
 // Get folders by internal accountant ID
  getFoldersByAccountant: async (accountantId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/by-internal-accountant/${accountantId}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch folders';
      throw new Error(message);
    }
  },
getFoldersByIndependentAccountant: async (accountantId) => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/by-independent-accountant/${accountantId}`, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch folders';
    throw new Error(message);
  }
},


};