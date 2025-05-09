import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaCheck, FaRedo } from 'react-icons/fa';
import { extractInvoiceData} from '../../services/InvoiceService';
import invoiceService from '../../services/InvoiceService';
import ZoomableImage from '../ZoomableImage';
import { toast } from 'react-toastify';

const InvoiceScanEditor = ({ invoice, onClose }) => {
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [extractionFailed, setExtractionFailed] = useState(false);

  const fieldGroups = [
    {
      title: "Invoice Metadata",
      fields: [
        { name: 'invoiceNumber', label: 'Invoice Number' },
        { name: 'invoiceDate', label: 'Invoice Date' },
        { name: 'dueDate', label: 'Due Date' },
        { name: 'currency', label: 'Currency' }
      ]
    },
    {
      title: "Seller Informations",
      fields: [
        { name: 'sellerName', label: 'Seller Name' },
        { name: 'sellerAddress', label: 'Seller Address' },
        { name: 'sellerPhone', label: 'Seller Phone' },
        { name: 'sellerSiretNumber', label: 'SIRET Number' }
      ]
    },
    {
      title: "Customer Informations",
      fields: [
        { name: 'customerName', label: 'Customer Name' },
        { name: 'customerAddress', label: 'Customer Address' },
        { name: 'customerPhone', label: 'Customer Phone' }
      ]
    },
    {
      title: "Amounts",
      fields: [
        { name: 'tva', label: 'TVA' },
        { name: 'tvaNumber', label: 'TVA Number' },
        { name: 'tvaRate', label: 'TVA Rate (%)' },
        { name: 'ht', label: 'HT' },
        { name: 'ttc', label: 'TTC' },
        { name: 'discount', label: 'Discount' }
      ]
    }
  ];

  const fetchData = async () => {
    if (!invoice?.img) return;
    setLoading(true);
    setExtractionFailed(false);

    try {
      const data = await extractInvoiceData(invoice.img); //from invoice Service
      setExtractedData(data);
      setFormData(data);
    } catch (error) {
      setExtractionFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [invoice]);


  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(extractedData);
  };
  
  const handleSave = async () => {
    // Save the data even if there are missing fields
    try {
      await invoiceService.saveInvoice(invoice.id, formData);
      toast.success('Invoice saved successfully!');
      setIsEditing(false); 
    } catch (error) {
      toast.error('Error while saving the invoice.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      return updatedData;
    });
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black bg-opacity-50 flex items-start justify-center pt-20 pb-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 w-full max-w-6xl max-h-[calc(100vh-6rem)] flex flex-col shadow-xl relative mt-4">

        <div className="sticky top-0 bg-white z-10 pb-3 -mx-4 px-4 border-b flex justify-between items-center">
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
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 flex-1 overflow-hidden">

          {/* Left panel - Form fields */}
          <div className="flex flex-col overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-500">Extracting data...</p>
              </div>
            ) : extractionFailed ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-red-600 text-sm mb-3">Failed to extract data from this invoice.</p>

                <button onClick={fetchData} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center">
                  <FaRedo className="mr-2" /> Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {fieldGroups.map((group, index) => (
                  <div key={index} className="bg-gray-50 rounded-md mb-3 overflow-hidden">
                    <h3 className="text-md font-semibold text-gray-700 p-3 border-b">{group.title}</h3>
                    <div className={`grid gap-3 p-3 ${group.title === 'Amounts' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {group.fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">{field.label}</label>
                          <input
                            type="text"
                            name={field.name}
                            value={formData?.[field.name] || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 text-sm rounded border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
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
              </div>
            )}
          </div>
  
          {/* Right panel - Image */}
          <div className="flex flex-col h-full sticky top-16">
            <div className="bg-gray-50 rounded-md p-4 h-full overflow-hidden">
              <ZoomableImage imgUrl={`http://localhost:9090${invoice.img}`} />
            </div>
          </div>
        </div>
  
        {/* Sticky action buttons */}
        <div className="sticky bottom-0 bg-white pt-3 pb-2 -mx-4 px-4 border-t">
          <div className="flex justify-end space-x-2">
            {!isEditing ? (
              <>
                <button onClick={handleEditClick} className= "   flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"> <FaEdit/>  Edit</button>
                <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Close</button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className=" flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  <FaCheck className="mr-2" /> Validate
                </button>

                <button onClick={handleCancelEdit} className=" flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceScanEditor;
