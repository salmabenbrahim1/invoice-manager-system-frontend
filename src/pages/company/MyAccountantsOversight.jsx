import React, { useState } from "react";
import {  FaUser } from "react-icons/fa"; 
import { Eye } from "lucide-react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { useUser } from "../../contexts/UserContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination"; 

const MyAccountantsOversight = () => {
  const { users, loading: contextLoading } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter internal accountants
  const accountants = users.filter(
    (user) =>
      user.role === "INTERNAL_ACCOUNTANT" &&
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

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [searchQuery, totalPages, currentPage]);

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

  const handleViewClick = (user) => {
    navigate(`/view-accountant-folder/${user.id}`, {
      state: { accountantName: `${user.firstName} ${user.lastName}` },
    });
  };

  return (
    <CompanyLayout>
      <div className="h-screen overflow-y-auto p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">My Accountants Oversight</h2>
          <div className="relative w-full md:w-1/4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search accountants by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {accountants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No matching accountants found" : "No internal accountants available"}
            </div>
          ) : currentAccountants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No matching accountants found" : "No internal accountants available"}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentAccountants.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-blue-600" />
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.phone || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewClick(user)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Folders"
                        >
                          <Eye className="text-medium" />
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
              onPageSelect={(page) => setCurrentPage(page)} 
            />
          </div>
        )}
      </div>
    </CompanyLayout>
  );
};

export default MyAccountantsOversight;
