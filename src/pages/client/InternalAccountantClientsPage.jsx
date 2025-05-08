import React, { useState, useEffect, useCallback } from 'react';
import SidebarAccountant from '../../components/accountant/SidebarAccountant';
import { FaUser, FaSearch } from 'react-icons/fa';
import { useClient } from '../../context/ClientContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const InternalAccountantClientsPage = () => {
  const { clients, loading: contextLoading, fetchClients } = useClient();
  const { user } = useAuth(); // Get the user from AuthContext

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [operationLoading, setOperationLoading] = useState(false);

  const clientsPerPage = 10;
  
 
const handleRefresh = useCallback(async () => {
  try {
    if (!user) throw new Error("User not authenticated");

    setOperationLoading(true);
    await fetchClients(); 
    toast.success('Clients refreshed successfully');
  } catch (error) {
    toast.error(error.message || 'Failed to refresh clients');
  } finally {
    setOperationLoading(false);
  }
}, [fetchClients, user]);


  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  

  

  

  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      (client.phone && client.phone.replace(/\D/g, '').includes(searchQuery))
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  if (contextLoading && clients.length === 0) {
    return (
      <div className="flex h-screen">
        <SidebarAccountant />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <SidebarAccountant />
      <div className="flex flex-col flex-grow p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold">My Clients</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-md w-full"
              />
            </div>
            
          </div>
        </div>

        <div className="relative">
          {(contextLoading || operationLoading) && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}

          <div className="overflow-hidden rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedClients.length > 0 ? (
                  paginatedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       
                       
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No matching clients found" : "No clients available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {filteredClients.length > clientsPerPage && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * clientsPerPage + 1} to{' '}
              {Math.min(currentPage * clientsPerPage, filteredClients.length)} of{' '}
              {filteredClients.length} clients
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              onPageSelect={(page) => setCurrentPage(page)}
              disabled={contextLoading || operationLoading}
            />
          </div>
        )}


        

      
      </div>
    </div>
  );
};

export default InternalAccountantClientsPage;
