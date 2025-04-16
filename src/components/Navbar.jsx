import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaBars, FaTimes, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileForm from './EditProfileForm';
import '../styles/navbar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);
  const userIconRef = useRef(null);
  const UserIcon = user?.role === 'COMPANY' ? FaBuilding : FaUserCircle;

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleMobileMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar-container ">
      <div>
        <Link to="/home" className="navbar-brand">
          Invoice Manager
        </Link>

        <button className="d-md-none btn" onClick={toggleMobileMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`me-auto ${menuOpen ? '' : 'd-none d-md-flex '}  nav-links-container`} >
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/manage-invoices" className="nav-link">
            Manage Invoices
          </Link>
          <Link to="/contact-us" className="nav-link">
            Contact Us
          </Link>
        </div>

        <div className="user-section" ref={menuRef}>
          {user ? (
            <div className="user-profile">
              <div className="user-icon-wrapper" onClick={toggleUserMenu} ref={userIconRef}>
                <UserIcon className="user-icon" />
              </div>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="custom-user-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="user-info">
                      <div className="user-name">{user.name || user.email}</div>
                      <small>({user.role})</small>
                    </div>

                    {user.role !== 'ADMIN' && (
                      <div
                        className="menu-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setShowModal(true);
                        }}
                      >
                        Edit Profile
                      </div>
                    )}
                    <div
                      className="menu-item logout"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                    >
                      Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </div>

      <EditProfileForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={(updatedUser) => {
          console.log(updatedUser);
          setShowModal(false);
        }}
      />
    </nav>
  );
};

export default Navbar;
