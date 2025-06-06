import React, { useState, useEffect, useRef } from "react";
import {
  FaUserTie,
  FaUsers,
  FaUserCheck,
  FaFileInvoice,
  FaChartBar,
  FaFolderOpen,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useUser } from "../../contexts/UserContext";
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
  PieChart,
  Pie,
  Cell
} from "recharts";
import { exportDashboardAsPDF } from '../../utils/pdfUtils';

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
  const { stats } = useUser();
  const dashboardRef = useRef(null);



  return (
    <CompanyLayout>
      <div className="p-8" ref={dashboardRef}>


        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Company Dashboard                    </h1>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => exportDashboardAsPDF(dashboardRef)}
            className="px-4 py-2 bg-violet-800 text-white rounded-lg flex items-center"
          >
            Export PDF
          </button>
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
            icon={<FaUsers className="text-gray-600 text-2xl" />}
            label="Unassigned Clients"
            value={stats?.unassignedClients || 0}
            bg="bg-gray-50"
          />


        </div>

        {/* Additional Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<FaFileInvoice className="text-yellow-600 text-2xl" />}
            label="Invoices Uploaded"
            value={stats?.uploadedInvoices || 0}
            bg="bg-yellow-50"
          />
          <DashboardCard
            icon={<FaTimes className="text-red-600 text-2xl" />}
            label="Failed Invoices"
            value={stats?.failedInvoices || 0}
            bg="bg-red-50"
          />
          <DashboardCard
            icon={<FaExclamationTriangle className="text-yellow-600 text-2xl" />}
            label="Pending Invoices"
            value={stats?.pendingInvoices || 0}
            bg="bg-yellow-100"
          />
          <DashboardCard
            icon={<FaCheck className="text-green-600 text-2xl" />}
            label="Validated Invoices"
            value={stats?.validatedInvoicesCount || 0}
            bg="bg-green-50"
          />

        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GraphCard title="Invoices by Month" icon={<FaChartBar className="text-blue-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.monthlyInvoices || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
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
              <LineChart data={stats?.pendingInvoicesByMonth || []}>
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

          <GraphCard title="Accountants Status" icon={<FaUserTie className="text-purple-600" />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Active", value: stats?.activeInternalAccountants || 0 },
                    { name: "Disabled", value: stats?.disabledInternalAccountants || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`} // Affiche l'étiquette avec le nom et la valeur
                >
                  {["Active", "Disabled"].map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? "#4CAF50" : "#F44336"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GraphCard>


        </div>
      </div>

    </CompanyLayout>
  );
};

export default CompanyDashboard;
