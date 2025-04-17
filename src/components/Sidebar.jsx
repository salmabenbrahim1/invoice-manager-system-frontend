import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaUser, FaStar, FaFolder } from 'react-icons/fa';
import { GoArchive } from 'react-icons/go';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <Nav className="flex-column sidebar-submenu">
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
      </Nav>

      <hr />
    </div>
  );
};

export default Sidebar;
