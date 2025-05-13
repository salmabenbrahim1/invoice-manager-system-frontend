import React from "react";
import {
  FaUser,
  FaFolderOpen,
  FaFileAlt,
  FaClock,
  FaArchive,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import AccountantLayout from "../../components/accountant/AccountantLayout";
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

// Dashboard Card Component
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

// Graph Card Component
const GraphCard = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full bg-blue-50 mr-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const AccountantDashboard = () => {
  const { currentUser, stats, loading, error } = useUser();

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  if (
  !currentUser ||
  (currentUser.role !== "INDEPENDENT_ACCOUNTANT" &&
    currentUser.role !== "INTERNAL_ACCOUNTANT")
) {
  return <div className="p-8 text-red-500">Unauthorized</div>;
}


  return (
    <AccountantLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Accountant Dashboard</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<FaUser className="text-blue-600 text-2xl" />}
            label="Clients"
            value={stats?.totalClients || 0}
            bg="bg-blue-50"
          />
          <DashboardCard
            icon={<FaFolderOpen className="text-green-600 text-2xl" />}
            label="Folders"
            value={stats?.totalFolders || 0}
            bg="bg-green-50"
          />
          <DashboardCard
            icon={<FaFileAlt className="text-indigo-600 text-2xl" />}
            label="Invoices"
            value={stats?.totalInvoices || 0}
            bg="bg-indigo-50"
          />
          <DashboardCard
            icon={<FaClock className="text-yellow-600 text-2xl" />}
            label="Pending Invoices"
            value={stats?.pendingInvoices || 0}
            bg="bg-yellow-50"
          />
          
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GraphCard title="Uploaded Invoices by Month" icon={<FaChartLine className="text-blue-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.invoiceData || []}>
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

          <GraphCard title="Validated Invoices" icon={<FaChartLine className="text-green-500" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.validatedInvoices || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="validated"
                  stroke="#10B981"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>

          <GraphCard title="Archived Folders" icon={<FaArchive className="text-indigo-600" />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Archived (All Time)</span>
                <span className="font-medium">{stats?.archivedFiles || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Archived This Year</span>
                <span className="font-medium text-blue-600">+{stats?.archivedThisYear || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">This Month</span>
                <span className="font-medium text-green-600">+{stats?.recentArchives || 0}</span>
              </div>
            </div>
          </GraphCard>

          <GraphCard title="Favorite Folders" icon={<FaStar className="text-yellow-500" />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Favorites</span>
                <span className="font-medium">{stats?.favoriteFolders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Added This Year</span>
                <span className="font-medium text-blue-600">+{stats?.favoritesThisYear || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">This Month</span>
                <span className="font-medium text-green-600">+{stats?.favoritesThisMonth || 0}</span>
              </div>
            </div>
          </GraphCard>
        </div>
      </div>
    </AccountantLayout>
  );
};

export default AccountantDashboard;
