import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { FaUser, FaStar, FaFolder, FaSignOutAlt, FaUserTie, FaChartBar } from 'react-icons/fa';
import { GoArchive } from 'react-icons/go';
import '../../styles/sideBar.css';

const SidebarAccountant = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <nav className="flex-column sidebar-submenu">
        <div className="sidebar-toggle">
          <FaUserTie className="mr-3 text-lg" />
          <span className="sidebar-toggle-text">Independent Accountant</span>
        </div>
        <hr className="sidebar-divider" />
        <NavLink to="/accountant" className="sidebar-link">
          <FaChartBar className="mr-3 text-lg" />
          <span className="text-md">Dashboard</span>
        </NavLink>
 
        <NavLink to="/my-folders" className="sidebar-link">
          <FaFolder className="mr-3 text-lg" /> My Folders
        </NavLink>

        <NavLink to="/my-clients" className="sidebar-link">
          <FaUser className="mr-3 text-lg" /> My Clients
        </NavLink>

        <NavLink to="/favorites" className="sidebar-link">
          <FaStar className="mr-3 text-lg" /> Favorites
        </NavLink>

        <NavLink to="/archive" className="sidebar-link">
          <GoArchive className="mr-3 text-lg" /> Archive
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

export default SidebarAccountant;
