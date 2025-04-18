import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaChartBar, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import '../../styles/sidebar.css';
import { useAuth } from '../../context/AuthContext';

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
          to="/admin"
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
