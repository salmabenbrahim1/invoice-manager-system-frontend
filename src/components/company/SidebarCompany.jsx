import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBuilding, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/sidebar.css';
import { useAuth } from '../../context/AuthContext';

const SideBarCompany = () => {
  const { logout } = useAuth(); 

  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <nav className="flex flex-column sidebar-submenu">
        <NavLink
          to="/company"
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        >
          <FaChartBar className="mr-3 text-lg" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/internal-accountants"
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        >
          <FaBuilding className="mr-3 text-lg" />
          <span>Manage Internal Accountants</span>
        </NavLink>

        <NavLink
          to="/manage_clients"
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        >
          <FaUsers className="mr-3 text-lg" />
          <span>Manage Clients</span>
        </NavLink>

        {/* Logout Button */}
        <button onClick={logout} type="button" className="sidebar-link logout-btn">
          <FaSignOutAlt className="mr-3 text-lg" />
          <span>Logout</span>
        </button>
      </nav>

      <hr />
    </div>
  );
};

export default SideBarCompany;
