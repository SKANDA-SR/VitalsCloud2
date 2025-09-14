const express = require('express');
const { verifyToken } = require('./auth');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Get doctor's appointments
router.get('/my-appointments', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Doctor role required.'
            });
        }

        const { date, status, page = 1, limit = 10 } = req.query;
        
        let filter = { doctorId: req.user.id };
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.appointmentDate = { $gte: startDate, $lt: endDate };
        }
        
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const appointments = await Appointment.find(filter)
            .sort({ appointmentDate: 1, appointmentTime: 1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Appointment.countDocuments(filter);

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
        console.error('Get doctor appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

// Update appointment status
router.patch('/appointments/:id/status', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Doctor role required.'
            });
        }

        const { status, notes } = req.body;
        
        if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be confirmed, completed, or cancelled.'
            });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, doctorId: req.user.id },
            { 
                status, 
                notes: notes || undefined,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment status',
            error: error.message
        });
    }
});

// Get appointment details
router.get('/appointments/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Doctor role required.'
            });
        }

        const appointment = await Appointment.findOne({ 
            _id: req.params.id, 
            doctorId: req.user.id 
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found or access denied'
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
});

// Get doctor's schedule for a specific date
router.get('/schedule', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Doctor role required.'
            });
        }

        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const appointments = await Appointment.find({
            doctorId: req.user.id,
            appointmentDate: { $gte: startDate, $lt: endDate },
            status: { $in: ['pending', 'confirmed'] }
        }).sort({ appointmentTime: 1 });

        res.json({
            success: true,
            data: {
                date,
                appointments
            }
        });
    } catch (error) {
        console.error('Get doctor schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching schedule',
            error: error.message
        });
    }
});

module.exports = router;
