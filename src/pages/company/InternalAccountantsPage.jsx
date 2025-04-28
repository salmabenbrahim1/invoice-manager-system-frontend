import React, { useState} from "react";
import { FaUserPlus, FaEdit, FaToggleOn, FaToggleOff, FaTrash, FaSearch } from "react-icons/fa";
import InternalAccountantForm from "../../components/company/InternalAccountantForm";
import Pagination from "../../components/Pagination";
import { useUser } from "../../context/UserContext";
import ConfirmModal from "../../components/ConfirmModal";
import CompanyLayout from "../../components/company/CompanyLayout";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const InternalAccountantsPage = () => {
  const {
    users,
    loading: contextLoading,
    deleteUser,
    toggleActivation,
    refreshUsers
   
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  // Filter internal accountants
  const accountants = users.filter(
    (user) =>
      user.role === "INTERNAL ACCOUNTANT" &&
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const accountantsPerPage = 7;
  const totalPages = Math.ceil(accountants.length / accountantsPerPage);
  const currentAccountants = accountants.slice(
    (currentPage - 1) * accountantsPerPage,
    currentPage * accountantsPerPage
  );

  // Handle loading state
  if (contextLoading) {
    return (
      <CompanyLayout>
        <LoadingSpinner
          size="lg"
          color="primary"
          position="fixed"
          fullScreen={true}
          overlay={true}
          blur={true}
          text="Loading Accountants"
        />
      </CompanyLayout>
    );
  }

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleDeleteUserConfirmed = async () => {
    try {
      await deleteUser(userToDelete.id);
      toast.success("Accountant deleted successfully");
      refreshUsers();
    } catch (err) {
      toast.error(err.message || "Failed to delete accountant");
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const handleToggleConfirmation = (user) => {
    if (!user) {
      toast.error("Invalid user selected for activation.");
      return;
    }
    setUserToToggle(user);
    setShowToggleModal(true);
  };

  const handleToggleConfirmed = async () => {
    if (!userToToggle || userToToggle === null) {
      toast.error("No user selected for toggling.");
      return;
    }

    try {
      await toggleActivation(userToToggle?.id);

      refreshUsers();
    } catch (err) {
      console.error('Toggle Activation Error:', err);
      toast.error(err.message || "Failed to toggle activation");
    } finally {
      setShowToggleModal(false);
      setUserToToggle(null);
    }
  };

 
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <CompanyLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Search and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search accountants by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full md:w-auto"
          >
            <FaUserPlus className="mr-2" />
            Add Internal Accountant
          </button>
        </div>

        {/* Add/Edit Accountant Form */}
        <InternalAccountantForm
          show={isModalOpen}
          onHide={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          userToEdit={selectedUser}
        />

        {/* Accountants Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {accountants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No accountants added yet" : "No internal accountants available"}
            </div>
          ) : currentAccountants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No matching accountants found" : "No internal accountants available"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentAccountants.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => handleToggleConfirmation(user)}
                            className={user?.active ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}
                            title={user.active ? "Deactivate" : "Activate"}
                          >
                            {user.active ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 ">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteUserConfirmed}
          title="Confirm Deletion"
          message={
            <p>
              Are you sure you want to permanently delete accountant <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?
              <br />
              <span className="text-red-600">This action cannot be undone.</span>
            </p>
          }
          isDeactivation={false}
        />

        {/* Activation/Deactivation Confirmation Modal */}
        <ConfirmModal
          show={showToggleModal}
          onHide={() => setShowToggleModal(false)}
          onConfirm={handleToggleConfirmed}
          title={userToToggle?.active ? "Confirm Deactivation" : "Confirm Activation"}
          message={
            <p>
              Are you sure you want to {userToToggle?.active ? 'deactivate' : 'activate'} accountant{' '}
              <strong>{userToToggle?.firstName} {userToToggle?.lastName}</strong>?
              <br />
              {userToToggle?.active ? (
                <span className="text-yellow-600">This accountant will lose system access.</span>
              ) : (
                <span className="text-green-600">This accountant will regain system access.</span>
              )}
            </p>
          }
          isDeactivation={true}
          isActive={userToToggle?.active}
        />
      </div>
    </CompanyLayout>
  );
};

export default InternalAccountantsPage;
