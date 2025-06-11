import { useState, useEffect } from "react";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { Eye } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useUser } from "../../contexts/UserContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { useTranslation } from 'react-i18next';

const AccountantOversight = () => {
  const { users, loading } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();


  const independentAccountants = users.filter(
    (user) =>
      user.role === "INDEPENDENT_ACCOUNTANT" &&
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const accountantsPerPage = 7;
  const totalPages = Math.ceil(independentAccountants.length / accountantsPerPage);
  const currentAccountants = independentAccountants.slice(
    (currentPage - 1) * accountantsPerPage,
    currentPage * accountantsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [searchQuery, totalPages, currentPage]);

  const handleViewClick = (user) => {
    navigate(`/view-independent-accountant-folder/${user.id}`, {
      state: { accountantName: `${user.firstName} ${user.lastName}` },
    });

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
          text="{t('loading_independent_accountants')}"
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="h-screen overflow-y-auto p-10">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-violet-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            {t('back_to_user_oversight')}          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">{t('independent_accountants_oversight')}</h2>
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('search_accountants_placeholder')}

              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {independentAccountants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No matching accountants found" : "No independent accountants available"}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('phone')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAccountants.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-blue-600" />
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-gray-500">{user.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewClick(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Folders"
                      >
                        <Eye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onPageSelect={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AccountantOversight;
