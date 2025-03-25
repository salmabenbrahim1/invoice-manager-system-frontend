import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../styles/navBar.css';


const NavBar = () => {
  return (
    <Navbar bg ="light" expand="lg" className='navbar-container' >
      <Container>
        <Navbar.Brand href="home"  className="flex-grow-1 text-center" >Invoice Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="me-auto" >
            <Nav.Link href="home" >Home</Nav.Link>
            <Nav.Link href="manage-invoices">Manage Invoices</Nav.Link>
            <Nav.Link href="contact-us">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;