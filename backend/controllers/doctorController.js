const Doctor = require('../models/Doctor');
const { validationResult } = require('express-validator');

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            specialization,
            status = 'active',
            search
        } = req.query;

        // Build filter query
        let filter = { status };
        
        if (specialization) {
            filter.specialization = specialization;
        }
        
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } }
            ];
        }

        // Get paginated results
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const doctors = await Doctor.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .select('-password');

        // Get total count
        const total = await Doctor.countDocuments(filter);

        res.json({
            success: true,
            data: doctors,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors',
            error: error.message
        });
    }
};

// Get single doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');
        
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
        console.error('Get doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor',
            error: error.message
        });
    }
};

// Create new doctor
const createDoctor = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const doctorData = {
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            email: req.body.email,
            password: req.body.password || 'doctor123', // Default password
            specialization: req.body.specialization,
            qualification: req.body.qualification,
            experienceYears: req.body.experience_years,
            phone: req.body.phone,
            consultationFee: req.body.consultation_fee,
            availableDays: req.body.available_days,
            availableHours: req.body.available_hours,
            bio: req.body.bio,
            imageUrl: req.body.image_url
        };

        const doctor = new Doctor(doctorData);
        await doctor.save();

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: doctor
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Doctor with this email already exists'
            });
        }
        
        console.error('Create doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating doctor',
            error: error.message
        });
    }
};

// Update doctor
const updateDoctor = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const updateData = {};
        
        // Map fields from request body
        if (req.body.first_name) updateData.firstName = req.body.first_name;
        if (req.body.last_name) updateData.lastName = req.body.last_name;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.specialization) updateData.specialization = req.body.specialization;
        if (req.body.qualification) updateData.qualification = req.body.qualification;
        if (req.body.experience_years) updateData.experienceYears = req.body.experience_years;
        if (req.body.phone) updateData.phone = req.body.phone;
        if (req.body.consultation_fee) updateData.consultationFee = req.body.consultation_fee;
        if (req.body.available_days) updateData.availableDays = req.body.available_days;
        if (req.body.available_hours) updateData.availableHours = req.body.available_hours;
        if (req.body.bio) updateData.bio = req.body.bio;
        if (req.body.image_url) updateData.imageUrl = req.body.image_url;
        if (req.body.status) updateData.status = req.body.status;

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            message: 'Doctor updated successfully',
            data: doctor
        });
    } catch (error) {
        console.error('Update doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating doctor',
            error: error.message
        });
    }
};

// Delete doctor (soft delete by updating status)
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive' },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            message: 'Doctor deactivated successfully'
        });
    } catch (error) {
        console.error('Delete doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting doctor',
            error: error.message
        });
    }
};

// Get unique specializations
const getSpecializations = async (req, res) => {
    try {
        const specializations = await Doctor.distinct('specialization', { status: 'active' });

        res.json({
            success: true,
            data: specializations.sort()
        });
    } catch (error) {
        console.error('Get specializations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching specializations',
            error: error.message
        });
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getSpecializations
};
