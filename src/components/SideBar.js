import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';
import { FaUser, FaStar, FaFolder } from 'react-icons/fa';
import { GoArchive } from 'react-icons/go';
import { NavLink } from 'react-router-dom';
import '../styles/sideBar.css'; 

const Sidebar = () => {
  const [foldersOpen, setFoldersOpen] = useState(false);

  const toggleFolders = () => {
    setFoldersOpen(!foldersOpen);
  };

  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />


      <Nav className="flex-column">
        <div
          onClick={toggleFolders}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}
        >
          {foldersOpen ? <ChevronDown /> : <ChevronRight />}
          <span className="sidebar-toggle-text"> Folders</span>
        </div>

        {foldersOpen && (
          <div className="sidebar-submenu">
            <NavLink to="/my-folders"
              className="sidebar-link"
            >  <FaFolder className="mr-3 text-lg" /> My Folders</NavLink>
            <NavLink to="/my-clients" className="sidebar-link "><FaUser className="mr-3 text-lg" />My Clients</NavLink>
            <NavLink to="/favorites" className="sidebar-link"><FaStar className="mr-3 text-lg" /> Favorites</NavLink>

            <NavLink to="/archive" className="sidebar-link"> <GoArchive className="mr-3 text-lg" /> Archive</NavLink>
          </div>
        )}
      </Nav>
      <hr />
    </div>
  );
};

export default Sidebar;