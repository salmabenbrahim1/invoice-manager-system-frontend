import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import deepseekLogo from '../../assets/images/deepseek-logo.png';
import geminiLogo from '../../assets/images/gemini-logo.png';
import { useEngine } from '../../contexts/EngineContext';

const EngineSelector = () => {
  const { selectedEngine, setSelectedEngine, loading, saveEngine, engineConfig, setEngineConfig } = useEngine();
  const [error, setError] = useState(null);

  // Local state pour formulaire de config
  const [config, setConfig] = useState({
    geminiApiKey: '',
    geminiModelVersion: '',
    deepseekApiKey: '',
    deepseekEndpoint: '',
    deepseekModelVersion: '', 
  });

  // Sync avec engineConfig du contexte au chargement / changement
  useEffect(() => {
    if (engineConfig) {
      setConfig(engineConfig);
    }
  }, [engineConfig]);

  // Gestion des inputs
  const handleChange = (e) => {
    setConfig((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save with config
 const handleSave = async () => {
  try {
    const currentConfig = JSON.stringify(engineConfig || {});
    const newConfig = JSON.stringify(config);

    if (selectedEngine !== selectedEngine || currentConfig !== newConfig) {
      await saveEngine(selectedEngine, config);
      toast.success('AI engine updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
      });
    } else {
      toast.info('No changes detected.', {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
      });
    }
  } catch {
    toast.error('Failed to save AI engine', {
      position: "top-center",
      autoClose: 3000,
      theme: "light",
    });
  }
};


  // Formulaire selon moteur sélectionné
  const renderConfigForm = () => {
    if (selectedEngine === 'gemini') {
      return (
        <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-purple-200 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-purple-900">Gemini Configuration</h3>
          <label className="block mb-3">
            API Key:
            <input
              type="text"
              name="geminiApiKey"
              value={config.geminiApiKey}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              placeholder="Enter Gemini API Key"
            />
          </label>
          <label className="block mb-3">
            Model Version:
            <input
              type="text"
              name="geminiModelVersion"
              value={config.geminiModelVersion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              placeholder="Enter Model Version"
            />
          </label>
        </div>
      );
    }  else if (selectedEngine === 'deepseek') {
  return (
    <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-purple-200 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-purple-900">DeepSeek Configuration</h3>
      <label className="block mb-3">
        API Key:
        <input
          type="text"
          name="deepseekApiKey"
          value={config.deepseekApiKey}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          placeholder="Enter DeepSeek API Key"
        />
      </label>
      <label className="block mb-3">
        Endpoint URL:
        <input
          type="text"
          name="deepseekEndpoint"
          value={config.deepseekEndpoint}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          placeholder="Enter DeepSeek Endpoint URL"
        />
      </label>
      <label className="block mb-3">
        Model Version:
        <input
          type="text"
          name="deepseekModelVersion"
          value={config.deepseekModelVersion || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          placeholder="e.g., deepseek-chat"
        />
      </label>
    </div>
  );
}

    return null;
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl mx-auto min-h-screen" style={{ backgroundColor: '#f5f0ff' }}>
        <h2 className="text-3xl font-bold mb-8 text-purple-900">Select AI Extraction Engine</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Current Model Indicator */}
            {selectedEngine && (
              <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-purple-200">
                <p className="text-lg text-purple-800 font-semibold">
                  You are currently using: <span className="text-purple-600 capitalize">{selectedEngine}</span> model
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-12 mb-10">
              {/* Gemini */}
              <div
                onClick={() => setSelectedEngine('gemini')}
                className={`flex flex-col items-center p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedEngine === 'gemini'
                    ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-500 shadow-lg'
                    : 'bg-white hover:bg-purple-50 shadow-md'
                }`}
                style={{ width: '180px' }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 flex items-center justify-center bg-white p-2">
                  <img src={geminiLogo} alt="Gemini" className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold text-lg text-gray-800">Gemini</span>
                {selectedEngine === 'gemini' && (
                  <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Selected
                  </div>
                )}
              </div>

              {/* DeepSeek */}
              <div
                onClick={() => setSelectedEngine('deepseek')}
                className={`flex flex-col items-center p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedEngine === 'deepseek'
                    ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-500 shadow-lg'
                    : 'bg-white hover:bg-purple-50 shadow-md'
                }`}
                style={{ width: '180px' }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 flex items-center justify-center bg-white p-2">
                  <img src={deepseekLogo} alt="DeepSeek" className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold text-lg text-gray-800">DeepSeek</span>
                {selectedEngine === 'deepseek' && (
                  <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Selected
                  </div>
                )}
              </div>
            </div>

            {/* Formulaire config */}
            {renderConfigForm()}

            <div className="flex justify-center">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Save Preferences
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default EngineSelector;
