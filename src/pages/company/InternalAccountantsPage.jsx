import React, { useState } from "react";
import { FaUserPlus, FaEdit, FaToggleOn, FaToggleOff, FaTrash } from "react-icons/fa";
import AddInternalAccountantForm from "../../components/company/AddInternalAccountantForm"; 
import Pagination from "../../components/Pagination";
import { useUser } from "../../context/UserContext";
import ConfirmModal from "../../components/ConfirmModal";
import CompanyLayout from "../../components/company/CompanyLayout";

const InternalAccountantsPage = () => {
  const {
    users,
    handleDeleteUser,
    handleSaveUser,
    handleDesactivateUser,
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDesactivateModal, setShowDesactivateModal] = useState(false);
  const [userToDesactivate, setUserToDesactivate] = useState(null);

  const accountants = users.filter(
    (user) =>
      user.role === "INTERNAL ACCOUNTANT" &&
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const accountantsPerPage = 6;
  const totalPages = Math.ceil(accountants.length / accountantsPerPage);
  const currentUsers = accountants.slice(
    (currentPage - 1) * accountantsPerPage,
    currentPage * accountantsPerPage
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: e.target.email.value,
      phone: e.target.phone.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      role: "INTERNAL ACCOUNTANT",
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

  const handleDesactivateConfirmation = (user) => {
    setUserToDesactivate(user);
    setShowDesactivateModal(true);
  };

  const handleDesactivateUserConfirmed = () => {
    if (userToDesactivate) {
      const newActiveState = !userToDesactivate.active;
      handleDesactivateUser(userToDesactivate.id, newActiveState);
      setShowDesactivateModal(false);
      setUserToDesactivate(null);
    }
  };

  return (
    <CompanyLayout>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaUserPlus className="mr-2" />
          Add Internal Accountant
        </button>
      </div>

{/* Modal to add an internal accountant */}
      <AddInternalAccountantForm
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm text-gray-700">Email</th>
              <th className="px-6 py-3 border-b text-left text-sm text-gray-700">Phone</th>
              <th className="px-6 py-3 border-b text-left text-sm text-gray-700">Full Name</th>
              <th className="px-6 py-3 border-b text-left text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">{user.phone}</td>
                <td className="px-6 py-4 border-b">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4 border-b">
                  <div className="flex space-x-4 items-center">
                    <button onClick={() => handleEdit(user)} className="text-blue-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteConfirmation(user)} className="text-red-500">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleDesactivateConfirmation(user)}>
                      {user.active ? (
                        <FaToggleOn className="text-green-500" />
                      ) : (
                        <FaToggleOff className="text-gray-500" />
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
            Are you sure you want to delete the internal accountant with email{" "}
            <strong>{userToDelete?.email}</strong>?
          </p>
        }
        isDeactivation={false}
      />

      <ConfirmModal
        show={showDesactivateModal}
        onHide={() => setShowDesactivateModal(false)}
        onConfirm={handleDesactivateUserConfirmed}
        title={
          userToDesactivate?.active
            ? "Confirm Deactivation"
            : "Confirm Activation"
        }
        message={
          userToDesactivate?.active ? (
            <p>
              You are about to <strong>deactivate</strong> the user{" "}
              <strong>{userToDesactivate?.email}</strong>.
            </p>
          ) : (
            <p>
              You are about to <strong>activate</strong> the user{" "}
              <strong>{userToDesactivate?.email}</strong>.
            </p>
          )
        }
        isDesactivation={true}
        isActive={userToDesactivate?.active}
      />
    </CompanyLayout>
  );
};

export default InternalAccountantsPage;
