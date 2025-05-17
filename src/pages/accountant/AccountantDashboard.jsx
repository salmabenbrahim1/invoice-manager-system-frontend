import React, { useRef } from "react";
import {
  FaUser,
  FaFolderOpen,
  FaFileAlt,
  FaClock,
  FaArchive,
  FaStar,
  FaChartLine,
  FaCalendar, FaCalendarAlt
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { exportDashboardAsPDF } from "../../utils/pdfUtils";

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

const COLORS = ["#0088FE", "#FF8042", "#FFBB28"];

const ProportionCharts = ({ stats }) => {
  if (!stats) return null;

  // Calculate active vs archived folders
  const activeFolders = (stats.totalFolders || 0) - (stats.archivedFiles || 0);
  const archivedFolders = stats.archivedFiles || 0;

  const folderData = [
    { name: "Active Folders", value: activeFolders },
    { name: "Archived Folders", value: archivedFolders },
  ];

  const validatedInvoices =
    typeof stats.validatedInvoices === "number"
      ? stats.validatedInvoices
      : stats.validatedInvoices?.count || 0;
  const pendingInvoices =
    typeof stats.pendingInvoices === "number"
      ? stats.pendingInvoices
      : stats.pendingInvoices?.count || 0;

  // Prepare data for the chart
  const invoiceData = [
    { name: "Validated Invoices", value: validatedInvoices },
    { name: "Pending Invoices", value: pendingInvoices },
  ];

  // Proportion of favorite vs non-favorite folders (excluding archived)
  const favoriteFolders = stats.favoriteFolders || 0;
  const totalFolders = stats.totalFolders || 0;
  const archivedFiles = stats.archivedFiles || 0;
  const totalNonArchivedFolders = Math.max(totalFolders - archivedFolders, 0);
  const nonFavoriteFolders = Math.max(totalNonArchivedFolders - favoriteFolders, 0);

  const favoriteFolderData = [
    { name: "Favorite Folders", value: favoriteFolders },
    { name: "Non-Favorite Folders", value: nonFavoriteFolders },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

      <GraphCard
        title="Invoices"
        subtitle="Validated vs Pending Invoices"
        icon={<FaFileAlt className="text-indigo-600" />}
        className="bg-white rounded-md border border-gray-200 shadow-sm p-5 corporate-dashboard"
      >
        <div className="flex flex-col h-full space-y-2">
          <div className="text-sm text-gray-500 font-medium">
            Invoice Status
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={invoiceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={40}
                paddingAngle={1}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {invoiceData.map((entry, index) => (
                  <Cell
                    key={`cell-invoice-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  <span className="font-semibold">{value} invoices</span>
                ]}
                labelFormatter={(name) =>
                  <div className="mb-1">
                    {name === 'Pending' ? ' Pending Invoices' : ' Validated Invoices'}
                  </div>
                }
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
              />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconSize={12}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '13px'
                }}
                formatter={(value) => {
                  if (value === 'Pending') return 'Pending Invoices';
                  if (value === 'Validated') return 'Validated Invoices';
                  return value;
                }}
              />

            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700">
              Total: {invoiceData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} invoices
            </div>
          </div>
        </div>
      </GraphCard>

      <GraphCard
        title="Folder"
        subtitle="Favorite vs Regular Folders Distribution"
        icon={<FaStar className="text-yellow-500" />}
        className="bg-white rounded-md border border-gray-200 shadow-sm p-5 corporate-dashboard"
      >
        <div className="flex flex-col h-full space-y-2">
          <div className="text-sm text-gray-500 font-medium">
            Folder Classification
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={favoriteFolderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={40}
                paddingAngle={1}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                labelStyle={{
                  fill: '#374151',
                  fontSize: '11px',
                  fontWeight: '500',
                  fontFamily: 'sans-serif'
                }}
              >
                {favoriteFolderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#F59E0B" : "#6B7280"}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  <span className="font-semibold">{value} folders</span>
                ]}
                labelFormatter={(name) =>
                  <div className="mb-1">
                    {name === favoriteFolderData[0].name
                      ? 'Favorite Folders'
                      : 'Other Folders'}
                  </div>
                }
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
              />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconSize={12}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '13px'
                }}
                formatter={(value) =>
                  <span className="text-gray-700">
                    {value === favoriteFolderData[0].name
                      ? 'Favorite Folders'
                      : 'Other Folders'}
                  </span>
                }
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700">
              Total: {favoriteFolderData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} folders
            </div>
          </div>
        </div>
      </GraphCard>
    </div>
  );
};

const AccountantDashboard = () => {
  const { currentUser, stats, loading, error } = useUser();
  const dashboardRef = useRef(null);

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
      <div className="p-8" ref={dashboardRef}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Accountant Dashboard</h1>
          </div>
          <button
            onClick={() => exportDashboardAsPDF(dashboardRef)}
            className="px-4 py-2 bg-violet-800 text-white rounded-lg flex items-center"
          >
            Export PDF
          </button>
        </div>

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
            value={(stats?.totalFolders || 0) - (stats?.archivedFiles || 0)}
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

        {/*charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GraphCard
            title="Uploaded Invoices by Month"
            icon={<FaChartLine className="text-blue-500" />}
          >
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

          <GraphCard
            title="Validated Invoices"
            icon={<FaChartLine className="text-green-500" />}
          >
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
        </div>
        <ProportionCharts stats={stats} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GraphCard
            title="Archived Folders"
            icon={<FaArchive className="text-indigo-600" />}
          >
            <div className="space-y-4">
              {/* Progress bar for total archived */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Total Archived/ Total Folders</span>
                  <span className="text-sm font-semibold">{stats?.archivedFiles || 0} / {stats?.totalFolders || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${stats?.totalFolders ? (stats.archivedFiles / stats.totalFolders * 100) : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats with icons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaCalendar className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">This Year</span>
                  </div>
                  <p className="text-lg font-bold text-blue-800 mt-1">+{stats?.archivedThisYear || 0}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">This Month</span>
                  </div>
                  <p className="text-lg font-bold text-green-800 mt-1">+{stats?.recentArchives || 0}</p>
                </div>
              </div>

            </div>
          </GraphCard>
        </div>

      </div>

    </AccountantLayout>
  );
};

export default AccountantDashboard;
