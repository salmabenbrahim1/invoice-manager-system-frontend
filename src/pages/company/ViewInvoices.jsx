import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CompanyLayout from '../../components/company/CompanyLayout';
import moment from 'moment';

const ViewInvoices = () => {
  const { folderId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [viewMode, setViewMode] = useState(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/invoices/folder/${folderId}`);
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        } else {
          console.error("Failed to fetch invoices:", response.status);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    loadInvoices();
  }, [folderId]);

  const handleCloseViewer = () => {
    setViewMode(null);
    setInvoice(null);
  };

  return (
    <CompanyLayout>
      <div className="flex flex-col flex-grow p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Invoices in Folder</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${inv.status === 'processed'
                            ? 'bg-green-100 text-green-800'
                            : inv.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Action vide */}
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
      </div>
    </CompanyLayout>
  );
};

export default ViewInvoices;
