import React, { createContext, useState, useEffect } from 'react';
import {
  createClient,
  getMyClients,
  updateClient as updateClientAPI,
  deleteClient as deleteClientAPI,
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

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  // Create a new client
  const addClient = async (clientData) => {
    if (!user) return;

    try {
      const newClient = await createClient(clientData, user.token);
      setClients((prev) => [...prev, newClient]);
      return newClient; // Return the newly created client
    } catch (error) {
      console.error('Error creating client', error);
      setError('Failed to create client');
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
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

const useClient = () => React.useContext(ClientContext);

export { ClientProvider, useClient };
