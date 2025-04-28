import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FaUserPlus,
  FaEdit,
  FaUser,
  FaBuilding,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import UserModal from "../../components/admin/UserModal";
import Pagination from "../../components/Pagination";
import { useUser } from "../../context/UserContext";
import ConfirmModal from "../../components/modals/ConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";

const UsersPage = () => {
  const {
    users,
    deleteUser,
    saveUser,
    toggleActivation,
    loading: contextLoading
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPerson, setIsPerson] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const usersPerPage = 6;

  if (contextLoading) {
    return (
      <AdminLayout>
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsPerson(user.role === "INDEPENDENT ACCOUNTANT");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = {
      id: selectedUser?.id,
      email: e.target.email.value,
      phone: e.target.phone.value,
      cin: isPerson ? e.target.cin?.value : undefined,
      gender: isPerson ? e.target.gender?.value : undefined,
      firstName: isPerson ? e.target.firstName?.value : undefined,
      lastName: isPerson ? e.target.lastName?.value : undefined,
      companyName: !isPerson ? e.target.companyName?.value : undefined,
      role: isPerson ? "INDEPENDENT ACCOUNTANT" : "COMPANY",
    };
    
    try {
      await saveUser(formData);
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleDeleteUserConfirmed = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        await deleteUser(userToDelete.id);
        setShowConfirmModal(false);
        setUserToDelete(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeactivateConfirmation = (user) => {
    setUserToDeactivate(user);
    setShowDeactivateModal(true);
  };

  const handleDeactivateUserConfirmed = async () => {
    if (userToDeactivate) {
      setIsToggling(true);
      try {
        const newActiveState = !userToDeactivate.active;
        await toggleActivation(userToDeactivate.id, newActiveState);
        setShowDeactivateModal(false);
        setUserToDeactivate(null);
      } finally {
        setIsToggling(false);
      }
    }
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

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <AdminLayout>
      <div className="px-6 py-4">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="COMPANY">Companies</option>
              <option value="INDEPENDENT ACCOUNTANT">Accountants</option>
            </select>

            <button
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaUserPlus />
              Add User
            </button>
          </div>
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
          isSubmitting={isSubmitting}
        />

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === "INDEPENDENT ACCOUNTANT" ? (
                      <FaUser className="text-blue-500" />
                    ) : (
                      <FaBuilding className="text-green-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.firstName || user.companyName} {user.lastName || ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${user.active ? "text-green-600" : "text-red-500"}`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                    <button 
                      onClick={() => handleEdit(user)} 
                      className="text-blue-500 hover:text-blue-700"
                      disabled={isSubmitting || isDeleting || isToggling}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirmation(user)} 
                      className="text-red-500 hover:text-red-700"
                      disabled={isSubmitting || isDeleting || isToggling}
                    >
                      <FaTrash />
                    </button>
                    <button 
                      onClick={() => handleDeactivateConfirmation(user)} 
                      className="hover:text-gray-700"
                      disabled={isSubmitting || isDeleting || isToggling}
                    >
                      {user.active ? (
                        <FaToggleOn className="text-green-500 text-2xl" />
                      ) : (
                        <FaToggleOff className="text-gray-400 text-2xl" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={isSubmitting || isDeleting || isToggling}
        />

        <ConfirmModal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteUserConfirmed}
          title="Confirm Deletion"
          message={
            <p>
              You are about to permanently delete the user with email <strong>{userToDelete?.email}</strong>.
              This action cannot be undone.
            </p>
          }
          isDeactivation={false}
          isLoading={isDeleting}
        />

        <ConfirmModal
          show={showDeactivateModal}
          onHide={() => setShowDeactivateModal(false)}
          onConfirm={handleDeactivateUserConfirmed}
          title={userToDeactivate?.active ? "Confirm Deactivation" : "Confirm Activation"}
          message={
            userToDeactivate?.active ? (
              <>
                <p><strong className="text-orange-500">Warning:</strong> You are about to deactivate <strong>{userToDeactivate?.email}</strong>.</p>
                <p>This will <strong className="text-orange-500">prevent access</strong> to their account.</p>
              </>
            ) : (
              <>
                <p><strong className="text-green-600">Info:</strong> You are about to activate <strong>{userToDeactivate?.email}</strong>.</p>
                <p>This will <strong className="text-green-600">restore access</strong> to their account.</p>
              </>
            )
          }
          isDeactivation={true}
          isActive={userToDeactivate?.active}
          isLoading={isToggling}
        />
      </div>
    </AdminLayout>
  );
};

export default UsersPage;