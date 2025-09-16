import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand mb-3">
              <i className="bi bi-heart-pulse me-2 text-primary fs-4"></i>
              <span className="h5 fw-bold">HealthCare Clinic</span>
            </div>
            <p className="text-muted mb-3">
              Providing comprehensive healthcare services with compassion, 
              expertise, and state-of-the-art medical technology.
            </p>
            <div className="social-links">
              <a href="#" className="text-light me-3" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-light" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3 text-primary">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none hover-primary">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-light text-decoration-none hover-primary">
                  Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctors" className="text-light text-decoration-none hover-primary">
                  Doctors
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none hover-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3 text-primary">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="text-light">General Medicine</span>
              </li>
              <li className="mb-2">
                <span className="text-light">Pediatrics</span>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3 text-primary">Contact Info</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                <span className="text-light">123 Medical Center Drive<br />Healthcare City, HC 12345</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-telephone-fill text-primary me-2"></i>
                <span className="text-light">(555) 123-4567</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-envelope-fill text-primary me-2"></i>
                <span className="text-light">info@healthcareclinic.com</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-clock-fill text-primary me-2"></i>
                <span className="text-light">General Practice Hours: Mon-Fri 9AM-5PM</span>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              © {currentYear} HealthCare Clinic. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-light text-decoration-none hover-primary">
                  Privacy Policy
                </a>
              </li>
              <li className="list-inline-item mx-2 text-light">|</li>
              <li className="list-inline-item">
                <a href="#" className="text-light text-decoration-none hover-primary">
                  Terms of Service
                </a>
              </li>
              <li className="list-inline-item mx-2 text-light">|</li>
              <li className="list-inline-item">
                <a href="#" className="text-light text-decoration-none hover-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
