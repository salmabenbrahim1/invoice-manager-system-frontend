import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaToggleOn, FaToggleOff, FaTrash } from "react-icons/fa";
import AddInternalAccountantForm from "../../components/company/AddInternalAccountantForm";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmModal";
import CompanyLayout from "../../components/company/CompanyLayout";
import axios from "axios";

const InternalAccountantsPage = () => {
  const [accountants, setAccountants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accountantToDelete, setAccountantToDelete] = useState(null);
  const [showDesactivateModal, setShowDesactivateModal] = useState(false);
  const [accountantToDesactivate, setAccountantToDesactivate] = useState(null);

  // Fetch the list of internal accountants
  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const response = await axios.get("/api/internal-accountants");
        setAccountants(response.data);
      } catch (error) {
        console.error("Error fetching accountants:", error);
      }
    };

    fetchAccountants();
  }, []);

  const accountantsPerPage = 6;
  const totalPages = Math.ceil(accountants.length / accountantsPerPage);
  const currentAccountants = accountants.slice(
    (currentPage - 1) * accountantsPerPage,
    currentPage * accountantsPerPage
  );

  const handleDeleteConfirmation = (accountant) => {
    setAccountantToDelete(accountant);
    setShowConfirmModal(true);
  };

  const handleDeleteAccountantConfirmed = async () => {
    if (accountantToDelete) {
      try {
        await axios.delete(`/api/internal-accountants/${accountantToDelete.id}`);
        setAccountants(accountants.filter((accountant) => accountant.id !== accountantToDelete.id));
        setShowConfirmModal(false);
      } catch (error) {
        console.error("Error deleting accountant:", error);
      }
      setAccountantToDelete(null);
    }
  };

  const handleDesactivateConfirmation = (accountant) => {
    setAccountantToDesactivate(accountant);
    setShowDesactivateModal(true);
  };

  const handleDesactivateAccountantConfirmed = async () => {
    if (accountantToDesactivate) {
      try {
        const newActiveState = !accountantToDesactivate.active;
        await axios.patch(`/api/internal-accountants/${accountantToDesactivate.id}`, {
          active: newActiveState,
        });
        setAccountants(
          accountants.map((accountant) =>
            accountant.id === accountantToDesactivate.id
              ? { ...accountant, active: newActiveState }
              : accountant
          )
        );
        setShowDesactivateModal(false);
      } catch (error) {
        console.error("Error updating active state:", error);
      }
      setAccountantToDesactivate(null);
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaUserPlus className="mr-2" />
          Add Internal Accountant
        </button>
      </div>

      {/* Modal to add an internal accountant */}
      <AddInternalAccountantForm
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
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
            {currentAccountants.map((accountant) => (
              <tr key={accountant.id}>
                <td className="px-6 py-4 border-b">{accountant.email}</td>
                <td className="px-6 py-4 border-b">{accountant.phone}</td>
                <td className="px-6 py-4 border-b">{accountant.firstName} {accountant.lastName}</td>
                <td className="px-6 py-4 border-b">
                  <div className="flex space-x-4 items-center">
                    <button onClick={() => handleDeleteConfirmation(accountant)} className="text-red-500">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleDesactivateConfirmation(accountant)} className="text-green-500">
                      {accountant.active ? <FaToggleOn /> : <FaToggleOff />}
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
        onNext={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
        onPrevious={() => setCurrentPage((page) => Math.max(page - 1, 1))}
      />

      {/* Confirm delete modal */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteAccountantConfirmed}
        message="Are you sure you want to delete this accountant?"
      />

      {/* Confirm desactivation modal */}
      <ConfirmModal
        show={showDesactivateModal}
        onHide={() => setShowDesactivateModal(false)}
        onConfirm={handleDesactivateAccountantConfirmed}
        message="Are you sure you want to deactivate/activate this accountant?"
      />
    </CompanyLayout>
  );
};

export default InternalAccountantsPage;
