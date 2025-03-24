import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Icône utilisateur

const Navbar = () => {
  const [user, setUser] = useState(null); // null = pas connecté

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between relative">
      <div className="text-xl font-bold uppercase text-purple-800">
        <Link to="/home">Invoice Management</Link>
      </div>

      <ul className="hidden md:flex mx-auto space-x-6 text-lg font-semibold">
        <li>
          <Link to="/home" className="text-black hover:text-purple-800">Home</Link>
        </li>
        <li>
          <Link to="/manage-invoices" className="text-black hover:text-purple-800">Manage Invoices</Link>
        </li>
        <li>
          <Link to="/contact-us" className="text-black hover:text-purple-800">Contact Us</Link>
        </li>
      </ul>

      {/* Connexion / Profil utilisateur */}
      <div className="hidden md:flex">
        {user ? (
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-[#75529e] text-2xl" />
            <span className="text-[#75529e] font-semibold">{user.name}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="border border-[#75529e] text-[#75529e] px-4 py-2 rounded-md hover:bg-[#75529e] hover:text-white transition"
          >
Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
