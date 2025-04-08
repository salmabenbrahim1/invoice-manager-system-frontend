import AdminLayout from '../../components/admin/AdminLayout';
import React, { useEffect, useState } from "react";
import { FaBuilding, FaUserTie } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchUserStats } from '../../services/userService';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchUserStatsData();
  }, []);

  const fetchUserStatsData = async () => {
    try {
      const stats = await fetchUserStats();
      
      // Prepare data for the charts
      const userData = [
        { name: "Company", count: stats.totalCompanies || 0 },  
        { name: "Independent Accountants", count: stats.totalAccountIndependents || 0 }
      ];

      setUserStats(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading statistics", error);
      setError("Failed to load user statistics. Please try again later.");
      setLoading(false);
    }
  };

  // Define colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d'];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Error state */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Statistics Cards Section */}
        {loading ? (
          <div className="text-center text-lg">Loading user statistics...</div> 
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 shadow-lg rounded-lg flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">Company</h2> 
                  <p className="text-3xl font-bold text-blue-600">{userStats[0]?.count}</p>
                </div>
                <FaBuilding className="text-blue-600 text-4xl" />
              </div>
              <div className="p-6 bg-green-50 shadow-lg rounded-lg flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">Independent Accountants</h2>
                  <p className="text-3xl font-bold text-green-600">{userStats[1]?.count}</p>
                </div>
                <FaUserTie className="text-green-600 text-4xl" />
              </div>
            </div>

            <div className="w-full sm:w-[48%] mb-8">
              <h2 className="text-xl font-semibold mb-4">User Distribution by Role</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
