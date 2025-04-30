import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaCheck } from 'react-icons/fa';
import ZoomableImage from '../ZoomableImage';
const InvoiceScanEditor = ({ invoice, onClose }) => {
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fieldGroups = [
    {
      title: "Customer Information",
      fields: [
        { name: 'client_name', label: 'Client Name' },
        { name: 'siret_number', label: 'SIRET Number' }
      ]
    },
    {
      title: "Invoice Details",
      fields: [
        { name: 'invoice_number', label: 'Invoice Number' },
        { name: 'invoice_date', label: 'Invoice Date' },
        { name: 'TVA_Number', label: 'TVA Number' }
      ]
    },
    {
      title: "Amounts",
      fields: [
        { name: 'HT', label: 'HT' },
        { name: 'TVA', label: 'TVA' },
        { name: 'TTC', label: 'TTC' },
        { name: 'currency', label: 'Currency' }
      ]
    }
  ];

  useEffect(() => {
    const fetchExtractedData = async () => {
      if (!invoice?.img) return;

      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/extract', {
          imageUrl: `http://localhost:9090${invoice.img}`,
        });

        const extracted = response.data;
        const structuredData = {
          siret_number: extracted.siret_number || 'N/A',
          invoice_number: extracted.invoice_number || 'N/A',
          TVA_Number: extracted['TVA Number'] || extracted.TVA_Number || 'N/A',
          invoice_date: extracted.document_date || extracted.invoice_date || 'N/A',
          TVA: extracted.TVA || 'N/A',
          HT: extracted.HT || 'N/A',
          TTC: extracted.TTC || 'N/A',
          client_name: extracted.client_name || 'N/A',
          currency: extracted.currency || 'N/A',
        };

        setExtractedData(structuredData);
        setFormData(structuredData);
      } catch (error) {
        console.error('Error fetching extracted data:', error);
        const fallback = fieldGroups.reduce((acc, group) => {
          group.fields.forEach(field => {
            acc[field.name] = 'N/A';
          });
          return acc;
        }, {});

        setExtractedData(fallback);
        setFormData(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchExtractedData();
  }, [invoice]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(extractedData);
  };
  const handleSave = () => {
    setIsEditing(false);
    setExtractedData(formData);
  };
  const handleConfirm = () => onClose();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center pt-8 pb-4">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[calc(100vh-10rem)]  shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Invoice Editor</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-0">
          <div className="flex flex-col space-y-0.1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-500">Extracting data...</p>
              </div>
            ) : (
              <>
                {fieldGroups.map((group, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <h3 className="text-md font-semibold text-gray-700 mb-2 border-b pb-1">
                      {group.title}
                    </h3>
                    <div className={`grid gap-2 ${group.title === 'Montants' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {group.fields.map((field) => (
                        <div key={field.name} className="mb-1">
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            name={field.name}
                            value={formData?.[field.name] || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-2 py-1.5 text-sm rounded border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                              isEditing 
                                ? 'bg-white border-gray-300 hover:border-gray-400' 
                                : 'bg-gray-100 border-gray-200'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end space-x-2 pt-0.5">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors text-sm"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={isEditing}
                        className={`px-4 py-2 ${isEditing ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded flex items-center transition-colors text-sm`}
                      >
                        <FaCheck className="mr-1" /> validate
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center transition-colors text-sm"
                      >
                        <FaTimes className="mr-1" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 flex items-center transition-colors text-sm"
                      >
                        <FaSave className="mr-1" /> Save Changes
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          

          <div className="flex flex-col h-full">
            <ZoomableImage imgUrl={`http://localhost:9090${invoice.img}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceScanEditor;