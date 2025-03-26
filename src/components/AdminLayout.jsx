import React from 'react';
import Navbar from './Navbar';
import SideBarAdmin from './SideBarAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar en haut */}
      <Navbar/>

      {/* Contenu principal avec Sidebar à gauche */}
      <div className="flex flex-1">
        <SideBarAdmin />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
