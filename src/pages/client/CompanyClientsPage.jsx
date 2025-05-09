import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FaUser, FaSearch } from 'react-icons/fa';
import AddClientForm from "../../components/client/AddClientForm";
import UpdateClientForm from "../../components/client/UpdateClientForm";
import Pagination from '../../components/Pagination';
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useClient } from "../../context/ClientContext";
import { useUser } from '../../context/UserContext';
import { toast } from "react-toastify";
import CompanyLayout from "../../components/company/CompanyLayout";

const CompanyClientsPage = () => {
  const { clients, handleAddClient, deleteClient, updateClient, assignAccountantToClient } = useClient();
  const { getInternalAccountants } = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [internalAccountants, setInternalAccountants] = useState([]);
  const [selectedAccountants, setSelectedAccountants] = useState({});
  const [reassigningClientId, setReassigningClientId] = useState(null);


  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const accountants = await getInternalAccountants();
        setInternalAccountants(accountants || []);
      } catch (error) {
        console.error("Failed to fetch internal accountants", error);
      }
    };

    fetchAccountants();
  }, [getInternalAccountants]);

  const clientsPerPage = 6;

  //add client 
  const addClient = async (newClient) => {
    await handleAddClient(newClient);
    setShowAddModal(false);
  };

  //delete client
  const requestDeleteClient = (client) => {
    setClientToDelete(client);
    setShowConfirmModal(true);
  };
//confirm delete client
  const handleDeleteClient = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete.id);
      toast.success("Client deleted successfully.");
    } else {
      toast.info("Client deletion canceled.");
    }
    setClientToDelete(null);
    setShowConfirmModal(false);
  };

  //open edit modal
  const openEditModal = (client) => {
    setClientToEdit(client);
    setShowEditModal(true);
  };
//update client
  const handleUpdateClient = async (clientId, updatedClient) => {
    await updateClient(clientId, updatedClient);
    setShowEditModal(false);
  };

  

//assign accountant to client
  const handleAssignClientToAccountant = async (clientId, accountantId) => {
    if (accountantId) {
      try {
        await assignAccountantToClient(clientId, accountantId);

        setSelectedAccountants(prev => ({
          ...prev,
          [clientId]: ""
        }));
        toast.success("Client assigned to accountant successfully.");
      } catch (error) {
        toast.error("Failed to assign accountant to client.");
        console.error(error);
      }
    } else {
      toast.error("Please select an accountant to assign.");
    }
  };

  //reassign client
  const handleReassignClient = (clientId) => {
    setReassigningClientId(clientId);
  };

  const filteredClients = clients.filter((client) =>
    (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  const getAccountantDisplayName = (client) => {
    if (client.accountantFirstName && client.accountantLastName) {
      return `${client.accountantFirstName} ${client.accountantLastName}`;
    }
    if (client.assignedTo) {
      const accountant = internalAccountants.find(acc => acc.id === client.assignedTo.id);
      return accountant ? `${accountant.firstName} ${accountant.lastName}` : "Accountant";
    }
    return "Not assigned";
  };

  return (
    <CompanyLayout>
      <div className="flex h-screen">
        <div className="flex flex-col flex-grow p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Clients</h2>
            <div className="flex space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-md"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <FaUserPlus className="mr-2" /> Add Client
              </button>
            </div>
          </div>

          <div>
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Email</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Phone Number</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Actions</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">Accountant</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 flex items-center">
                      <FaUser className="text-blue-500 mr-2" />
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => requestDeleteClient(client)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reassigningClientId === client.id || !client.assignedTo ? (
                        <div className="flex items-center">
                          <select
                            value={selectedAccountants[client.id] || ""}
                            onChange={(e) =>
                              setSelectedAccountants((prev) => ({
                                ...prev,
                                [client.id]: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded p-2 text-sm"
                          >
                            <option value="">Select Accountant</option>
                            {internalAccountants.map((accountant) => (
                              <option key={accountant.id} value={accountant.id}>
                                {accountant.firstName} {accountant.lastName}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              const accountantId = selectedAccountants[client.id];
                              handleAssignClientToAccountant(client.id, accountantId);
                              setReassigningClientId(null); // exit reassignment mode
                            }}
                            className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            disabled={!selectedAccountants[client.id]}
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setReassigningClientId(null)}
                            className="ml-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="mr-2 font-medium">
                            {getAccountantDisplayName(client)}
                          </span>
                          <button
                            onClick={() => handleReassignClient(client.id)}
                            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-gray-300 text-sm"
                          >
                            Change
                          </button>
                        </div>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length > 6 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </div>
          )}
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
            onSave={handleUpdateClient}
            clientData={clientToEdit}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteClient}
          title="Delete Client"
          message={`Are you sure you want to delete the client "${clientToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </CompanyLayout>
  );
};

export default CompanyClientsPage;