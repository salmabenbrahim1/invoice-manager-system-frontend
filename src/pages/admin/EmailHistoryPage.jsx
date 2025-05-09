import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FaSearch, FaEnvelope, FaTimesCircle, FaCheckCircle, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmailDetailsModal from "../../components/modals/EmailDetailsModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getEmailLogs, deleteEmail } from "../../services/emailService";

const EmailHistoryPage = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  const emailsPerPage = 6;

  useEffect(() => {
    const storedEmailLogs = getEmailLogs();
    setEmailLogs(storedEmailLogs);
    setLoading(false);
  }, []);

  // Handle deleting email
  const handleAskDeleteEmail = (email) => {
    setEmailToDelete(email);
    setShowConfirmModal(true);
  };

  const handleConfirmDeleteEmail = () => {
    const updatedEmails = deleteEmail(emailLogs, emailToDelete);
    setEmailLogs(updatedEmails);

    if (selectedEmail === emailToDelete) {
      setSelectedEmail(null);
      setIsModalOpen(false);
    }

    toast.success(`Email sent to ${emailToDelete?.email} has been deleted successfully.`);
    setShowConfirmModal(false);
    setEmailToDelete(null);
  };

  const filteredEmails = emailLogs.filter((log) => {
    const matchesSearch =
      (log.recipient || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.subject || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);
  const currentEmails = filteredEmails.slice(
    (currentPage - 1) * emailsPerPage,
    currentPage * emailsPerPage
  );

  // Handle modal open
  const handleOpenModal = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner
          size="lg"
          color="primary"
          position="fixed"
          fullScreen
          overlay
          blur
          text="Loading email history"
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4" >
          <h1 className="text-2xl font-bold text-gray-800">Email History</h1>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by recipient or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Filtrage by statuts */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 w-full md:w-auto border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>


        {filteredEmails.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg">
            <p className="text-lg">No email logs found</p>
            <p className="text-sm mt-1">Try a different recipient or subject</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentEmails.map((email) => (
                  <tr
                    key={email.email + email.date}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOpenModal(email)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{email.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {email.status === "sent" ? email.subject : "No subject available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {email.status === "sent" ? (
                        <span className="inline-flex items-center gap-2 text-green-600">
                          <FaCheckCircle /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-red-600">
                          <FaTimesCircle /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(email.date).toLocaleString()}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleAskDeleteEmail(email)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Email"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredEmails.length >= 6 && (
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

      <EmailDetailsModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDeleteEmail}
        title="Confirm Deletion"
        message={
          <p>
            You are about to permanently delete the email log sent to{" "}
            <strong>{emailToDelete?.email}</strong>. <br />
            This action cannot be undone.
          </p>
        }
        isDeactivation={false}
      />
    </AdminLayout>
  );
};

export default EmailHistoryPage;
