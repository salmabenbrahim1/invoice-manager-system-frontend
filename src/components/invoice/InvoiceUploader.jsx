import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaFileUpload, FaTimes } from 'react-icons/fa';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceUploader = ({ onClose, onUploadSuccess }) => {
  const { isLoading, setIsLoading, currentFolderId } = useInvoice();
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
    setIsLoading(true);

    if (!invoiceName.trim() || !selectedFile) {
      toast.error('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    if (!currentFolderId) {
      toast.error('No folder selected');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('invoiceName', invoiceName);
      formData.append('status', status);
      formData.append('currentFolderId', currentFolderId);

      console.log('FormData contents before upload:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const uploadedInvoice = await onUploadSuccess(formData);

    //Reset form
      if (uploadedInvoice) {
        setInvoiceName('');
        setSelectedFile(null);
        setImageUrl('');
        setStatus('pending');

        onClose();
      }
      return uploadedInvoice;

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload invoice');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  //remove the invoie image/file from the uploader 
  const removeFile = () => {
    setSelectedFile(null);
    setImageUrl('');
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="invoiceName">
              Invoice Name <span className="text-red-500">*</span>
            </label>
            <input
              id="invoiceName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
              placeholder="Upload new Invoice"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="invoiceFile">
              Invoice Image <span className="text-red-500">*</span>
            </label>

            {imageUrl ? (
              <div className="relative mb-2">
                <img
                  src={imageUrl}
                  alt="Invoice preview"
                  className="max-h-60 mx-auto border rounded-md"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <label
                  htmlFor="invoiceFile"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <FaFileUpload className="text-gray-400 text-4xl mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG (Max. 5MB)
                  </p>
                </label>
                <input
                  id="invoiceFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-white bg-gray-500 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceUploader;