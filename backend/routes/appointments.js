const express = require('express');
const { body } = require('express-validator');
const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDateRange
} = require('../controllers/appointmentController');

const router = express.Router();

// Validation rules for appointment creation
const appointmentValidation = [
    body('patient.firstName')
        .trim()
        .notEmpty()
        .withMessage('Patient first name is required')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),
    
    body('patient.lastName')
        .trim()
        .notEmpty()
        .withMessage('Patient last name is required')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),
    
    body('patient.email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    
    body('patient.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Invalid phone number format'),
    
    body('doctorId')
        .isInt({ min: 1 })
        .withMessage('Valid doctor ID is required'),
    
    body('appointmentDate')
        .isISO8601()
        .withMessage('Valid appointment date is required')
        .custom((value) => {
            const appointmentDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (appointmentDate < today) {
                throw new Error('Appointment date cannot be in the past');
            }
            return true;
        }),
    
    body('appointmentTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Valid appointment time is required (HH:MM format)'),
    
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Reason for appointment is required')
        .isLength({ min: 5 })
        .withMessage('Reason must be at least 5 characters'),
    
    body('status')
        .optional()
        .isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])
        .withMessage('Invalid status'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority level')
];

// Update validation (fields are optional)
const updateValidation = [
    body('patient.firstName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),
    
    body('patient.lastName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),
    
    body('patient.email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    
    body('appointmentDate')
        .optional()
        .isISO8601()
        .withMessage('Valid appointment date is required'),
    
    body('appointmentTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Valid appointment time is required (HH:MM format)'),
    
    body('status')
        .optional()
        .isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])
        .withMessage('Invalid status'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority level')
];

// Routes
router.get('/', getAllAppointments);
router.get('/date-range', getAppointmentsByDateRange);
router.get('/:id', getAppointmentById);
router.post('/', appointmentValidation, createAppointment);
router.put('/:id', updateValidation, updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
