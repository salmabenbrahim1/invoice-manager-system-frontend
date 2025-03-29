import React, { useState } from 'react';
import SideBar from '../../components/SideBar';
import AddClientForm from './AddClientForm';
import { FaUser, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { useClient } from '../../components/client/ClientContext';
import UpdateClientForm from './UpdateClientForm';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal'; 

const ClientList = () => {
  const { clients, handleAddClient, handleDeleteClient, handleUpdateClient } = useClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const addClient = async (newClient) => {
    await handleAddClient(newClient);
    setShowAddModal(false);
  };

  // Show confirmation modal before deleting a client
  const requestDeleteClient = (clientId) => {
    setClientToDelete(clientId);
    setShowConfirmModal(true);
  };

  const deleteClient = async () => {
    if (clientToDelete) {
      await handleDeleteClient(clientToDelete);
      toast.success("Client deleted successfully.");
    } else {
      toast.info("Client deletion canceled.");
    }
    setClientToDelete(null);
    setShowConfirmModal(false);
  };

  // Open edit modal with selected client
  const openEditModal = (client) => {
    setClientToEdit(client);
    setShowEditModal(true);
  };
  // update a client
  const updateClient = async (clientId, updatedClient) => {
    await handleUpdateClient(clientId, updatedClient);
    setShowEditModal(false);
  };
  //Search for aclient by his name or email
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Clients</h2>
          
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border-2 border-gray-400 rounded-lg bg-gray-100 shadow-md"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FaUserPlus className="mr-2" /> Add Client
          </button>
        </div>

        <div>
          <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Email</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Phone Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 flex items-center">
                    <FaUser className="text-blue-500 mr-2" />
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <button 
                      onClick={() => openEditModal(client)}
                      className="text-blue-500 hover:text-blue-700 mr-2">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => requestDeleteClient(client._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientForm
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSave={addClient}
        />
      )}

      {/* Update Client Modal */}
      {showEditModal && clientToEdit && (
        <UpdateClientForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSave={updateClient}
          clientData={clientToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={deleteClient}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
};

export default ClientList;
