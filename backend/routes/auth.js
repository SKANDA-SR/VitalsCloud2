const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Doctor login endpoint
router.post('/doctor/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find doctor by email
        const doctor = await Doctor.findOne({ email: email.toLowerCase() });
        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isValidPassword = await doctor.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if doctor is active
        if (doctor.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is not active'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: doctor._id, 
                email: doctor.email, 
                role: 'doctor',
                name: doctor.fullName 
            },
            process.env.JWT_SECRET || 'clinic_secret_key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                doctor: {
                    id: doctor._id,
                    email: doctor.email,
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                    fullName: doctor.fullName,
                    specialization: doctor.specialization,
                    phone: doctor.phone,
                    imageUrl: doctor.imageUrl
                }
            }
        });
    } catch (error) {
        console.error('Doctor login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clinic_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get current doctor profile
router.get('/doctor/profile', verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).select('-password');
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// Logout (client-side token removal)
router.post('/doctor/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
