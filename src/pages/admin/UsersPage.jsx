import  { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FaUserPlus, FaEdit, FaUser, FaBuilding, FaToggleOn, FaToggleOff, FaTrash, FaSearch } from "react-icons/fa";
import UserModal from "../../components/modals/UserModal";
import Pagination from "../../components/Pagination";
import { useUser } from "../../context/UserContext";
import ConfirmModal from "../../components/modals/ConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";

const UsersPage = () => {
  const {
    users,
    deleteUser,
    saveUser,
    toggleActivation,
    loading: contextLoading
  } = useUser();

  // States
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

  const usersPerPage = 6;

  if (contextLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner 
          size="lg"
          color="primary" 
          position="fixed"
          fullScreen={true}
          overlay={true}
          blur={true}
          text="Loading users"
        />
      </AdminLayout>
    );
  }

  // Handle user edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsPerson(user.role === "INDEPENDENT_ACCOUNTANT");
    setIsModalOpen(true);
  };

  // Handle user creation
  const handleSubmit = async (e) => {
    e.preventDefault();    
    const formData = {
      id: selectedUser?.id,
      email: e.target.email.value,
      phone: e.target.phone.value,
      cin: isPerson ? e.target.cin?.value : undefined,
      gender: isPerson ? e.target.gender?.value : undefined,
      firstName: isPerson ? e.target.firstName?.value : undefined,
      lastName: isPerson ? e.target.lastName?.value : undefined,
      companyName: !isPerson ? e.target.companyName?.value : undefined, 
      role: isPerson ? "INDEPENDENT_ACCOUNTANT" : "COMPANY",
    };
    
    try {
      const createdUser = await saveUser(formData, selectedUser?.id);
    
      toast.success("User created successfully!");
    
      const emailStatus = createdUser.emailSent ? 'sent' : 'failed';
      toast.info(`Email ${emailStatus === 'sent' ? 'sent' : 'not sent'}`);
    
      const emailHistory = JSON.parse(localStorage.getItem('emailHistory')) || [];
    
      const newEntry = {
        email: formData.email,
        subject: createdUser.subject || "No subject", 
        body: createdUser.body || "No body",
        status: emailStatus,
        date: new Date().toISOString()
      };
    
      localStorage.setItem('emailHistory', JSON.stringify([newEntry, ...emailHistory]));
    
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to create user.");
    }
    
    

  };

  // Handle user deletion confirmation
  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  // Handle user deletion
  const handleDeleteUserConfirmed = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  // Handle user deactivation confirmation
  const handleDeactivateConfirmation = (user) => {
    setUserToDeactivate(user);
    setShowDeactivateModal(true);
  };

  // Handle user deactivation/activation
  const handleDeactivateUserConfirmed = async () => {
    if (userToDeactivate) {
      const newActiveState = !userToDeactivate.active;
      await toggleActivation(userToDeactivate.id, newActiveState);
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
      <div className="px-4 sm:px-6 py-4">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Roles</option>
              <option value="COMPANY">Companies</option>
              <option value="INDEPENDENT_ACCOUNTANT">Accountants</option>
            </select>
            
            <button
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <FaUserPlus className="text-sm sm:text-base" />
              <span className="text-sm sm:text-base">Add User</span>
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
        />

        <div className="overflow-x-auto shadow rounded-lg">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg">
              <p className="text-lg">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <table className="hidden md:table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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
                        {user.role === "INDEPENDENT_ACCOUNTANT" ? (
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                        <button 
                          onClick={() => handleEdit(user)} 
                          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteConfirmation(user)} 
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button 
                          onClick={() => handleDeactivateConfirmation(user)} 
                          className={`p-1 rounded ${user.active ? "text-green-500 hover:bg-green-50" : "text-gray-500 hover:bg-gray-50"}`}
                          title={user.active ? "Deactivate" : "Activate"}
                        >
                          {user.active ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {currentUsers.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {user.role === "INDEPENDENT_ACCOUNTANT" ? (
                            <FaUser className="text-blue-500" />
                          ) : (
                            <FaBuilding className="text-green-500" />
                          )}
                          <span className="font-medium">
                            {user.firstName || user.companyName} {user.lastName || ""}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-sm text-gray-600">{user.phone}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => handleEdit(user)} 
                        className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteConfirmation(user)} 
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button 
                        onClick={() => handleDeactivateConfirmation(user)} 
                        className={`p-1 rounded ${user.active ? "text-green-500 hover:bg-green-50" : "text-gray-500 hover:bg-gray-50"}`}
                        title={user.active ? "Deactivate" : "Activate"}
                      >
                        {user.active ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>


        {filteredUsers.length >= 6 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </div>
        )}

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
        />
      </div>
    </AdminLayout>
  );
};

export default UsersPage;