import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaBars, FaTimes, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileModal from './modals/EditProfileModal';
import { useTranslation } from 'react-i18next';
import '../styles/navbar.css';
import invoiceLogo from '../assets/images/invox-logo.png';
import 'flag-icon-css/css/flag-icon.min.css';
import LanguageDropdown from './LanguageDropdown';
import InternalAccountantNotification from './accountant/InternalAccountantNotification';
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
          <Link to="/home" className="nav-link">
            {t('home')}
          </Link>
          {(user?.role === 'ADMIN') && (
            <Link to="/admin/dashboard" className="nav-link">
              {'Dashboard'}
            </Link>
          )}
          {(user?.role === 'ADMIN') && (
            <Link to="/users" className="nav-link">
              {'Manage users'}
            </Link>
          )}
          {(user?.role === 'ADMIN') && (
            <Link to="/admin/user-oversight" className="nav-link">
              {'Oversight'}
            </Link>
          )}
          {user?.role === 'COMPANY' && (
            <Link to="/company/dashboard" className="nav-link">
              {'Dashboard'}
            </Link>
          )}
          {user?.role === 'COMPANY' && (
            <Link to="/my-accountants-oversight" className="nav-link">
              {'Oversight'}
            </Link>
          )}
          {(user?.role === 'INTERNAL_ACCOUNTANT' || user?.role === 'INDEPENDENT_ACCOUNTANT') && (
            <Link to="/accountant/dashboard" className="nav-link">
              { 'Dashboard'}
            </Link>
          )}

          {(user?.role === 'INTERNAL_ACCOUNTANT' || user?.role === 'INDEPENDENT_ACCOUNTANT') && (
            <Link to="/manage-invoices" className="nav-link">
              {t('manageInvoices') || 'Manage Invoices'}
            </Link>
          )}
          
          { (!user) && (

            <Link to="/login" className="nav-link">
              {t('manageInvoices') || 'Manage Invoices'}
            </Link>)}
          {(user?.role !== 'ADMIN') && (
            <Link to="/contact-us" className="nav-link">
              {t('contactUs')}
            </Link>)}
        </div>


        <div
          className="user-section"
          ref={menuRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {user?.role === 'INTERNAL_ACCOUNTANT' && (
            <InternalAccountantNotification />
          )}

          <div className="user-profile">

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
                        <div className="user-name">
                          {profile?.role === 'COMPANY'
                            ? profile?.companyName
                            : `${profile?.firstName || ''} ${profile?.lastName || ''}`}
                        </div>
                      </div>

                      {user.role !== 'ADMIN' && (
                        <div
                          className="menu-item flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setShowModal(true);
                          }}
                        >
                          {t('editProfile') || 'Edit Profile'}
                        </div>
                      )}

                      <div
                        className="logout flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                      >
                        <FaSignOutAlt className="text-lg mr-2" />
                        <span>{t('logout') || 'Logout'}</span>
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

        <div>
          <LanguageDropdown currentLang={i18n.language} onChange={handleLanguageChange} />
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
