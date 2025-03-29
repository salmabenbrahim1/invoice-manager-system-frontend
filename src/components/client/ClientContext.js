import React, { createContext, useState, useEffect, useContext } from 'react';
import { getClients,addClient,deleteClient,updateClient } from '../../services/ClientService';

const ClientContext = createContext();

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getClients();
        setClients(clients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };
    fetchClients();
  }, []);

  /// Add client
  const handleAddClient = async (client) => {
    try {
      const newClient = await addClient(client);
      setClients([...clients, newClient]);
      return newClient;
    } catch (error) {
      console.error("Failed to add client:", error);
    }
  };
  // Delete client
  const handleDeleteClient = async (clientId) => {
    try {
      await deleteClient(clientId);
      setClients(clients.filter((client) => client._id !== clientId));
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };
  // Update client
  const handleUpdateClient = async (clientId, client) => {
    try {
      const updatedClient = await updateClient(clientId, client);
      setClients(clients.map((client) => (client._id === clientId ? updatedClient : client)));
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };


  return (
    <ClientContext.Provider value={{ clients, handleAddClient, handleDeleteClient, handleUpdateClient }}>
      {children}
    </ClientContext.Provider>
  );
};
