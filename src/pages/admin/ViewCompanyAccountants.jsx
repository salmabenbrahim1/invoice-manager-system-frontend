import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FaUserTie,FaArrowLeft } from "react-icons/fa";
import { Eye } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

const ViewCompanyAccountants = () => {
    const { id: companyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCompanyAccountants } = useUser();
    const [accountants, setAccountants] = useState([]);
    const [loading, setLoading] = useState(true);
    const companyName = location.state?.companyName || "Company";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCompanyAccountants(companyId);
                setAccountants(data);
            } catch (error) {
                console.error("Error loading accountants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [companyId, fetchCompanyAccountants]);

    const handleViewClick = (user) => {
        navigate(`/view-internal-accountant-folders/${user.id}`, {
            state: { accountantName: `${user.firstName} ${user.lastName}` },
        });
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner text="Loading Accountants..." fullScreen />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-10">
                 <div className="flex items-center mb-6">
                          <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-violet-600 hover:text-blue-800 mr-4"
                          >
                            <FaArrowLeft className="mr-2" />
                            Back to Companies
                          </button>
                        </div>
                
                <h2 className="text-2xl font-bold mb-6">
                    Internal Accountants - {companyName}
                </h2>

                {accountants.length === 0 ? (
                    <p className="text-gray-500">No internal accountants found.</p>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accountants.map((acc) => (
                                    <tr key={acc.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUserTie className="mr-2 text-indigo-600" />
                                                <span>{acc.firstName} {acc.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{acc.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{acc.phone || "-"}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewClick(acc)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                title="View Folders"
                                            >
                                                <Eye  size={18} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ViewCompanyAccountants;
