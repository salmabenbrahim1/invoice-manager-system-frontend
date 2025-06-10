import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { extractInvoiceData } from '../../services/InvoiceService';
import invoiceService from '../../services/InvoiceService';
import ZoomableImage from '../ZoomableImage';
import { toast } from 'react-toastify';
import { useInvoice } from '../../contexts/InvoiceContext';
import { useRef } from 'react';
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const InvoiceScanEditor = ({ invoice, onClose }) => {
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [extractionError, setExtractionError] = useState(false);
  const { fetchInvoices } = useInvoice();
  const folderId = invoice?.folderId;

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
      title: "Seller Information",
      fields: [
        { name: 'sellerName', label: 'Seller Name' },
        { name: 'sellerAddress', label: 'Seller Address' },
        { name: 'sellerPhone', label: 'Seller Phone' },
        { name: 'sellerEmail', label: 'Seller Email' }
      ]
    },
    {
      title: "Customer Information",
      fields: [
        { name: 'customerName', label: 'Customer Name' },
        { name: 'customerAddress', label: 'Customer Address' },
        { name: 'customerPhone', label: 'Customer Phone' },
        { name: 'customerEmail', label: 'Customer Email' }

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
    setExtractionError(false);

    try {
      const data = await extractInvoiceData(invoice.img);

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No usable data returned from extraction");
      }
      setFormData(data);
      setExtractedData(data);
    } catch (error) {
      console.error("Error extracting data:", error);
      setExtractionError(true);
    } finally {
      setLoading(false);
    }
  };

  const didFetch = useRef(false);

  //
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchData();
  }, [invoice]);


  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(extractedData);
  };

  const handleSave = async () => {
    try {
      await invoiceService.saveInvoice(invoice.id, {
        ...formData,
        status: 'Validated',
      });
      toast.success('Invoice saved successfully!');
      setIsEditing(false);
      const updatedInvoice = { ...invoice, status: 'Validated' };
      setFormData(updatedInvoice); // Update formData 
      onClose();

      fetchInvoices(folderId); // Refresh the invoices list 
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
  const handleCancel = async () => {
    try {
      await invoiceService.updateInvoice(invoice.id, {
        ...formData,
        status: 'Failed'
      });
      toast.info('Invoice marked as failed.');
      onClose(); // Close the modal
      fetchInvoices(folderId); // Refresh the invoice list
    } catch (error) {
      toast.error('Failed to mark the invoice as failed.');
    }
  };
  const allFieldsAreNA = () => {
    return Object.values(formData || {}).every(value => value === "N/A");
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
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div
                className="w-8 h-8 border-3 border-blue-100 border-t-blue-500 rounded-full animate-spin"
                aria-label="Loading spinner"
              />
              <p className="text-sm text-gray-600">Extracting data...</p>
            </div>
          ) : (
            <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {allFieldsAreNA() && !isEditing ? (
                <div className="flex flex-col justify-center items-center h-full text-center p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-red-600">
                    <p className="font-medium text-medium">
                      A problem has occurred — the invoice may not be clear.
                    </p>
                  </div>
                  <button
                    onClick={fetchData}
                    className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fieldGroups.map((group, index) => (
                    <div key={`group-${index}`} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                      <h3 className="text-md font-semibold text-gray-800 p-3 border-b border-gray-200">
                        {group.title}
                      </h3>
                      <div
                        className={`grid gap-4 p-3 ${group.title === 'Amounts' ? 'grid-cols-3' : 'grid-cols-2'
                          }`}
                      >
                        {group.fields.map((field) => (
                          <div key={field.name} className="space-y-1.5">
                            <label
                              htmlFor={field.name}
                              className="block text-xs font-medium text-gray-700"
                            >
                              {field.label}
                            </label>
                            <input
                              type="text"
                              id={field.name}
                              name={field.name}
                              value={formData?.[field.name] || 'N/A'}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              aria-disabled={!isEditing}
                              className={`w-full px-3 py-2 text-sm rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing
                                  ? 'bg-white border-gray-300 hover:border-gray-400'
                                  : 'bg-gray-100 border-gray-200 cursor-not-allowed'
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
          )}


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
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  <FaCheck /> Validate
                </button>
                <button onClick={handleEditClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <FaEdit /> Edit
                </button>
                <button onClick={handleCancel} className=" flex items-center gap-2 px-4 py-2 text-white rounded-md bg-red-700 text-white rounded-md hover:bg-red-800">
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  <FaCheck /> Validate
                </button>
                <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  <FaTimes /> Cancel
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
