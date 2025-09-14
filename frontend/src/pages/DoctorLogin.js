import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const DoctorLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/doctor/login', formData);
            
            if (response.data.success) {
                // Store token and doctor info
                localStorage.setItem('doctorToken', response.data.data.token);
                localStorage.setItem('doctorInfo', JSON.stringify(response.data.data.doctor));
                
                toast.success(`Welcome back, Dr. ${response.data.data.doctor.lastName}!`);
                navigate('/doctor/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = (email) => {
        setFormData({
            email: email,
            password: 'doctor123'
        });
    };

    return (
        <div className="doctor-login-page">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={6} md={8}>
                        <Card className="shadow-lg border-0">
                            <Card.Header className="bg-primary text-white text-center py-4">
                                <h3 className="mb-0">
                                    <i className="bi bi-person-badge me-2"></i>
                                    Doctor Login
                                </h3>
                                <p className="mb-0 mt-2 opacity-90">Access your dashboard and manage appointments</p>
                            </Card.Header>
                            
                            <Card.Body className="p-4">
                                {error && (
                                    <Alert variant="danger" className="mb-3">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {error}
                                    </Alert>
                                )}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="bi bi-envelope me-1"></i>
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <i className="bi bi-lock me-1"></i>
                                            Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <hr className="my-4" />

                                <div className="demo-credentials">
                                    <h6 className="text-muted mb-3">Demo Credentials:</h6>
                                    <Row>
                                        <Col md={6} className="mb-2">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => handleDemoLogin('dr.sarah.johnson@clinic.com')}
                                            >
                                                <i className="bi bi-person-circle me-1"></i>
                                                Dr. Sarah Johnson
                                                <small className="d-block">General Medicine</small>
                                            </Button>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => handleDemoLogin('dr.michael.chen@clinic.com')}
                                            >
                                                <i className="bi bi-person-circle me-1"></i>
                                                Dr. Michael Chen
                                                <small className="d-block">Pediatrics</small>
                                            </Button>
                                        </Col>
                                    </Row>
                                    <small className="text-muted">
                                        Password for all demo accounts: <code>doctor123</code>
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DoctorLogin;
