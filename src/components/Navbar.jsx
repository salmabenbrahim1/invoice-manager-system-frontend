import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaBars, FaTimes, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileModal from './modals/EditProfileModal';
import { useTranslation } from 'react-i18next';
import '../styles/navbar.css';
import invoiceLogo from '../assets/images/invox-logo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { profile } = useUser(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);
  const userIconRef = useRef(null);
  const UserIcon = user?.role === 'COMPANY' ? FaBuilding : FaUserCircle;

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleMobileMenu = () => setMenuOpen(!menuOpen);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

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
    <nav className="navbar-container">
      <div>
        <Link to="/home">
          <img className="navbar-logo" src={invoiceLogo} alt="Invoice Logo" />
        </Link>

        <button className="d-md-none btn" onClick={toggleMobileMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`me-auto ${menuOpen ? '' : 'd-none d-md-flex'} nav-links-container`}>
          <Link to="/home" className="nav-link">{t('home')}</Link>
          <Link to="/manage-invoices" className="nav-link">{t('manageInvoices')}</Link>
          <Link to="/contact-us" className="nav-link">{t('contactUs')}</Link>
        </div>

        <div className="user-section" ref={menuRef}>
          {user ? (
            <div className="user-profile">
              <div className="user-icon-wrapper" onClick={toggleUserMenu} ref={userIconRef}>
                {profile?.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt="User profile"
                    className="user-profile-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #fff',
                    }}
                  />
                ) : (
                  <UserIcon className="user-icon" />
                )}
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
                        {t('editProfile') || 'Edit Profile'}
                      </div>
                    )}

                    <div
                      className="menu-item logout"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                    >
                      {t('logout') || 'Logout'}
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

        <div className="language-selector">
          <select onChange={(e) => handleLanguageChange(e.target.value)} defaultValue="en">
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      <EditProfileModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={() => setShowModal(false)} 
      />
    </nav>
  );
};

export default Navbar;
