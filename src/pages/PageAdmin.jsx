import React from 'react';
import AdminLayout from '../components/AdminLayout';

const PageAdmin = () => {
  return (
    <AdminLayout>
      <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome, Admin! This is your dashboard.</p>
    </div>
    </AdminLayout>
  );
};

export default PageAdmin;
