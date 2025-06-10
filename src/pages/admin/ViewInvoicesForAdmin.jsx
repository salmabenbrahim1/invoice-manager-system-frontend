import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { Eye } from 'lucide-react';
import moment from 'moment';
import Pagination from '../../components/Pagination';
import { useInvoice } from '../../contexts/InvoiceContext';
import InvoiceSavedViewer from '../../pages/company/SavedInvoiceViewerForAccountant';
import { toast } from 'react-toastify';

const ViewInvoicesForAdmin = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const {
    invoices,
    loading,
    error,
    fetchInvoices,
    fetchInvoiceById,
  } = useInvoice();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showSavedViewer, setShowSavedViewer] = useState(false);

  const invoicesPerPage = 7;

  useEffect(() => {
    if (folderId) {
      fetchInvoices(folderId);
    }
  }, [folderId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const query = searchQuery.toLowerCase();
    return (
      invoice.invoiceName?.toLowerCase().includes(query) ||
      invoice.status?.toLowerCase().includes(query) ||
      moment(invoice.addedAt).format('MMM D, YYYY').toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handleViewSavedData = async (invoiceId) => {
    try {
      const updatedInvoice = await fetchInvoiceById(invoiceId);
      setSelectedInvoice(updatedInvoice);
      setShowSavedViewer(true);
    } catch (error) {
      toast.error('Failed to fetch invoice details');
    }
  };

  const handleCloseViewer = () => {
    setSelectedInvoice(null);
    setShowSavedViewer(false);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-violet-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Folders
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Invoices in Folder</h1>
          <div className="relative w-full md:w-1/4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices by name, status"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {loading && <p>Loading invoices...</p>}
        {error && <p className="text-red-500">{error}</p>}

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
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                    Actions
                   </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices
                    .slice((currentPage - 1) * invoicesPerPage, currentPage * invoicesPerPage)
                    .map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {inv.img && (
                              <img
                                src={`http://localhost:9090${inv.img}`}
                                alt="Invoice"
                                className="w-10 h-10 object-cover rounded mr-3"
                              />
                            )}
                            <span className="text-gray-800 font-medium">{inv.invoiceName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(inv.addedAt).format('MMM D, YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inv.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : inv.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewSavedData(inv.id)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          >
                            <Eye size={18}/> View
                          </button>
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {showSavedViewer && selectedInvoice && (
          <InvoiceSavedViewer invoice={selectedInvoice} onClose={handleCloseViewer} />
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewInvoicesForAdmin;
