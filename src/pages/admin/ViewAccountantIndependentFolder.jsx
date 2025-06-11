import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaFolder, FaSearch, FaRegCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { Eye } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { useFolder } from '../../contexts/FolderContext';
import { useTranslation } from 'react-i18next';

const ViewAccountantIndependentFolder = () => {
  const { t } = useTranslation();

  const { accountantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const accountantName = location.state?.accountantName || "INDEPENDENT_ACCOUNTANT";

  const { folders, loading, fetchIndependentAccountantFolders } = useFolder();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const foldersPerPage = 7;

  useEffect(() => {
    if (accountantId) {
      fetchIndependentAccountantFolders(accountantId);
    }
  }, [accountantId]);

  const filteredFolders = folders.filter((folder) => {
    const query = searchQuery.toLowerCase();
    return (
      folder.folderName?.toLowerCase().includes(query) ||
      folder.client?.name?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredFolders.length / foldersPerPage);

  const currentFolders = filteredFolders.slice(
    (currentPage - 1) * foldersPerPage,
    currentPage * foldersPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFolderClick = (folderId, e) => {
    if (e?.target.closest("button")) return;
    navigate(`/admin/folders/${folderId}/invoices`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="{t('loading_folders')}" fullScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-violet-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            {t('back_to_independent_accountants')}          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">{t('folders_of')} {accountantName}</h2>

          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('search_by_folder_name_or_client')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredFolders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No folder found" : "No folders available"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('folder')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('client')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('created_on')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFolders.map((folder) => (
                    <tr key={folder.id} className="hover:bg-gray-50 cursor-pointer" onClick={(e) => handleFolderClick(folder.id, e)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFolder className="mr-2 text-purple-600" size={20} />
                          <div className="font-medium text-gray-900">{folder.folderName || "No Name"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{folder.client?.name || "No Client"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <div className="flex items-center">
                          <FaRegCalendarAlt className="mr-2 text-gray-400" />
                          {formatDate(folder.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleFolderClick(folder.id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          title="View invoices"
                        >
                          <Eye size={18} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
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
    </AdminLayout>
  );
};

export default ViewAccountantIndependentFolder;
