import React, { useState, useEffect, useCallback } from 'react';
import SidebarAccountant from '../../components/accountant/SidebarAccountant';
import AddClientForm from '../../components/client/AddClientForm';
import { FaUser, FaEdit, FaTrash, FaUserPlus, FaSearch, FaSync } from 'react-icons/fa';
import { useClient } from '../../contexts/ClientContext';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import UpdateClientForm from '../../components/client/UpdateClientForm';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const AccountantClientsPage = () => {
  const { clients, loading: contextLoading, fetchClients, addClient,updateClient,deleteClient } = useClient();
  const { user } = useAuth(); // Get the user from AuthContext
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  const clientsPerPage = 6;
  
 
const handleRefresh = useCallback(async () => {
  try {
    if (!user) throw new Error("User not authenticated");

    setOperationLoading(true);
    await fetchClients(user.id); 
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

  const handleAddClient = async (newClient) => {
    try {
      setOperationLoading(true);
      await addClient(newClient);
      setShowAddModal(false);
    } catch (error) {
      // Error is already handled by the context
    } finally {
      setOperationLoading(false);
    }
  };

  const requestDeleteClient = (client) => {
    setClientToDelete(client);
    setShowConfirmModal(true);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      setOperationLoading(true);
      await deleteClient(clientToDelete.id);
      toast.success('Client deleted successfully');
      setShowConfirmModal(false);
      setClientToDelete(null);
    } catch (error) {
      // Error is already handled by the context
    } finally {
      setOperationLoading(false);
    }
  };

  const openEditModal = (client) => {
    setClientToEdit(client);
    setShowEditModal(true);
  };

  const handleUpdateClient = async (clientId, updatedClient) => {
    try {
      setOperationLoading(true);
      await updateClient(clientId, updatedClient);
      setShowEditModal(false);
    } catch (error) {
      // Error is already handled by the context
    } finally {
      setOperationLoading(false);
    }
  };

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
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={contextLoading || operationLoading}
              >
                <FaSync className="mr-2" /> Refresh
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                disabled={contextLoading || operationLoading}
              >
                <FaUserPlus className="mr-2" /> Add Client
              </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <button
                          onClick={() => openEditModal(client)}
                          className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50"
                          disabled={contextLoading || operationLoading}
                        >
                          <FaEdit className="inline mr-1" />
                        </button>
                        <button
                          onClick={() => requestDeleteClient(client)}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          disabled={contextLoading || operationLoading}
                        >
                          <FaTrash className="inline mr-1" /> 
                        </button>
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


        {filteredClients.length >= clientsPerPage && (
          <div >
           
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


        <AddClientForm
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSave={handleAddClient}
          loading={operationLoading}
        />

        {clientToEdit && (
          <UpdateClientForm
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            onSave={handleUpdateClient}
            clientData={clientToEdit}
            loading={operationLoading}
          />
        )}

        <ConfirmModal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteClient}
          title="Delete Client"
          message={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone.`}
          loading={operationLoading}
        />
      </div>
    </div>
  );
};

export default AccountantClientsPage;
