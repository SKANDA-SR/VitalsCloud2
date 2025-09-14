import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <div className="about-page py-5">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold mb-4">About HealthCare Clinic</h1>
            <p className="lead text-muted">
              Dedicated to providing exceptional healthcare services to our community for over a decade.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <h3 className="mb-3">Our Mission</h3>
            <p className="text-muted">
              To provide comprehensive, compassionate, and accessible healthcare services to all patients 
              while maintaining the highest standards of medical excellence and patient satisfaction.
            </p>
          </Col>
          <Col lg={6} className="mb-4">
            <h3 className="mb-3">Our Vision</h3>
            <p className="text-muted">
              To be the leading healthcare provider in our community, recognized for our commitment to 
              innovation, quality care, and improving the health and well-being of those we serve.
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={4} md={6} className="mb-4">
            <Card className="text-center border-0 h-100">
              <Card.Body className="p-4">
                <i className="bi bi-award text-primary mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="fw-bold">Excellence in Care</h5>
                <p className="text-muted">Committed to the highest standards of medical care and patient safety.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="text-center border-0 h-100">
              <Card.Body className="p-4">
                <i className="bi bi-people text-primary mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="fw-bold">Patient-Centered</h5>
                <p className="text-muted">Every decision we make puts our patients' needs and well-being first.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="text-center border-0 h-100">
              <Card.Body className="p-4">
                <i className="bi bi-lightbulb text-primary mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="fw-bold">Innovation</h5>
                <p className="text-muted">Embracing the latest medical technologies and treatment approaches.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
