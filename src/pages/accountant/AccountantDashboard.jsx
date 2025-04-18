import React from 'react';
import AccountantLayout from '../../components/accountant/AccountantLayout';
const AccountantDashboard = () => {
  return (
    <AccountantLayout>

      <div style={{ display: 'flex' }}>

        <div style={{ marginLeft: '250px', padding: '20px' }}>
          <h1>Welcome to your Dashboard</h1>
          <p>Here is the main content of the independant accountant Dashboard page.</p>
        </div>
      </div>
    </AccountantLayout>

  );
};

export default AccountantDashboard;
