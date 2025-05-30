import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const EngineContext = createContext();

export const EngineProvider = ({ children }) => {
  const [selectedEngine, setSelectedEngine] = useState('gemini');
  const [engineConfig, setEngineConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEngine = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9090/api/admin/engine');
      setSelectedEngine(response.data.selectedEngine);
      setEngineConfig({
        ...response.data.config,
        deepseekModelVersion: response.data.config?.deepseekModelVersion || '',
      });
    } catch (err) {
      console.error('Error fetching engine:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveEngine = async (selectedEngine, config) => {
    const payload = { selectedEngine, ...config };
    await axios.post('http://localhost:9090/api/admin/engine/config', payload);
    setSelectedEngine(selectedEngine);
    setEngineConfig({
      ...config,
      deepseekModelVersion: config?.deepseekModelVersion || '',
    });
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
        engineConfig,
        setEngineConfig,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => useContext(EngineContext);
