import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { doctorsAPI } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, [selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = { status: 'active', limit: 100 };
      if (selectedSpecialization) {
        params.specialization = selectedSpecialization;
      }
      const response = await doctorsAPI.getAll(params);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await doctorsAPI.getSpecializations();
      setSpecializations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Container>
          <Spinner animation="border" />
          <p className="mt-3">Loading doctors...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="doctors-page py-5">
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold mb-4">Our Medical Team</h1>
            <p className="lead text-muted">
              Meet our experienced and qualified doctors dedicated to providing exceptional healthcare
            </p>
          </Col>
        </Row>

        {/* Filter */}
        <Row className="mb-4">
          <Col md={6} lg={4} className="mx-auto">
            <Form.Select 
              value={selectedSpecialization} 
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Doctors Grid */}
        <Row>
          {doctors.map(doctor => (
            <Col lg={4} md={6} className="mb-4" key={doctor.id}>
              <Card className="h-100 doctor-card border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="doctor-image mb-3">
                    {doctor.image_url ? (
                      <img 
                        src={doctor.image_url} 
                        alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                        className="rounded-circle doctor-photo"
                        style={{width: '100px', height: '100px', objectFit: 'cover'}}
                      />
                    ) : (
                      <div className="doctor-placeholder">
                        <i className="bi bi-person-circle" style={{fontSize: '100px', color: '#dee2e6'}}></i>
                      </div>
                    )}
                  </div>
                  
                  <h5 className="fw-bold mb-2">
                    Dr. {doctor.first_name} {doctor.last_name}
                  </h5>
                  
                  <Badge bg="primary" className="mb-3">
                    {doctor.specialization}
                  </Badge>
                  
                  {doctor.qualification && (
                    <p className="text-muted mb-2">{doctor.qualification}</p>
                  )}
                  
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <i className="bi bi-award text-warning me-2"></i>
                    <span className="text-muted">
                      {doctor.experience_years || 0} years experience
                    </span>
                  </div>
                  
                  {doctor.consultation_fee > 0 && (
                    <p className="fw-bold text-success mb-3">
                      Consultation: ${doctor.consultation_fee}
                    </p>
                  )}
                  
                  {doctor.bio && (
                    <p className="text-muted small mb-3" style={{fontSize: '0.9rem'}}>
                      {doctor.bio.length > 100 ? 
                        `${doctor.bio.substring(0, 100)}...` : 
                        doctor.bio
                      }
                    </p>
                  )}
                  
                  <div className="d-flex justify-content-center gap-2">
                    {doctor.phone && (
                      <Badge bg="outline-secondary" className="text-dark">
                        <i className="bi bi-telephone me-1"></i>
                        {doctor.phone}
                      </Badge>
                    )}
                  </div>
                </Card.Body>
                
                <Card.Footer className="bg-transparent text-center border-0 pb-4">
                  <Button 
                    as={Link} 
                    to="/book-appointment" 
                    variant="primary" 
                    size="sm"
                  >
                    <i className="bi bi-calendar-plus me-1"></i>
                    Book Appointment
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {doctors.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <i className="bi bi-person-x display-1 text-muted mb-3"></i>
              <h4>No doctors found</h4>
              <p className="text-muted">
                {selectedSpecialization 
                  ? `No doctors available for ${selectedSpecialization}` 
                  : 'No doctors are currently available'
                }
              </p>
            </Col>
          </Row>
        )}

        {/* CTA Section */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto text-center">
            <div className="bg-light rounded p-5">
              <h3 className="mb-3">Ready to schedule an appointment?</h3>
              <p className="text-muted mb-4">
                Choose from our qualified medical professionals and book your visit today
              </p>
              <Button as={Link} to="/book-appointment" variant="primary" size="lg">
                <i className="bi bi-calendar-plus me-2"></i>
                Book Now
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Doctors;
