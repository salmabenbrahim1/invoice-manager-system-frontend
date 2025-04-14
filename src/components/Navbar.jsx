import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUserCircle, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileForm from './EditProfileForm'; 
import '../styles/navBar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const menuRef = useRef(null);
  const UserIcon = user?.role === 'COMPANY' ? FaBuilding : FaUserCircle;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="navbar-container">
      <Container>
        <Navbar.Brand href="/home" className="flex-grow-1 text-center">
          Invoice Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/manage-invoices">Manage Invoices</Nav.Link>
            <Nav.Link as={Link} to="/contact-us">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="user-section" ref={menuRef}>
          {user ? (
            <div className="user-icon-wrapper">
              <UserIcon className="user-icon" onClick={toggleMenu} style={{ cursor: 'pointer' }} />

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="custom-user-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="menu-item user-info" onClick={closeMenu}>
                      <strong>{user.name || user.email}</strong>
                      <br />
                      <small>({user.role})</small>
                    </div>
                    <hr />
                    {user.role !== 'ADMIN' && ( // Exclude ADMIN
                      <div className="menu-item" onClick={() => { closeMenu(); setShowModal(true); }}>
                        Edit Profile
                      </div>
                    )}
                    <div className="menu-item logout" onClick={() => { logout(); closeMenu(); }}>
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
      </Container>

      <EditProfileForm
        show={showModal} 
        onHide={() => setShowModal(false)}
        onSave={(updatedUser) => {
          console.log(updatedUser); 
          setShowModal(false); 
        }}
      />
    </Navbar>
  );
};

export default NavBar;
