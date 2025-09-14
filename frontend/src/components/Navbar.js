import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const AppNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    setExpanded(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      fixed="top" 
      className="navbar-custom shadow-sm"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="bi bi-heart-pulse me-2 text-primary"></i>
          <span className="fw-bold">HealthCare Clinic</span>
        </Navbar.Brand>
        
        {/* Doctor Login Icon on the left */}
        <div className="d-flex align-items-center me-3 d-lg-block d-none">
          <Button
            as={Link}
            to="/doctor/login"
            variant="outline-primary"
            size="sm"
            className="btn-doctor-login"
            title="Doctor Login"
          >
            <i className="bi bi-person-badge me-1"></i>
            Doctor
          </Button>
        </div>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {/* Mobile Doctor Login */}
            <Nav.Link 
              as={Link} 
              to="/doctor/login" 
              className={`nav-link-custom d-lg-none ${isActive('/doctor/login')}`}
              onClick={handleNavClick}
            >
              <i className="bi bi-person-badge me-1"></i>
              Doctor Login
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${isActive('/')}`}
              onClick={handleNavClick}
            >
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/services" 
              className={`nav-link-custom ${isActive('/services')}`}
              onClick={handleNavClick}
            >
              <i className="bi bi-list-check me-1"></i>
              Services
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/doctors" 
              className={`nav-link-custom ${isActive('/doctors')}`}
              onClick={handleNavClick}
            >
              <i className="bi bi-person-badge me-1"></i>
              Doctors
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={`nav-link-custom ${isActive('/about')}`}
              onClick={handleNavClick}
            >
              <i className="bi bi-info-circle me-1"></i>
              About
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={`nav-link-custom ${isActive('/contact')}`}
              onClick={handleNavClick}
            >
              <i className="bi bi-telephone me-1"></i>
              Contact
            </Nav.Link>
            
            <div className="navbar-cta ms-lg-3 mt-2 mt-lg-0">
              <Button 
                as={Link} 
                to="/book-appointment" 
                variant="primary" 
                className="btn-appointment"
                onClick={handleNavClick}
              >
                <i className="bi bi-calendar-plus me-1"></i>
                Book Appointment
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
