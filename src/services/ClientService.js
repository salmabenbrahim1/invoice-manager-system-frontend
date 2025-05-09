
import axios from 'axios';


const API_URL = 'http://localhost:9090/api/clients';



//Get token from localStorage
const getAuthHeader = (token) => {
  const authToken = token || localStorage.getItem('token');
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
};

// Create a new client
export const createClient = async (clientData, token) => {
  try {
    const response = await axios.post(API_URL, clientData, {
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to create client';
  }
};

// Get the list of clients created by the current user
export const getMyClients = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to fetch clients';
  }
};

export const getAccountantClients = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my-clients`, {
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch accountant clients:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to fetch accountant clients';
  }
};



//  Update a client
export const updateClient = async (clientId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${clientId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating client ${clientId}`, error);
    throw error;
  }
};

//  Delete a client
export const deleteClient = async (clientId, token) => {
  try {
    await axios.delete(`${API_URL}/${clientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.error(`Error deleting client ${clientId}`, error);
    throw error;
  }
};

// Assign an accountant to an existing client
export const assignAccountantToClientAPI = async (clientId, accountantId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${clientId}/assign-accountant`,
      { accountantId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning accountant to client:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to assign accountant to client';
  }
};

// Add to ClientService.js
export const getClientsByAccountant = async (accountantId, token) => {
  try {
    const response = await axios.get(`${API_URL}/by-accountant/${accountantId}`, {
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clients by accountant:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to fetch clients by accountant';
  }
};







