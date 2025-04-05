import React from 'react';
import SidebarCompany from './SidebarCompany';

const CompanyLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <SidebarCompany />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
