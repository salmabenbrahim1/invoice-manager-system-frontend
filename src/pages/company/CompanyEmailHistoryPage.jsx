import React, { useEffect, useState } from "react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getCompanyEmailLogs, deleteCompanyEmail } from "../../services/emailService";
import { FaTrash, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ConfirmModal from "../../components/modals/ConfirmModal";
import EmailDetailsModal from "../../components/modals/EmailDetailsModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CompanyEmailHistoryPage = () => {
  const { user } = useAuth();
  const [emailLogs, setEmailLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const storedEmailLogs = getCompanyEmailLogs() || [];
    const currentCompanyEmail = user.email;

    const filteredEmails = storedEmailLogs.filter(
      (log) => log.companyEmail && log.companyEmail.toLowerCase() === currentCompanyEmail.toLowerCase()
    );

    setEmailLogs(filteredEmails);
    applyFilters(filteredEmails, searchTerm, statusFilter);
    setLoading(false);
  }, [user.email]);

  const applyFilters = (logs, search, status) => {
    let filtered = logs;

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          (log.receiver || "").toLowerCase().includes(term) ||
          (log.subject || "").toLowerCase().includes(term) ||
          (log.body || "").toLowerCase().includes(term)
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((log) => log.status === status);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(emailLogs, term, statusFilter);
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    applyFilters(emailLogs, searchTerm, status);
  };

  const handleOpenDetails = (log) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
  };

  const handleDelete = (log, e) => {
    e.stopPropagation();
    setSelectedLog(log);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (selectedLog) {
      try {
        const updatedLogs = deleteCompanyEmail(emailLogs, selectedLog);
        setEmailLogs(updatedLogs);
        applyFilters(updatedLogs, searchTerm, statusFilter);
        toast.success(`Email to ${selectedLog.receiver} deleted successfully`);
      } catch (error) {
        toast.error("Failed to delete email");
      } finally {
        setSelectedLog(null);
        setShowConfirmModal(false);
      }
    }
  };

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  if (loading) {
    return (
      <CompanyLayout>
        <LoadingSpinner
          size="lg"
          position="fixed"
          fullScreen
          overlay
          blur
          text="Loading email history"
        />
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">My Sent Emails</h1>

       <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by recipient or subject..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg">
            <p className="text-lg">No email logs found</p>
            <p className="text-sm mt-1">
              {searchTerm ? "Try a different search term" : "You haven't sent any emails yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenDetails(log)}>
                    <td className="px-6 py-4 whitespace-nowrap">{log.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === "sent" ? (
                        <span className="inline-flex items-center gap-2 text-green-600">
                          <FaCheckCircle /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-red-600">
                          <FaTimesCircle /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => handleDelete(log, e)} className="text-red-500 hover:text-red-700" title="Delete Email">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredLogs.length > logsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </div>
        )}

        <EmailDetailsModal email={selectedLog} isOpen={isDetailsModalOpen} onClose={handleCloseDetails} />

        <ConfirmModal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message={
            <p>
              You are about to permanently delete the email log sent to{" "}
              <strong>{selectedLog?.receiver}</strong>. <br />
              This action cannot be undone.
            </p>
          }
          isDeactivation={false}
        />
      </div>
    </CompanyLayout>
  );
};

export default CompanyEmailHistoryPage;
