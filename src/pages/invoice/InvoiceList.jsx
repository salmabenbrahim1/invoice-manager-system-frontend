import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoice } from '../../context/InvoiceContext';
import SidebarAccountant from '../../components/accountant/SidebarAccountant';
import { toast } from 'react-toastify';
import { FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import { MdDocumentScanner } from 'react-icons/md';

import { FaQrcode } from 'react-icons/fa';
import { AiOutlineUpload } from 'react-icons/ai';
import moment from 'moment';
import InvoiceUploader from '../../components/invoice/InvoiceUploader';
import InvoiceViewer from '../../components/invoice/InvoiceScanEditor';
import ImageInvoiceModal from '../../components/invoice/ImageInvoiceModal';
import InvoiceSavedViewer from '../../components/invoice/InvoiceSavedViewer';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';





const InvoiceList = () => {
  const { folderId } = useParams();
  const { invoices, fetchInvoices, deleteInvoice, selectedInvoice2, setSelectedInvoice2,fetchInvoiceById } = useInvoice();

  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(false);

  const [viewMode, setViewMode] = useState(null);

  useEffect(() => {
    if (folderId) {
      fetchInvoices(folderId);
    }
  }, [folderId]);
 

  const filteredInvoices = invoices
    .filter(
      (invoice) =>
        invoice?.folderId === folderId &&
        invoice?.invoiceName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((invoice) => ({
      ...invoice,
      reactKey: invoice.id,
    }));

  const confirmDelete = async () => {
    if (invoiceToDelete) {
      try {
        await deleteInvoice(invoiceToDelete.id);

        toast.success('Invoice deleted successfully');
      } catch (error) {
        toast.error('Failed to delete invoice');
      }
    }
    setInvoiceToDelete(null);
  };

  const handleShowInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('image');
  };

  const handleScanInvoice = () => {
    setViewMode('full');
  };

  const handleViewSavedData = async (invoice) => {
  try {
    const updatedInvoice = await fetchInvoiceById(invoice.id); // fetch from backend
    console.log(updatedInvoice);
    setSelectedInvoice(updatedInvoice); // set the updated one
    setViewMode('view');
  } catch (error) {
    toast.error("Failed to fetch updated invoice data");
  }
};



  const handleCloseViewer = () => {
    setViewMode(null);
    setSelectedInvoice(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAccountant />
      <div className="flex flex-col flex-grow p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage invoices</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            <button
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
              onClick={() => setShowUploader(true)}
            >
              <AiOutlineUpload className="mr-2" /> Upload Invoice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.reactKey} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {invoice.img && (
                            <img
                              src={`http://localhost:9090${invoice.img}`}
                              alt="Invoice"
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                          )}
                          <span className="text-gray-800 font-medium">{invoice.invoiceName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment(invoice.addedAt).format('MMM D, YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${invoice.status === 'processed'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : invoice.status === 'VALIDATED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {invoice.status}
                        </span>

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleShowInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Scan"
                          >
                            <MdDocumentScanner />
                          </button>
                          <button
                            onClick={() => setInvoiceToDelete(invoice)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => handleViewSavedData(invoice)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                            title="View">
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedInvoice && viewMode === 'view' && (
          <InvoiceSavedViewer
            invoice={selectedInvoice}
            onClose={handleCloseViewer}
          />
        )}


        {/* Uploader Modal */}
        {showUploader && (
          <InvoiceUploader

            folderId={folderId}
            onClose={(uploaded) => {

              setShowUploader(false); // Close the modal
              if (uploaded && folderId) {
                fetchInvoices(folderId); // Fetch updated invoices
              }
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {invoiceToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete invoice "{invoiceToDelete.invoiceName}"?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setInvoiceToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {selectedInvoice && viewMode === 'image' && (
          <ImageInvoiceModal
            imgUrl={`http://localhost:9090${selectedInvoice.img}`}
            onClose={handleCloseViewer}
            onScan={handleScanInvoice}
          />
        )}


        {/* Full Viewer with Form */}
        {selectedInvoice && viewMode === 'full' && (
          <InvoiceViewer
            invoice={selectedInvoice}
            onClose={handleCloseViewer}
          />
        )}


      </div>
    </div>
  );
};

export default InvoiceList;