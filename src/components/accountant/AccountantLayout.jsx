import React from 'react';
import SidebarAccountant from './SidebarAccountant';

const AccountantLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <SidebarAccountant />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AccountantLayout;
