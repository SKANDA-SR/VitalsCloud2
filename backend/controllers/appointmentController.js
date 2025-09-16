const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { validationResult } = require('express-validator');
const moment = require('moment');

// Get all appointments with optional filtering
const getAllAppointments = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            doctorId,
            date,
            patientEmail
        } = req.query;

        const query = {};

        // Apply filters
        if (status) query.status = status;
        if (doctorId) query.doctorId = doctorId;
        if (date) {
            const startDate = moment(date).startOf('day').toDate();
            const endDate = moment(date).endOf('day').toDate();
            query.appointmentDate = { $gte: startDate, $lte: endDate };
        }
        if (patientEmail) query['patient.email'] = { $regex: patientEmail, $options: 'i' };

        const appointments = await Appointment
            .find(query)
            .populate('doctorId', 'firstName lastName specialization email phone consultationFee')
            .sort({ appointmentDate: -1, appointmentTime: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Appointment.countDocuments(query);

        res.json({
            success: true,
            data: appointments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// Get single appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment
            .findById(req.params.id)
            .populate('doctorId', 'firstName lastName specialization email phone consultationFee');
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
};

// Create new appointment
const createAppointment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const appointmentData = req.body;

        // Validate doctor exists in MongoDB
        const doctor = await Doctor.findById(appointmentData.doctorId);
        if (!doctor || doctor.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Doctor not found or inactive'
            });
        }

        // Check for appointment conflicts
        const conflictAppointment = await Appointment.findOne({
            doctorId: appointmentData.doctorId,
            appointmentDate: new Date(appointmentData.appointmentDate),
            appointmentTime: appointmentData.appointmentTime,
            status: { $in: ['scheduled', 'confirmed'] }
        });

        if (conflictAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Time slot already booked for this doctor'
            });
        }

        // Create appointment
        const appointment = new Appointment(appointmentData);
        await appointment.save();

        // Update or create patient record
        const patientData = appointmentData.patient;
        await Patient.findOneAndUpdate(
            { 'personalInfo.email': patientData.email },
            {
                $set: {
                    'personalInfo.firstName': patientData.firstName,
                    'personalInfo.lastName': patientData.lastName,
                    'personalInfo.phone': patientData.phone,
                    'personalInfo.dateOfBirth': patientData.dateOfBirth,
                    'personalInfo.gender': patientData.gender,
                    'contactInfo.address.street': patientData.address,
                    'contactInfo.emergencyContact': patientData.emergencyContact
                }
            },
            { upsert: true, new: true }
        );

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
};

// Update appointment
const updateAppointment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
            error: error.message
        });
    }
};

// Get appointments by date range
const getAppointmentsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, doctorId } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const query = {
            appointmentDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (doctorId) {
            query.doctorId = parseInt(doctorId);
        }

        const appointments = await Appointment.find(query)
            .sort({ appointmentDate: 1, appointmentTime: 1 });

        res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error('Get appointments by date range error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDateRange
};
