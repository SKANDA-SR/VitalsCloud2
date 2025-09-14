import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: 'bi-calendar-check',
      title: 'Easy Appointments',
      description: 'Book your appointment online 24/7 with our simple scheduling system'
    },
    {
      icon: 'bi-shield-check',
      title: 'Expert Care',
      description: 'Our certified physicians provide comprehensive medical care with years of experience'
    },
    {
      icon: 'bi-clock',
      title: '24/7 Emergency',
      description: 'Round-the-clock emergency services for urgent medical situations'
    },
    {
      icon: 'bi-heart',
      title: 'Compassionate Service',
      description: 'We treat every patient with dignity, respect, and personalized attention'
    }
  ];

  const services = [
    'General Medicine',
    'Cardiology',
    'Pediatrics', 
    'Dermatology',
    'Orthopedics',
    'Gynecology'
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">
                  Your Health is Our
                  <span className="text-warning"> Priority</span>
                </h1>
                <p className="lead mb-4">
                  Experience exceptional healthcare with our team of dedicated 
                  medical professionals. We provide comprehensive medical services 
                  in a comfortable and caring environment.
                </p>
                <div className="hero-buttons">
                  <Button 
                    as={Link} 
                    to="/book-appointment" 
                    size="lg" 
                    variant="warning"
                    className="me-3 mb-2"
                  >
                    <i className="bi bi-calendar-plus me-2"></i>
                    Book Appointment
                  </Button>
                  <Button 
                    as={Link} 
                    to="/services" 
                    size="lg" 
                    variant="outline-light"
                    className="mb-2"
                  >
                    View Services
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <i className="bi bi-hospital display-1 text-warning opacity-75"></i>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="section-title">Why Choose Us</h2>
              <p className="text-muted">
                We are committed to providing the highest quality healthcare services
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} className="mb-4" key={index}>
                <Card className="h-100 border-0 shadow-sm feature-card">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon mb-3">
                      <i className={`bi ${feature.icon} text-primary`} style={{fontSize: '3rem'}}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Services Overview Section */}
      <section className="services-overview bg-light py-5">
        <Container>
          <Row>
            <Col lg={6} className="mb-4">
              <h2 className="section-title">Our Medical Services</h2>
              <p className="text-muted mb-4">
                We offer a comprehensive range of medical services to meet all your healthcare needs.
                Our experienced medical team is dedicated to providing personalized care.
              </p>
              <Row>
                {services.map((service, index) => (
                  <Col sm={6} className="mb-2" key={index}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>{service}</span>
                    </div>
                  </Col>
                ))}
              </Row>
              <div className="mt-4">
                <Button as={Link} to="/services" variant="primary">
                  View All Services
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="services-visual p-5">
                <i className="bi bi-bandaid display-1 text-primary opacity-75"></i>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">10+</h3>
                <p className="text-muted">Years of Experience</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">50+</h3>
                <p className="text-muted">Expert Doctors</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">1000+</h3>
                <p className="text-muted">Happy Patients</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary">24/7</h3>
                <p className="text-muted">Emergency Care</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Take the first step towards better health. Schedule your appointment 
                with our experienced medical team today.
              </p>
              <Button 
                as={Link} 
                to="/book-appointment" 
                size="lg" 
                variant="warning"
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Book Your Appointment
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
