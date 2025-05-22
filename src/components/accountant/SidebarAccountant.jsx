import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import { FaUser, FaStar, FaFolder, FaSignOutAlt, FaUserTie, FaChartBar } from 'react-icons/fa';
import { GoArchive } from 'react-icons/go';
import '../../styles/sidebar.css';

const SidebarAccountant = () => {
  const { logout, user } = useAuth();

  const isIndependent = user?.role === 'INDEPENDENT_ACCOUNTANT';
  
  const isInternal = user?.role === 'INTERNAL_ACCOUNTANT';

  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <nav className="flex-column sidebar-submenu">
        <div className="sidebar-toggle">
          <FaUserTie className="mr-3 text-lg" />
          <span className="sidebar-toggle-text">Accountant</span>
        </div>
        <hr className="sidebar-divider" />

        <NavLink to="/accountant/dashboard" className="sidebar-link">
          <FaChartBar className="mr-3 text-lg" />
          <span className="text-md">Dashboard</span>
        </NavLink>

        <NavLink to="/my-folders" className="sidebar-link">
          <FaFolder className="mr-3 text-lg" /> My Folders
        </NavLink>

        {isIndependent && (
          <NavLink to="/my-clients" className="sidebar-link">
            <FaUser className="mr-3 text-lg" /> My Clients
          </NavLink>
        )}
         {isInternal && (
          <NavLink to="/my-assigned-clients" className="sidebar-link">
            <FaUser className="mr-3 text-lg" /> My Clients
          </NavLink>
        )}

        <NavLink to="/favorites" className="sidebar-link">
          <FaStar className="mr-3 text-lg" /> Favorites
        </NavLink>

        <NavLink to="/archive" className="sidebar-link">
          <GoArchive className="mr-3 text-lg" /> Archive
        </NavLink>

        <hr />

        <button onClick={logout} className="sidebar-link">
          <FaSignOutAlt className="mr-3 text-lg" />
          <span className="text-md">Logout</span>
        </button>
      </nav>
    </div>
  );
};


export default SidebarAccountant;
