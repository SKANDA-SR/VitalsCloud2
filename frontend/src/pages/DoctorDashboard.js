import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Tab, Tabs, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const DoctorDashboard = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication();
        loadDoctorData();
    }, []);

    const checkAuthentication = () => {
        const token = localStorage.getItem('doctorToken');
        const info = localStorage.getItem('doctorInfo');
        
        if (!token || !info) {
            toast.error('Please login to access the dashboard');
            navigate('/doctor/login');
            return;
        }
        
        try {
            setDoctorInfo(JSON.parse(info));
        } catch (error) {
            toast.error('Invalid session. Please login again.');
            handleLogout();
        }
    };

    const loadDoctorData = async () => {
        try {
            const token = localStorage.getItem('doctorToken');
            if (!token) return;

            // Set up axios headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Load appointments
            const appointmentsResponse = await api.get('/doctor/my-appointments?limit=10');
            if (appointmentsResponse.data.success) {
                setAppointments(appointmentsResponse.data.data);
            }
        } catch (error) {
            console.error('Error loading doctor data:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorInfo');
        delete api.defaults.headers.common['Authorization'];
        navigate('/doctor/login');
        toast.success('Logged out successfully');
    };

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            const response = await api.patch(`/doctor/appointments/${appointmentId}/status`, { status });
            if (response.data.success) {
                toast.success(`Appointment ${status} successfully`);
                loadDoctorData(); // Reload appointments
            }
        } catch (error) {
            toast.error('Failed to update appointment status');
            console.error('Error updating appointment:', error);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            confirmed: 'success',
            completed: 'primary',
            cancelled: 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading dashboard...</p>
            </Container>
        );
    }

    return (
        <div className="doctor-dashboard">
            <Container className="py-4">
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="mb-1">
                                    Welcome, Dr. {doctorInfo?.lastName}
                                </h2>
                                <p className="text-muted mb-0">
                                    <i className="bi bi-hospital me-1"></i>
                                    {doctorInfo?.specialization}
                                </p>
                            </div>
                            <Button variant="outline-danger" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Quick Stats */}
                <Row className="mb-4">
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center">
                                <i className="bi bi-calendar-check fs-2 text-success mb-2"></i>
                                <h4 className="mb-1">{appointments.filter(apt => apt.status === 'confirmed').length}</h4>
                                <small className="text-muted">Confirmed Today</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center">
                                <i className="bi bi-clock-history fs-2 text-warning mb-2"></i>
                                <h4 className="mb-1">{appointments.filter(apt => apt.status === 'pending').length}</h4>
                                <small className="text-muted">Pending</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center">
                                <i className="bi bi-check-circle fs-2 text-primary mb-2"></i>
                                <h4 className="mb-1">{appointments.filter(apt => apt.status === 'completed').length}</h4>
                                <small className="text-muted">Completed</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center">
                                <i className="bi bi-calendar3 fs-2 text-info mb-2"></i>
                                <h4 className="mb-1">{appointments.length}</h4>
                                <small className="text-muted">Total Appointments</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Tabs */}
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(key) => setActiveTab(key)}
                            className="mb-3"
                        >
                            <Tab eventKey="overview" title={<><i className="bi bi-grid me-1"></i>Overview</>}>
                                <Row>
                                    <Col lg={8}>
                                        <h5 className="mb-3">Recent Appointments</h5>
                                        {appointments.length === 0 ? (
                                            <Alert variant="info">
                                                <i className="bi bi-info-circle me-2"></i>
                                                No appointments found.
                                            </Alert>
                                        ) : (
                                            <Table responsive hover>
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Patient</th>
                                                        <th>Service</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointments.slice(0, 5).map((appointment, index) => (
                                                        <tr key={appointment._id || index}>
                                                            <td>{formatDate(appointment.appointmentDate)}</td>
                                                            <td>{formatTime(appointment.appointmentTime)}</td>
                                                            <td>
                                                                <div>
                                                                    <strong>{appointment.patientName}</strong>
                                                                    <br />
                                                                    <small className="text-muted">{appointment.patientEmail}</small>
                                                                </div>
                                                            </td>
                                                            <td>{appointment.service || 'General Consultation'}</td>
                                                            <td>{getStatusBadge(appointment.status)}</td>
                                                            <td>
                                                                {appointment.status === 'pending' && (
                                                                    <div>
                                                                        <Button
                                                                            variant="success"
                                                                            size="sm"
                                                                            className="me-1"
                                                                            onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                                                        >
                                                                            <i className="bi bi-check"></i>
                                                                        </Button>
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                                                        >
                                                                            <i className="bi bi-x"></i>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                                {appointment.status === 'confirmed' && (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                                                    >
                                                                        <i className="bi bi-check-circle me-1"></i>
                                                                        Complete
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Col>
                                    <Col lg={4}>
                                        <h5 className="mb-3">Doctor Profile</h5>
                                        <Card className="border-light">
                                            <Card.Body>
                                                <div className="text-center mb-3">
                                                    {doctorInfo?.imageUrl ? (
                                                        <img
                                                            src={doctorInfo.imageUrl}
                                                            alt={doctorInfo.fullName}
                                                            className="rounded-circle mb-2"
                                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2"
                                                            style={{ width: '80px', height: '80px' }}
                                                        >
                                                            <i className="bi bi-person fs-3"></i>
                                                        </div>
                                                    )}
                                                    <h6 className="mb-0">{doctorInfo?.fullName}</h6>
                                                    <small className="text-muted">{doctorInfo?.specialization}</small>
                                                </div>
                                                <hr />
                                                <div className="mb-2">
                                                    <i className="bi bi-envelope me-2 text-muted"></i>
                                                    <small>{doctorInfo?.email}</small>
                                                </div>
                                                {doctorInfo?.phone && (
                                                    <div className="mb-2">
                                                        <i className="bi bi-telephone me-2 text-muted"></i>
                                                        <small>{doctorInfo.phone}</small>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="appointments" title={<><i className="bi bi-calendar3 me-1"></i>All Appointments</>}>
                                <h5 className="mb-3">All Appointments</h5>
                                {appointments.length === 0 ? (
                                    <Alert variant="info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        No appointments found.
                                    </Alert>
                                ) : (
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Patient Details</th>
                                                <th>Service</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appointment, index) => (
                                                <tr key={appointment._id || index}>
                                                    <td>{formatDate(appointment.appointmentDate)}</td>
                                                    <td>{formatTime(appointment.appointmentTime)}</td>
                                                    <td>
                                                        <div>
                                                            <strong>{appointment.patientName}</strong>
                                                            <br />
                                                            <small className="text-muted">{appointment.patientEmail}</small>
                                                            <br />
                                                            <small className="text-muted">{appointment.patientPhone}</small>
                                                        </div>
                                                    </td>
                                                    <td>{appointment.service || 'General Consultation'}</td>
                                                    <td>
                                                        <small>{appointment.reason || 'Not specified'}</small>
                                                    </td>
                                                    <td>{getStatusBadge(appointment.status)}</td>
                                                    <td>
                                                        {appointment.status === 'pending' && (
                                                            <div>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    className="me-1"
                                                                    onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                                                >
                                                                    <i className="bi bi-check"></i>
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                                                >
                                                                    <i className="bi bi-x"></i>
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {appointment.status === 'confirmed' && (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                                            >
                                                                <i className="bi bi-check-circle me-1"></i>
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default DoctorDashboard;
