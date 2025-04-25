import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090/api', 
});

export const getClients = async () => {
  try {
    const response = await api.get('/clients');
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const addClient = async (client) => {
  const response = await api.post('/clients', client);
  return response.data;
};

export const deleteClient = async (clientId) => {
  const response = await api.delete(`/clients/${clientId}`);
  return response.data;
};

export const updateClient = async (clientId, client) => {
  const response = await api.put(`/clients/${clientId}`, client);
  return response.data;
};