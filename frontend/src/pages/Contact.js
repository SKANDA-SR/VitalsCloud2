import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Contact = () => {
  return (
    <div className="contact-page py-5">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold mb-4">Contact Us</h1>
            <p className="lead text-muted">
              Get in touch with us for appointments, questions, or any assistance you need.
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={4} md={6} className="mb-4">
            <Card className="text-center border-0 h-100 shadow-sm">
              <Card.Body className="p-4">
                <i className="bi bi-geo-alt-fill text-primary mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="fw-bold mb-3">Visit Us</h5>
                <p className="text-muted mb-0">
                  123 Medical Center Drive<br />
                  Healthcare City, HC 12345<br />
                  United States
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <Card className="text-center border-0 h-100 shadow-sm">
              <Card.Body className="p-4">
                <i className="bi bi-telephone-fill text-primary mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="fw-bold mb-3">Call Us</h5>
                <p className="text-muted mb-2">
                  <strong>Main:</strong> (555) 123-4567<br />
                  <strong>Appointments:</strong> (555) 123-4568
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} className="mb-4">
            <Card className="text-center border-0 h-100 shadow-sm">
              <Card.Body className="p-4">
                <i className="bi bi-envelope-fill text-primary mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="fw-bold mb-3">Email Us</h5>
                <p className="text-muted mb-0">
                  <strong>General:</strong> info@healthcareclinic.com<br />
                  <strong>Appointments:</strong> appointments@healthcareclinic.com<br />
                  <strong>Support:</strong> support@healthcareclinic.com
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4 text-center">Office Hours</h4>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold mb-3">General Services</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2"><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</li>
                      <li className="mb-2"><strong>Saturday:</strong> 9:00 AM - 5:00 PM</li>
                      <li className="mb-2"><strong>Sunday:</strong> 10:00 AM - 4:00 PM</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold mb-3">Pediatrics Services</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2"><strong>Monday - Friday:</strong> 8:00 AM - 4:00 PM</li>
                      <li className="mb-2"><strong>Saturday:</strong> 9:00 AM - 1:00 PM</li>
                      <li className="mb-2"><strong>Sunday:</strong> Closed</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
