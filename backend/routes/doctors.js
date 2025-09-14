const express = require('express');
const { body } = require('express-validator');
const {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getSpecializations
} = require('../controllers/doctorController');

const router = express.Router();

// Validation rules for doctor creation
const doctorValidation = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters'),
    
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Last name must be between 2 and 100 characters'),
    
    body('specialization')
        .trim()
        .notEmpty()
        .withMessage('Specialization is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Specialization must be between 2 and 100 characters'),
    
    body('qualification')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Qualification must not exceed 200 characters'),
    
    body('experience_years')
        .optional()
        .isInt({ min: 0, max: 60 })
        .withMessage('Experience years must be between 0 and 60'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Invalid phone number format'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    
    body('consultation_fee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Consultation fee must be a positive number'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Bio must not exceed 1000 characters'),
    
    body('image_url')
        .optional()
        .trim()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    body('available_days')
        .optional()
        .isArray()
        .withMessage('Available days must be an array'),
    
    body('available_days.*')
        .optional()
        .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
        .withMessage('Invalid day in available days'),
    
    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive')
];

// Update validation (all fields optional)
const updateValidation = [
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters'),
    
    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Last name must be between 2 and 100 characters'),
    
    body('specialization')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Specialization must be between 2 and 100 characters'),
    
    body('qualification')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Qualification must not exceed 200 characters'),
    
    body('experience_years')
        .optional()
        .isInt({ min: 0, max: 60 })
        .withMessage('Experience years must be between 0 and 60'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Invalid phone number format'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    
    body('consultation_fee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Consultation fee must be a positive number'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Bio must not exceed 1000 characters'),
    
    body('image_url')
        .optional()
        .trim()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    body('available_days')
        .optional()
        .isArray()
        .withMessage('Available days must be an array'),
    
    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive')
];

// Routes
router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/:id', getDoctorById);
router.post('/', doctorValidation, createDoctor);
router.put('/:id', updateValidation, updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
