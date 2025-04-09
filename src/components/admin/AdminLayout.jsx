import React from 'react';
import SidebarAdmin from './SidebarAdmin';
import '../../styles/sidebar.css'; 

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <SidebarAdmin />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
