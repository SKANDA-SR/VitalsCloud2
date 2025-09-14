const express = require('express');
const Patient = require('../models/Patient');

const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status = 'active' } = req.query;
        const query = { status };

        if (search) {
            query.$or = [
                { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
                { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
                { 'personalInfo.email': { $regex: search, $options: 'i' } },
                { 'personalInfo.phone': { $regex: search, $options: 'i' } }
            ];
        }

        const patients = await Patient
            .find(query)
            .select('personalInfo contactInfo medicalInfo registrationDate totalVisits lastVisit status')
            .sort({ registrationDate: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Patient.countDocuments(query);

        res.json({
            success: true,
            data: patients,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching patients', error: error.message });
    }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching patient', error: error.message });
    }
});

// Get patient by email
router.get('/email/:email', async (req, res) => {
    try {
        const patient = await Patient.findOne({ 'personalInfo.email': req.params.email });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching patient', error: error.message });
    }
});

module.exports = router;
