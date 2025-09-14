import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { doctorsAPI, appointmentsAPI } from '../services/api';
import moment from 'moment';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  const watchDoctorId = watch('doctorId');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await doctorsAPI.getAll({ status: 'active', limit: 100 });
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id,
    label: `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`,
    data: doctor
  }));

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setSubmitStatus(null);

      const appointmentData = {
        patient: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender,
          address: data.address,
          emergencyContact: data.emergencyContactName ? {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
            relationship: data.emergencyContactRelation
          } : undefined
        },
        doctorId: parseInt(data.doctorId),
        appointmentDate: moment(selectedDate).format('YYYY-MM-DD'),
        appointmentTime: data.appointmentTime,
        reason: data.reason,
        symptoms: data.symptoms ? data.symptoms.split(',').map(s => s.trim()) : [],
        notes: data.notes || '',
        priority: data.priority || 'medium'
      };

      const response = await appointmentsAPI.create(appointmentData);

      if (response.data.success) {
        setSubmitStatus({ type: 'success', message: 'Appointment booked successfully!' });
        toast.success('Appointment booked successfully!');
        reset();
        setSelectedDate(null);
      } else {
        throw new Error(response.data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months ahead

  return (
    <div className="book-appointment-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Book an Appointment
                </h2>
                <p className="mb-0 mt-2 opacity-75">
                  Schedule your visit with our medical professionals
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                {submitStatus && (
                  <Alert 
                    variant={submitStatus.type === 'success' ? 'success' : 'danger'} 
                    className="mb-4"
                  >
                    <i className={`bi ${submitStatus.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                    {submitStatus.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* Personal Information */}
                  <div className="section-header mb-4">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-person me-2"></i>
                      Personal Information
                    </h5>
                  </div>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        {...register('firstName', { 
                          required: 'First name is required',
                          minLength: { value: 2, message: 'Minimum 2 characters required' }
                        })}
                        isInvalid={errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName?.message}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        {...register('lastName', { 
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Minimum 2 characters required' }
                        })}
                        isInvalid={errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName?.message}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        isInvalid={errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        {...register('phone', { 
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: 'Invalid phone number'
                          }
                        })}
                        isInvalid={errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone?.message}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...register('dateOfBirth')}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select {...register('gender')}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your address"
                      {...register('address')}
                    />
                  </div>

                  {/* Appointment Details */}
                  <div className="section-header mb-4 mt-5">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-calendar-event me-2"></i>
                      Appointment Details
                    </h5>
                  </div>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Select Doctor *</Form.Label>
                      {loadingDoctors ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" size="sm" />
                          <span className="ms-2">Loading doctors...</span>
                        </div>
                      ) : (
                        <Select
                          options={doctorOptions}
                          placeholder="Choose a doctor..."
                          onChange={(selected) => setValue('doctorId', selected?.value)}
                          isSearchable
                          className={errors.doctorId ? 'is-invalid' : ''}
                        />
                      )}
                      {errors.doctorId && (
                        <div className="text-danger small mt-1">Doctor selection is required</div>
                      )}
                      <input type="hidden" {...register('doctorId', { required: true })} />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Appointment Date *</Form.Label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={minDate}
                        maxDate={maxDate}
                        filterDate={isWeekday}
                        placeholderText="Select a date"
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Preferred Time *</Form.Label>
                      <Form.Select
                        {...register('appointmentTime', { required: 'Please select a time' })}
                        isInvalid={errors.appointmentTime}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.appointmentTime?.message}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select {...register('priority')}>
                        <option value="medium">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <Form.Label>Reason for Visit *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Please describe the reason for your appointment"
                      {...register('reason', { 
                        required: 'Please provide a reason for your visit',
                        minLength: { value: 5, message: 'Please provide more details' }
                      })}
                      isInvalid={errors.reason}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.reason?.message}
                    </Form.Control.Feedback>
                  </div>

                  <div className="mb-3">
                    <Form.Label>Current Symptoms</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="List any symptoms (comma separated)"
                      {...register('symptoms')}
                    />
                    <Form.Text className="text-muted">
                      Separate multiple symptoms with commas
                    </Form.Text>
                  </div>

                  <div className="mb-4">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Any additional information you'd like to share"
                      {...register('notes')}
                    />
                  </div>

                  {/* Emergency Contact (Optional) */}
                  <div className="section-header mb-4 mt-5">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-person-lines-fill me-2"></i>
                      Emergency Contact (Optional)
                    </h5>
                  </div>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Contact Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Emergency contact name"
                        {...register('emergencyContactName')}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Emergency contact phone"
                        {...register('emergencyContactPhone')}
                      />
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Spouse, Parent, Sibling"
                      {...register('emergencyContactRelation')}
                    />
                  </div>

                  <div className="text-center mt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      disabled={loading || !selectedDate}
                      className="px-5"
                    >
                      {loading && <Spinner animation="border" size="sm" className="me-2" />}
                      <i className="bi bi-calendar-check me-2"></i>
                      Book Appointment
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookAppointment;
