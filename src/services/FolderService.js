import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090/api', // my backend URL
});

export const getFolders = async () => {
  try {
    const response = await api.get('/folders');
    return response.data.map(folder => ({
      ...folder,
      clientName: folder.client ? folder.client.name : '', 
    }));
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};


export const addFolder = async (folder) => {
  const response = await api.post('/folders', folder);
  console.log("API Folder Response:", response.data); // Debugging

  return response.data;
};

export const deleteFolder = async (folderId) => {
  const response = await api.delete(`/folders/${folderId}`);
  return response.data;
};

export const updateFolder = async (folderId, folder) => {
  const response = await api.put(`/folders/${folderId}`, folder);
  return response.data;
};
