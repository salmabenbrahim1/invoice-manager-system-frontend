import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';
import { FaBuilding, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../styles/sideBar.css';

const SideBarCompany = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <div className="sidebar-container">
      <nav className="flex flex-col space-y-4">
        <div onClick={() => setIsOpen(!isOpen)} className="sidebar-toggle">
          {isOpen ? <ChevronDown className="text-xl" /> : <ChevronRight className="text-xl" />}
          <span className="sidebar-toggle-text">Company</span>
        </div>

        {isOpen && (
          <div className="sidebar-submenu">
            <NavLink to="/clients" className="sidebar-link">
              <FaBuilding className="mr-3 text-lg" />
              <span className="text-md">Manage Internal Accountants</span>
            </NavLink>
            <NavLink to="/manage_clients" className="sidebar-link">
              <FaUsers className="mr-3 text-lg" />
              <span className="text-md">Manage Clients</span>
            </NavLink>
            <NavLink to="/company" className="sidebar-link">
              <FaChartBar className="mr-3 text-lg" />
              <span className="text-md">Dashboard</span>
            </NavLink>

            {isLoggedIn && (
              <div onClick={handleLogout} className="sidebar-link">
                <FaSignOutAlt className="mr-3 text-lg" />
                <span className="text-md">Logout</span>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default SideBarCompany;