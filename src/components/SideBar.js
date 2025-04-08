import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons'; 
import { FaUser,FaStar } from 'react-icons/fa';
import { GoArchive } from 'react-icons/go';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

const SideBar = () => {
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
          <span className="sidebar-toggle-text">Folders</span>
        </div>

        {foldersOpen && (
          <div  className="sidebar-submenu">
            <NavLink to="/my-folders"
            className="sidebar-link"
           >My Folders</NavLink>
            <NavLink to="/my-clients" className="sidebar-link"><FaUser size = {15} style={{ marginRight: '15px' }} />My Clients</NavLink>
            <NavLink to="/favorites" className="sidebar-link"><FaStar size={15} style={{ marginRight: '15px' }}/>Favorites</NavLink>
            
            <NavLink to="/archive" className="sidebar-link"> <GoArchive style={{ marginRight: '15px' }} />Archive</NavLink>
          </div>
        )}
      </Nav>
      <hr />
    </div>
  );
};

export default SideBar;