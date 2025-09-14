const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const { status = 'active', category } = req.query;
        
        let filter = { status };
        if (category) {
            filter.category = category;
        }
        
        const services = await Service.find(filter).sort({ name: 1 });

        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
});

// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching service',
            error: error.message
        });
    }
});

// Create service
router.post('/', async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating service',
            error: error.message
        });
    }
});

module.exports = router;
