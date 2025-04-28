import AdminLayout from '../../components/admin/AdminLayout';
import React, { useEffect } from "react";
import { FaBuilding, FaUserTie, FaFileInvoice, FaUsers } from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import LoadingSpinner from '../../components/LoadingSpinner';
import { useUser } from '../../context/UserContext';

const AdminDashboard = () => {
  const { stats, loading, error, fetchStats } = useUser();

  

  // Prepare data for charts
  const invoicesByUserTypeData = [
    { name: "Companies", value: stats?.companyInvoices || 0, fill: "#3B82F6" },
    { name: "Accountants", value: stats?.accountantInvoices || 0, fill: "#10B981" }
  ];

  const userStatusData = [
    { name: "Active", value: stats?.activeUsers || 0, fill: "#10B981" },
    { name: "Inactive", value: stats?.inactiveUsers || 0, fill: "#EF4444" }
  ];

  const COLORS = ['#10B981', '#EF4444'];

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
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Companies Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 mr-4">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Companies</h2>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.totalCompanies || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Accountants Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 mr-4">
                <FaUserTie className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Accountants</h2>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.totalIndependentAccountants || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Invoices Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-50 mr-4">
                <FaFileInvoice className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Invoices</h2>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.totalInvoicesExtracted || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 mr-4">
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Users</h2>
                <p className="text-2xl font-bold text-gray-800">
                  <span className="text-green-600">{stats?.activeUsers || 0}</span> / 
                  <span className="text-red-600"> {stats?.inactiveUsers || 0}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoices by Type Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Invoices by User Type</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoicesByUserTypeData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {invoicesByUserTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Status Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Status</h2>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;