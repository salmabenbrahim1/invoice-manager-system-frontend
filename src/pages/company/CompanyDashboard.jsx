import React from 'react';
import CompanyLayout from '../../components/company/CompanyLayout';

const CompanyDashboard = () => {
  return (
    <CompanyLayout>

      <div style={{ display: 'flex' }}>

        <div style={{ marginLeft: '250px', padding: '20px' }}>
          <h1>Welcome to the Company Dashboard</h1>
          <p>Here is the main content of the Company Dashboard page.</p>
        </div>
      </div>
    </CompanyLayout>

  );
};

export default CompanyDashboard;
