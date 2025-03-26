import React, { createContext, useState, useEffect, useContext } from 'react';
import { getClients } from '../../services/ClientService';

const ClientContext = createContext();

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const [existingClients, setExistingClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getClients();
        setExistingClients(clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider value={{ existingClients }}>
      {children}
    </ClientContext.Provider>
  );
};
