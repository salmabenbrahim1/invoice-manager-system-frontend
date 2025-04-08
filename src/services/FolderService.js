import axios from 'axios';

const api = axios.create({
  //backend URL
  baseURL: 'http://localhost:9090/api'
});

//fetching all folders from the backend
export const getFolders = async () => {
  try {
    const response = await api.get('/folders');
    return response.data.map(folder => ({ ...folder,
      clientName: folder.client ? folder.client.name : '', 
    }));
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

//adding a new folder to the backend
export const addFolder = async (folder) => {
  try{
    const response = await api.post('/folders', folder);
    return response.data;
  }
  catch (error) {
    console.error("Error adding folder:", error);

    throw error;
  }
}

//deleting a folder by its ID
export const deleteFolder = async (folderId) => {
  try{
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  }catch (error) {
    console.error("Error updating folder:", error);
    throw error;  
  }
};

// updating an existing folder's details
export const updateFolder = async (folderId, updatedFolder) => {
  try {
    const response = await api.put(`/folders/${folderId}`, updatedFolder);
    return response.data;  
  } catch (error) {
    console.error("Error updating folder:", error);
    throw error;  
  }
};

