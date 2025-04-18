import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FaUserPlus, FaEdit, FaUser, FaBuilding, FaToggleOn, FaToggleOff,FaTrash } from "react-icons/fa";
import UserModal from "../../components/admin/UserModal";
import Pagination from "../../components/Pagination";
import { useUser } from "../../context/UserContext";
import ConfirmModal from "../../components/modals/ConfirmModal";

const UsersPage = () => {
  const {
    users,
    handleDeleteUser,
    handleSaveUser,
    handleDeactivateUser,
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPerson, setIsPerson] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const usersPerPage = 6;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);

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
      firstName: isPerson ? e.target.firstName?.value : undefined,
      lastName: isPerson ? e.target.lastName?.value : undefined,
      companyName: !isPerson ? e.target.companyName?.value : undefined,
      role: isPerson ? "INDEPENDENT ACCOUNTANT" : "COMPANY",
    };

    await handleSaveUser(formData, selectedUser?.id);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleDeleteUserConfirmed = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };



  const handleDeactivateConfirmation = (user) => {
    setUserToDeactivate(user);
    setShowDeactivateModal(true);
  };

  const handleDeactivateUserConfirmed = () => {
    if (userToDeactivate) {
      const newActiveState = !userToDeactivate.active;
      handleDeactivateUser(userToDeactivate.id, newActiveState);
      setShowDeactivateModal(false);
      setUserToDeactivate(null);
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
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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

        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaUserPlus className="mr-2" />
          Add Client
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
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">
                Phone
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-gray-700">
                Actions
              </th>
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
                <td className="px-6 py-4 border-b border-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {user.phone}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {user.role}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <div className="flex space-x-4 items-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button> <button
                      onClick={() => handleDeleteConfirmation(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>

                    <button
                      onClick={() => handleDeactivateConfirmation(user)}
                      className="hover:text-gray-700"
                    >
                      {user.active ? (
                        <FaToggleOn color="green" />
                      ) : (
                        <FaToggleOff color="gray" />
                      )}
                    </button>
                  </div>
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
      />

      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteUserConfirmed}
        title="Confirm Deletion"
        message={
          <p>
            You are about to permanently delete the user with email{" "}
            <strong>{userToDelete?.email}</strong>.
            This action cannot be undone.
          </p>
        }
        isDeactivation={false}
      />


      <ConfirmModal
        show={showDeactivateModal}
        onHide={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivateUserConfirmed}
        title={
          userToDeactivate?.active
            ? "Confirm Deactivation"
            : "Confirm Activation"
        }
        message={
          userToDeactivate?.active ? (
            <>
              <p>
                <span style={{ fontWeight: "bold", color: "orange" }}>Warning:</span>{" "}
                You are about to <strong>deactivate</strong> the user with the
                email <strong>{userToDeactivate?.email}</strong>.
              </p>
              <p>
                This will{" "}
                <span style={{ color: "orange", fontWeight: "bold" }}>prevent them</span>{" "}
                from logging into the system.
              </p>
            </>
          ) : (
            <>
              <p>
                <span style={{ fontWeight: "bold", color: "green" }}>Info:</span>{" "}
                You are about to <strong>activate</strong> the user with the
                email <strong>{userToDeactivate?.email}</strong>.
              </p>
              <p>
                This will{" "}
                <span style={{ color: "green", fontWeight: "bold" }}>restore access</span>{" "}
                to their account.
              </p>
            </>
          )
        }
        isDeactivation={true}
        isActive={userToDeactivate?.active}
      />
    </AdminLayout>
  );
};

export default UsersPage;
