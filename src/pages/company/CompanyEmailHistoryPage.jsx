import React, { useEffect, useState } from "react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { useAuth } from "../../context/AuthContext";
import { getEmailLogs, deleteEmail} from "../../services/emailService";
import { FaTrash } from "react-icons/fa";
import ConfirmModal from "../../components/modals/ConfirmModal";

const CompanyEmailHistoryPage = () => {
  const { user } = useAuth();
  const [emailLogs, setEmailLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
useEffect(() => {
  const storedEmailLogs = getEmailLogs();

  // Récupérer l'utilisateur connecté depuis localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Filtrer uniquement les emails envoyés par cette entreprise
  const filteredLogs = user?.role === "COMPANY"
    ? storedEmailLogs.filter(log => log.senderId === user.id) // ou log.companyId === user.id
    : storedEmailLogs;

  setEmailLogs(filteredLogs);
  setLoading(false);
}, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = emailLogs.filter(
      (log) =>
        log.receiver.toLowerCase().includes(term) ||
        log.subject.toLowerCase().includes(term) ||
        log.body.toLowerCase().includes(term)
    );
    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (log) => {
    setSelectedLog(log);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (selectedLog) {
      await deleteEmail(selectedLog.id);
      const updatedLogs = emailLogs.filter((log) => log.id !== selectedLog.id);
      setEmailLogs(updatedLogs);
      setFilteredLogs(updatedLogs);
      setSelectedLog(null);
      setShowConfirmModal(false);
    }
  };

  return (
    <CompanyLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Sent Emails</h1>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/3"
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Receiver</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Body</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2">{log.receiver}</td>
                    <td className="px-4 py-2">{log.subject}</td>
                    <td className="px-4 py-2 truncate max-w-xs">{log.body}</td>
                    <td className="px-4 py-2">
                      {new Date(log.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(log)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({
                length: Math.ceil(filteredLogs.length / logsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        <ConfirmModal
          show={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this email log?"
        />
      </div>
    </CompanyLayout>
  );
};

export default CompanyEmailHistoryPage;
