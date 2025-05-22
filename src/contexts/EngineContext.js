// src/context/EngineContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const EngineContext = createContext();

export const EngineProvider = ({ children }) => {
  const [selectedEngine, setSelectedEngine] = useState('gemini');
  const [loading, setLoading] = useState(true);

  const fetchEngine = async () => {
    try {
      setLoading(true);
const response = await axios.get('http://localhost:9090/api/engine');
      setSelectedEngine(response.data.engine);
    } catch (err) {
      console.error('Error fetching engine:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveEngine = async () => {
    try {
      await axios.post('http://localhost:9090/api/engine', { engine: selectedEngine }); // Spring Boot endpoint
    } catch (err) {
      console.error('Error saving engine:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEngine();
  }, []);

  return (
    <EngineContext.Provider
      value={{
        selectedEngine,
        setSelectedEngine,
        loading,
        saveEngine,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};

// Custom hook to use the context
export const useEngine = () => useContext(EngineContext);
