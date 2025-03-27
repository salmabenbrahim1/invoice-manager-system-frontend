import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';
import { FaUsers, FaChartBar,  FaSignOutAlt } from 'react-icons/fa'; 

const SideBarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  
 
  const handleLogout = () => {
    // Logique de déconnexion ici (ex. supprimer le token, rediriger, etc.)
    setIsLoggedIn(false); 
     window.location.href = "/login";
  };

  return (
    <div className="w-64 h-full bg-[#75529e] text-white p-5 shadow-lg">
      <nav className="flex flex-col space-y-2">
        {/* Admin Section */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center cursor-pointer mb-3 hover:text-gray-200 transition"
        >
          {isOpen ? <ChevronDown /> : <ChevronRight />}
          <span className="ml-2 text-lg font-semibold">Admin</span>
        </div>

        {isOpen && (
          <div className="ml-5 flex flex-col space-y-2">
            <NavLink
              to="/users"
              className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition"
            >
              <FaUsers className="mr-2" /> Users
            </NavLink>
            <NavLink
              to="/dashboard"
              className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition"
            >
              <FaChartBar className="mr-2" /> BI Dashboard
            </NavLink>
             {/* Logout */}
        {isLoggedIn && (
          <div
            onClick={handleLogout}
            className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition cursor-pointer mt-5"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </div>
        )}
          </div>
        )}

       
      </nav>
    </div>
  );
};

export default SideBarAdmin;
