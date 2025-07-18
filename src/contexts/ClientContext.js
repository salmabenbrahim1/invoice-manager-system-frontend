import React, { createContext, useState, useEffect } from 'react';
import {
  createClient,
  getMyClients,
  updateClient as updateClientAPI,
  deleteClient as deleteClientAPI,
 assignAccountantToClientAPI,
 getAccountantClients,
} from '../services/ClientService';

import { useAuth } from './AuthContext';

const ClientContext = createContext();

const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth(); // Access user from AuthContext

  

  // Fetch clients created by the authenticated user
  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const clientData = await getMyClients(user.token);
      setClients(clientData);
    } catch (error) {
      console.error('Error fetching clients', error);
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountantClients = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const clientData = await getAccountantClients(user.token);
      setClients(clientData);
    } catch (error) {
      console.error('Error fetching clients', error);
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);
  useEffect(() => {
    if (user?.role === 'INTERNAL_ACCOUNTANT') {
      fetchAccountantClients();
    }
  }, [user]);
  



  // Create a new client
  const addClient = async (clientData) => {
  if (!user) return;

  try {
    const createdClient = await createClient(clientData, user.token);
    await fetchClients();  
    return createdClient; 
  } catch (error) {
    console.error('Error creating client', error);
    setError('Failed to create client');
    throw error; 
  }
};


  //  Update client
  const updateClient = async (clientId, updatedData) => {
    if (!user) return;

    try {
      const updatedClient = await updateClientAPI(clientId, updatedData, user.token);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId ? updatedClient : client
        )
      );
    } catch (error) {
      console.error('Error updating client', error);
      setError('Failed to update client');
    }
  };

  //  Delete client
  const deleteClient = async (clientId) => {
    if (!user) return;

    try {
      await deleteClientAPI(clientId, user.token);
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
    } catch (error) {
      console.error('Error deleting client', error);
      setError('Failed to delete client');
    }

    
  };


 

// Assign accountant to client
const assignAccountantToClient = async (clientId, accountantId) => {
  if (!user) return;

  try {
    await assignAccountantToClientAPI(clientId, accountantId, user.token);

    // Refresh the client list after successful assignment
    await fetchClients();
  } catch (error) {
    console.error('Error assigning accountant', error);
    setError('Failed to assign accountant');
  }
};





  

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        error,
        fetchClients,
        addClient,
        updateClient,
        deleteClient,
        assignAccountantToClient,
        fetchAccountantClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

const useClient = () => React.useContext(ClientContext);

export { ClientProvider, useClient };
