import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaChartBar, FaSignOutAlt, FaUserShield,  FaEnvelope,FaRobot } from 'react-icons/fa';
import '../../styles/sidebar.css';

import { useAuth } from '../../contexts/AuthContext';

const SidebarAdmin = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <nav className="flex flex-column sidebar-submenu">
        <div className="sidebar-toggle">
          <FaUserShield className="mr-3 text-lg" />
          <span className="sidebar-toggle-text">Admin</span>
        </div>
        <hr className="sidebar-divider" />


        <NavLink
          to="/admin/dashboard"
          className="sidebar-link"
        >
          <FaChartBar className="mr-3 text-lg" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/users"
          className="sidebar-link"
        >
          <FaUsers className="mr-3 text-lg" />
          <span>Users</span>
        </NavLink>
        
        <NavLink
          to="/admin/email-history"  
          className="sidebar-link"
        >
          <FaEnvelope className="mr-3 text-lg" /> 
          <span>Email History</span>
        </NavLink>
        
        <NavLink
          to="/admin/ai-model"  
          className="sidebar-link"
        >
          <FaRobot className="mr-3 text-lg" /> 
          <span>AI Model</span>
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

export default SidebarAdmin;
