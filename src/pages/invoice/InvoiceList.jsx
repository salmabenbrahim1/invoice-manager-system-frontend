import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoice } from '../../contexts/InvoiceContext';
import SidebarAccountant from '../../components/accountant/SidebarAccountant';
import { toast } from 'react-toastify';
import { FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import { MdDocumentScanner } from 'react-icons/md';
import { AiOutlineUpload } from 'react-icons/ai';
import moment from 'moment';
import InvoiceUploader from '../../components/invoice/InvoiceUploader';
import InvoiceViewer from '../../components/invoice/InvoiceScanEditor';
import ImageInvoiceModal from '../../components/invoice/ImageInvoiceModal';
import InvoiceSavedViewer from '../../components/invoice/InvoiceSavedViewer';
import { exportAllInvoicesToCSV } from '../../utils/exportToCSV'; // Assurez-vous que ce chemin est correct

const InvoiceList = () => {
  const { folderId } = useParams();
//const { invoices, fetchInvoices, deleteInvoice, selectedInvoice2, setSelectedInvoice2, fetchInvoiceById } = useInvoice();

  const { invoices, fetchInvoices, deleteInvoice, fetchInvoiceById } = useInvoice();

  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);

  useEffect(() => {
    if (folderId) {
      fetchInvoices(folderId);
    }
  }, [folderId]);

  const handleValidated = () => {

    fetchInvoices(folderId);
  };

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

      const updatedInvoice = await fetchInvoiceById(invoice.id);
      setSelectedInvoice(updatedInvoice);
      setViewMode('view');
    } catch (error) {
      toast.error('Failed to fetch updated invoice data');
    }
  };

  const handleCloseViewer = () => {
    setViewMode(null);
    setSelectedInvoice(null);
  };

  const toggleSelectAll = () => {
    const validatedIds = filteredInvoices.filter(inv => inv.status === 'Validated').map(inv => inv.id);
    const allSelected = validatedIds.every(id => selectedInvoiceIds.includes(id));
    if (allSelected) {
      setSelectedInvoiceIds(prev => prev.filter(id => !validatedIds.includes(id)));
    } else {
      setSelectedInvoiceIds(prev => [...new Set([...prev, ...validatedIds])]);
    }
  };

  const handleCheckboxChange = (invoiceId) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleExportSelected = () => {
    const selectedAndValidated = filteredInvoices.filter(
      (inv) => selectedInvoiceIds.includes(inv.id) && inv.status === 'Validated'
    );
    if (selectedAndValidated.length === 0) {
      toast.warn("No validated selected invoices to export.");
      return;
    }
    exportAllInvoicesToCSV(selectedAndValidated);
  };

  const allValidatedSelected = filteredInvoices
    .filter(inv => inv.status === 'Validated')
    .every(inv => selectedInvoiceIds.includes(inv.id));

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
              title="Export extracted data from selected validated invoices to CSV"
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
              onClick={handleExportSelected}
            >
              <AiOutlineUpload className="mr-2" />
              Export CSV
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    <input
                      type="checkbox"
                      checked={allValidatedSelected}
                      onChange={toggleSelectAll}
                      title="Select All Validated"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Invoice Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.reactKey} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          disabled={invoice.status !== 'Validated'}
                          checked={selectedInvoiceIds.includes(invoice.id)}
                          onChange={() => handleCheckboxChange(invoice.id)}
                        />
                      </td>
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
                              ${invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : invoice.status === 'Validated'
                                ? 'bg-green-100 text-green-800'
                                : invoice.status === 'Failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'

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
                            title="View"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedInvoice && viewMode === 'view' && (
          <InvoiceSavedViewer invoice={selectedInvoice} onClose={handleCloseViewer} />
        )}

        {showUploader && (
          <InvoiceUploader
            folderId={folderId}
            onClose={(uploaded) => {
              setShowUploader(false);
              if (uploaded && folderId) {
                fetchInvoices(folderId);
              }
            }}
          />
        )}

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

        {selectedInvoice && viewMode === 'image' && (
          <ImageInvoiceModal
            imgUrl={`http://localhost:9090${selectedInvoice.img}`}
            onClose={handleCloseViewer}
            onScan={handleScanInvoice}
          />
        )}

        {selectedInvoice && viewMode === 'full' && (
          <InvoiceViewer
            invoice={selectedInvoice}
            onClose={handleCloseViewer}
            onValidated={handleValidated}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
