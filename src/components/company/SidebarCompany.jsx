import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBuilding, FaUsers, FaChartBar, FaSignOutAlt, FaUserTie, FaEnvelope,FaFolder  } from 'react-icons/fa';
import '../../styles/sidebar.css';


const SidebarCompany = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <nav className="flex-column sidebar-submenu">

        <div className="sidebar-toggle">

          <FaBuilding className="mr-3 text-lg" />
          <span className="sidebar-toggle-text">Company</span>
        </div>
        <hr className="sidebar-divider" />


        <NavLink to="/company/dashboard" className="sidebar-link">
          <FaChartBar className="mr-3 text-lg" />
          <span className="text-md">Dashboard</span>
        </NavLink>
        <NavLink to="/my-accountants" className="sidebar-link">
          <FaUserTie className="mr-3 text-lg" />

          <span className="text-md">My Accountants</span>
        </NavLink>
        <NavLink to="/manage-clients" className="sidebar-link">
          <FaUsers className="mr-3 text-lg" />
          <span className="text-md">My Clients</span>
        </NavLink>
        <NavLink to="/company/history" className="sidebar-link">
          <FaEnvelope className="mr-3 text-lg" />
          <span className="text-md">Email History</span>
        </NavLink>
        <NavLink to="/my-accountants-oversight" className="sidebar-link">
          <FaFolder className="mr-3 text-lg" />
          <span className="text-md">My accountants Oversight</span>
        </NavLink>

        <hr />

        {/* Logout Button */}
        <button onClick={logout} className="sidebar-link">
          <FaSignOutAlt className="mr-3 text-lg" />
          <span className="text-md">Logout</span>
        </button>
      </nav>


    </div>
  );
};

export default SidebarCompany;
