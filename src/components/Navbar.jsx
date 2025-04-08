import React, {useState} from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/navBar.css';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [user, setUser] = useState(null); 

  return (
    <Navbar bg="light" expand="lg" className='navbar-container'>
      <Container>
        <Navbar.Brand href="home" className="flex-grow-1 text-center">Invoice Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="me-auto">
            <Nav.Link href="home">Home</Nav.Link>
            <Nav.Link  href="manage-invoices">Manage Invoices</Nav.Link>
            <Nav.Link href="contact-us">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="user-section">
          {user ? (
            <div className="user-profile">
              <FaUserCircle className="user-icon" />
              <span className="user-name">{user.name}</span>
            </div>
          ) : (
            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;