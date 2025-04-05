import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClients, deleteClient } from "../services/manageClientsService";
import CompanyLayout from "../components/CompanyLayout";

const ManageClientsPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); 
    const clientsPerPage = 6;

    useEffect(() => {
        fetchClientsData();
    }, []);

    const fetchClientsData = async () => {
        try {
            setLoading(true);
            const data = await fetchClients();
            setClients(data);
        } catch (error) {
            setError("Error loading clients.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteClient(id);
            fetchClientsData();
            toast.success("Client successfully deleted!");
        } catch (error) {
            toast.error("Error deleting client.");
        }
    };

    // Filtering and searching 
    const filteredClients = clients.filter((client) =>
        (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredClients.length / clientsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
      <CompanyLayout>
        <div className="admin-container">
            <div className="flex justify-between mb-4">
                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaUserPlus /> Add Client
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Name</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Email</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Phone</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Accountant</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-6 py-4 border-b border-gray-300">{client.name}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{client.email}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{client.phone}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{client.accountantName}</td>
                                <td className="px-6 py-4 border-b border-gray-300">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-700">
                    Affichage {indexOfFirstClient + 1} à {Math.min(indexOfLastClient, filteredClients.length)} de {filteredClients.length} clients
                </span>
                <div className="flex space-x-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        <FaArrowLeft className="mr-2" /> Previous
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === Math.ceil(filteredClients.length / clientsPerPage)}
                        className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next <FaArrowRight className="ml-2" />
                    </button>
                </div>
            </div>

            <ToastContainer />
        </div>
      </CompanyLayout>
    );
};

export default ManageClientsPage;
