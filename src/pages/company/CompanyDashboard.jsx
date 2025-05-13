import React, { useState, useEffect } from "react";
import {
  FaUserTie,
  FaUsers,
  FaUserCheck,
  FaFileInvoice,
  FaChartBar,
  FaFolderOpen,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import CompanyLayout from "../../components/company/CompanyLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Reusable Dashboard Card
const DashboardCard = ({ icon, label, value, bg }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${bg} mr-4`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

// Reusable Graph Card
const GraphCard = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full bg-blue-50 mr-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const CompanyDashboard = () => {
  const { currentUser, stats, loading, error } = useUser();

if (loading) return <div className="p-8">Loading...</div>;
if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
if (!currentUser || currentUser.role !== "COMPANY") {
  return <div className="p-8 text-red-500">Unauthorized</div>;
}


  return (
    <CompanyLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Company Dashboard</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<FaUserTie className="text-blue-600 text-2xl" />}
            label="Internal Accountants"
            value={stats?.totalInternalAccountants || 0}
            bg="bg-blue-50"
          />
          <DashboardCard
            icon={<FaUsers className="text-green-600 text-2xl" />}
            label="Clients"
            value={stats?.totalClients || 0}
            bg="bg-green-50"
          />
          <DashboardCard
            icon={<FaUserCheck className="text-indigo-600 text-2xl" />}
            label="Assigned Clients"
            value={stats?.assignedClients || 0}
            bg="bg-indigo-50"
          />
          <DashboardCard
            icon={<FaFileInvoice className="text-yellow-600 text-2xl" />}
            label="Invoices Uploaded"
            value={stats?.uploadedInvoices || 0}
            bg="bg-yellow-50"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GraphCard title="Invoices by Month" icon={<FaChartBar className="text-blue-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.monthlyInvoices || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invoices"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>

          <GraphCard title="Pending Invoices" icon={<FaFolderOpen className="text-yellow-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.pendingByAccountant || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;
