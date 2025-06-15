import AdminLayout from '../../components/admin/AdminLayout';
import { useRef } from "react";
import {
  FaBuilding,
  FaUserTie,
  FaFileInvoice,
  FaUsers,
  FaChartLine,
  FaChartBar,
  FaCrown
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";
import LoadingSpinner from '../../components/LoadingSpinner';
import { useUser } from '../../contexts/UserContext';
import { exportDashboardAsPDF } from "../../utils/pdfUtils";
import { useTranslation } from 'react-i18next';


const AdminDashboard = () => {
  const { t } = useTranslation();

  const { stats, loading, error, fetchStats } = useUser();
  const dashboardRef = useRef(null);


  const foldersByUserData = Object.keys(stats?.foldersByUser || {}).map((userEmail) => ({
    name: userEmail,
    value: stats?.foldersByUser[userEmail]?.length || 0
  }));

  const userStatusData = [
    { name: "Active", value: stats?.activeUsers || 0, fill: "#10B981" },
    { name: "Inactive", value: stats?.inactiveUsers || 0, fill: "#EF4444" }
  ];

  const COLORS = ['#10B981', '#EF4444'];
  const top5Accountants = stats?.topIndependentAccountants || [];
  const top5Companies = stats?.topCompanies || [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex justify-center items-center h-screen">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8" ref={dashboardRef}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('admin_dashboard')}</h1>
            <p className="text-sm text-gray-500">
              {t('last_updated')} {new Date().toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => exportDashboardAsPDF(dashboardRef)}
            className="px-4 py-2 bg-violet-800 text-white rounded-lg flex items-center hover:bg-violet-700 transition-colors"
          >
            {t('export_pdf')}          </button>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {/* Companies Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 mr-4">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-medium text-gray-500">{t('companies')}</h2>
                <p className="text-xl sm:text-2xl text-center font-bold text-gray-800">
                  {stats?.totalCompanies || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Accountants Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 mr-4">
                <FaUserTie className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl text-center font-medium text-gray-500">{t('accountants')}</h2>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {stats?.totalIndependentAccountants || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Invoices Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-50 mr-4">
                <FaFileInvoice className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl text-center font-medium text-gray-500">{t('invoices')}</h2>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {stats?.totalInvoicesExtracted || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 mr-4">
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl text-center font-medium text-gray-500">{t('users')}</h2>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  <span className="text-green-600">{stats?.activeUsers || 0}</span> /
                  <span className="text-red-600"> {stats?.inactiveUsers || 0}</span>
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('user_status')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('folder_by_user_type')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={foldersByUserData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Accountants Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <FaCrown className="text-yellow-500 mr-2 text-lg" />
              <h2 className="text-base font-semibold text-gray-800">{t('top_3_accountants')}</h2>
            </div>

            <ul className="space-y-2">
              {top5Accountants.length > 0 ? (
                top5Accountants.map((accountant, index) => (
                  <li key={accountant.id} className="flex items-center p-2 border-b border-gray-100 last:border-0">
                    <span className={`
              flex items-center justify-center 
              w-6 h-6 rounded-full mr-3
              text-sm font-bold
              ${index < 3 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}
              border ${index < 3 ? 'border-yellow-600' : 'border-gray-300'}
            `}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{accountant.name}</p>
                      <p className="text-xs text-gray-600">{accountant.invoiceCount} {t('invoices')}</p>
                    </div>
                    <FaChartLine className="text-green-500 ml-2" />
                  </li>
                ))
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  {t('no_accountants_data')}                </div>
              )}
            </ul>
          </div>

          {/* Top Companies Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <FaBuilding className="text-indigo-500 mr-2 text-lg" />
              <h2 className="text-base font-semibold text-gray-800">{t('top_3_companies')}</h2>
            </div>

            <ul className="space-y-2">
              {top5Companies.length > 0 ? (
                top5Companies.map((company, index) => (
                  <li key={company.id} className="flex items-center p-2 border-b border-gray-100 last:border-0">
                    <span className={`
              flex items-center justify-center 
              w-6 h-6 rounded-full mr-3
              text-sm font-bold
              ${index < 3 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}
              border ${index < 3 ? 'border-indigo-600' : 'border-gray-300'}
            `}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-gray-600">{company.invoiceCount} {t('invoices')}</p>
                    </div>
                    <FaChartBar className="text-blue-500 ml-2" />
                  </li>
                ))
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  No companies data available
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;