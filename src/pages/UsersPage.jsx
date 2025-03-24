import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaUserPlus, FaEdit, FaTrash, FaArrowRight, FaArrowLeft, FaUser, FaBuilding } from "react-icons/fa";
import UserModal from "../components/UserModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPerson, setIsPerson] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // État pour la pagination
    const [filterRole, setFilterRole] = useState("all"); // État pour le filtre par rôle
    const [searchQuery, setSearchQuery] = useState(""); // État pour la barre de recherche
    const usersPerPage = 6; // Nombre d'utilisateurs à afficher par page

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch("http://localhost:9090/api/users")
            .then((response) => response.json())
            .then((data) => {
                console.log("Users data:", data); // Debugging
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error); // Debugging
                setError("Error fetching users.");
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:9090/api/users/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    fetchUsers();
                    toast.success("User deleted successfully!");
                } else {
                    toast.error("Error deleting the user.");
                }
            })
            .catch(() => {
                toast.error("Error deleting the user.");
            });
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            email: e.target.email.value,
            phone: e.target.phone.value,
            cin: isPerson ? e.target.cin?.value : undefined,
            gender: isPerson ? e.target.gender?.value : undefined,
            companyName: !isPerson ? e.target.companyName?.value : undefined,
            role: isPerson ? "INDEPENDENT ACCOUNTANT" : "COMPANY",
        };

        setLoading(true);
        setError(null);

        const url = selectedUser ? `http://localhost:9090/api/users/${selectedUser.id}` : "http://localhost:9090/api/users";
        const method = selectedUser ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                fetchUsers();
                toast.success(selectedUser ? "User updated successfully!" : "User added successfully!");
                setLoading(false);
                setIsModalOpen(false);
                setSelectedUser(null);
            })
            .catch(() => {
                toast.error(selectedUser ? "Error updating the user." : "Error adding the user.");
            });
    };

    // Filtrage des utilisateurs par rôle et recherche
    const filteredUsers = users.filter((user) => {
        const matchesRole = filterRole === "all" || user.role === filterRole;

        const matchesSearch =
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesRole && matchesSearch;
    });

    // Calcul des utilisateurs à afficher pour la page actuelle
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Fonction pour revenir à la page précédente
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    {/* Barre de recherche */}
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Filtre par rôle */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="COMPANY">COMPANY</option>
                        <option value="INDEPENDENT ACCOUNTANT">INDEPENDENT ACCOUNTANT</option>
                    </select>
                </div>

                {/* Bouton "Add Client" */}
                <button
                    onClick={() => {
                        setSelectedUser(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaUserPlus /> Add Client
                </button>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleSubmit}
                isPerson={isPerson}
                setIsPerson={setIsPerson}
                error={error}
                user={selectedUser}
            />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Type</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Email</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Phone</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Role</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 border-b border-gray-300">
                                    {user.role === "INDEPENDENT ACCOUNTANT" ? (
                                        <FaUser className="text-blue-500" />
                                    ) : (
                                        <FaBuilding className="text-green-500" />
                                    )}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-300">{user.email}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{user.phone}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{user.role}</td>
                                <td className="px-6 py-4 border-b border-gray-300">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
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

            {/* Pagination et affichage du nombre d'utilisateurs */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-700">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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
                        disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                        className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next <FaArrowRight className="ml-2" />
                    </button>
                </div>
            </div>

            <ToastContainer />
        </AdminLayout>
    );
};

export default UsersPage;