import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: 'bi-heart-pulse',
      title: 'General Medicine',
      description: 'Comprehensive primary care services for all ages, including routine check-ups, preventive care, and treatment of common illnesses.',
      features: ['Annual Physical Exams', 'Chronic Disease Management', 'Health Screenings', 'Vaccinations']
    },
    {
      icon: 'bi-activity',
      title: 'Cardiology',
      description: 'Specialized heart and cardiovascular care with advanced diagnostic and treatment options.',
      features: ['ECG/EKG Tests', 'Stress Testing', 'Heart Disease Treatment', 'Blood Pressure Management']
    },
    {
      icon: 'bi-person-hearts',
      title: 'Pediatrics',
      description: 'Complete healthcare services for infants, children, and adolescents in a child-friendly environment.',
      features: ['Well-Child Visits', 'Growth Monitoring', 'Childhood Vaccinations', 'Developmental Assessments']
    },
    {
      icon: 'bi-bandaid',
      title: 'Dermatology',
      description: 'Expert skin care services for all dermatological conditions and cosmetic procedures.',
      features: ['Skin Examinations', 'Acne Treatment', 'Skin Cancer Screening', 'Cosmetic Procedures']
    },
    {
      icon: 'bi-activity',
      title: 'Orthopedics',
      description: 'Comprehensive bone, joint, and muscle care from injury prevention to surgical treatment.',
      features: ['Fracture Care', 'Joint Replacement', 'Sports Medicine', 'Physical Therapy']
    },
    {
      icon: 'bi-gender-female',
      title: 'Gynecology',
      description: 'Complete womens health services in a comfortable and confidential environment.',
      features: ['Annual Exams', 'Pregnancy Care', 'Family Planning', 'Menopause Management']
    },
    {
      icon: 'bi-eye',
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine exams to advanced surgical procedures.',
      features: ['Eye Exams', 'Vision Correction', 'Cataract Surgery', 'Glaucoma Treatment']
    },
    {
      icon: 'bi-bandaid-fill',
      title: 'Emergency Care',
      description: '24/7 emergency medical services for urgent and life-threatening conditions.',
      features: ['Trauma Care', 'Critical Care', 'Emergency Surgery', 'Ambulance Services']
    }
  ];

  return (
    <div className="services-page py-5">
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold mb-4">Our Medical Services</h1>
            <p className="lead text-muted">
              We provide comprehensive healthcare services with state-of-the-art equipment 
              and experienced medical professionals.
            </p>
          </Col>
        </Row>

        {/* Services Grid */}
        <Row>
          {services.map((service, index) => (
            <Col lg={6} className="mb-4" key={index}>
              <Card className="h-100 service-card border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start">
                    <div className="service-icon me-3">
                      <i className={`bi ${service.icon} text-primary fs-1`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h4 className="fw-bold mb-3">{service.title}</h4>
                      <p className="text-muted mb-3">{service.description}</p>
                      <ul className="list-unstyled">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="mb-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 p-4 pt-0">
                  <Button as={Link} to="/book-appointment" variant="outline-primary" size="sm">
                    <i className="bi bi-calendar-plus me-2"></i>
                    Schedule Consultation
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA Section */}
        <Row className="mt-5">
          <Col lg={10} className="mx-auto">
            <div className="bg-primary text-white rounded p-5 text-center">
              <Row className="align-items-center">
                <Col lg={8}>
                  <h3 className="mb-3">Need immediate medical attention?</h3>
                  <p className="mb-0">
                    Our emergency department is open 24/7 to provide urgent care when you need it most.
                  </p>
                </Col>
                <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                  <Button variant="warning" size="lg">
                    <i className="bi bi-telephone-fill me-2"></i>
                    Call Emergency: 911
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Additional Info */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto text-center">
            <h3 className="mb-4">Why Choose Our Services?</h3>
            <Row>
              <Col md={4} className="mb-3">
                <i className="bi bi-award-fill text-primary fs-1 mb-3"></i>
                <h6>Board-Certified Physicians</h6>
                <p className="text-muted small">All our doctors are board-certified with years of experience</p>
              </Col>
              <Col md={4} className="mb-3">
                <i className="bi bi-hospital text-primary fs-1 mb-3"></i>
                <h6>Modern Facilities</h6>
                <p className="text-muted small">State-of-the-art medical equipment and comfortable facilities</p>
              </Col>
              <Col md={4} className="mb-3">
                <i className="bi bi-shield-check text-primary fs-1 mb-3"></i>
                <h6>Quality Care</h6>
                <p className="text-muted small">Committed to providing the highest quality medical care</p>
              </Col>
            </Row>
            <div className="mt-4">
              <Button as={Link} to="/book-appointment" variant="primary" size="lg">
                <i className="bi bi-calendar-plus me-2"></i>
                Book Your Appointment Today
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Services;
