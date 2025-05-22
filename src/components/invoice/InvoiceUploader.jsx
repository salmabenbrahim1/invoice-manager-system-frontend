import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaFileUpload, FaTimes } from 'react-icons/fa';
import { useInvoice } from '../../contexts/InvoiceContext';
import { useParams } from 'react-router-dom';

const InvoiceUploader = ({ onClose }) => {

  const { folderId } = useParams(); // folderId from URL
 
  const { createInvoice } = useInvoice(); //From the invoice context

  const [invoiceName, setInvoiceName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('pending');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceName.trim() || !selectedFile) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!folderId) {
      toast.error('No folder selected');
      return;
    }

    const formData = new FormData();
    formData.append('invoiceName', invoiceName);
    formData.append('status', status);
    formData.append('folderId', folderId);
    formData.append('file', selectedFile); 

    try {
      await createInvoice(formData); 
      toast.success('Invoice uploaded successfully');

      onClose(false);  // Close the form after successful submission

      // Reset the form after submission
      setInvoiceName('');
      setSelectedFile(null);
      setImageUrl('');
    } catch (error) {
      toast.error('Failed to upload invoice');
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Upload New Invoice</h3>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">

          {/* Invoice Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Invoice Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
              placeholder="Upload new Invoice"
              required
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Invoice Image <span className="text-red-500">*</span>
            </label>
            {imageUrl ? (
              <div className="relative mb-2">
                <img src={imageUrl} alt="Invoice preview" className="max-h-60 mx-auto border rounded-md" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImageUrl('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <label className="cursor-pointer flex flex-col items-center justify-center">
                  <FaFileUpload className="text-gray-400 text-4xl mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max. 5MB)</p>
                  <input
                    type="file"ng
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border text-white bg-gray-500 hover:bg-gray-700 rounded-md"
              
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              
            >
              Upload Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceUploader;
