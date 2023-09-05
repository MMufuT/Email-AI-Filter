import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import magGlass from '../images/smartfilter128.png';

const CustomNavbar = () => {
  return (
    <div className="row">
      <Navbar className="navbar-bg custom-mb-5" data-bs-theme="dark">
        <Navbar.Brand className="col-5 mx-3">
          <img src={magGlass} alt="magGlass" className="magGlass-nav ms-5 me-2" />
          Gmail AI SmartFilter
        </Navbar.Brand>
        <Nav className="me-auto ms-2">
          <Nav.Link href="/history">History</Nav.Link>
          <Nav.Link href="/search">Search</Nav.Link>
          <Nav.Link href="/account">Account</Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;