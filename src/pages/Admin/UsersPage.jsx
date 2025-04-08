import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FaUserPlus, FaEdit, FaTrash, FaUser, FaBuilding } from "react-icons/fa";
import UserModal from "../../components/admin/UserModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../components/Pagination";
import { useUsers } from "../../context/UserContext";

const UsersPage = () => {
    const { users, loading, handleDelete, handleSave } = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPerson, setIsPerson] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterRole, setFilterRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const usersPerPage = 6;

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            email: e.target.email.value,
            phone: e.target.phone.value,
            cin: isPerson ? e.target.cin?.value : undefined,
            gender: isPerson ? e.target.gender?.value : undefined,
            companyName: !isPerson ? e.target.companyName?.value : undefined,
            role: isPerson ? "INDEPENDENT ACCOUNTANT" : "COMPANY",
        };

        await handleSave(formData, selectedUser?.id);
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter((user) => {
        const matchesRole = (filterRole === "all" || user.role === filterRole) && user.role !== "ADMIN";
        const matchesSearch =
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesRole && matchesSearch;
    });
    
//Pagination
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <AdminLayout>
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    {/* Search bar */}
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Filter by role */}
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

                {/* Add Client button */}
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

            {/* Pagination */}

            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onNext={() => setCurrentPage(currentPage + 1)} 
                onPrev={() => setCurrentPage(currentPage - 1)} 
            />

            <ToastContainer />
        </AdminLayout>
    );
};

export default UsersPage;  