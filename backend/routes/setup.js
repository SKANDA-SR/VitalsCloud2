const express = require('express');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');

const router = express.Router();

// Manual database setup endpoint - FREE TIER SOLUTION
router.post('/initialize', async (req, res) => {
    try {
        console.log('🔄 Database initialization requested...');
        
        // Check if data already exists
        const doctorCount = await Doctor.countDocuments();
        const serviceCount = await Service.countDocuments();
        
        if (doctorCount > 0 || serviceCount > 0) {
            return res.json({
                success: true,
                message: 'Database already initialized',
                data: { 
                    doctors: doctorCount, 
                    services: serviceCount,
                    note: 'Data already exists - no changes made'
                }
            });
        }
        
        console.log('🗑️ Database is empty, initializing with sample data...');
        
        // Add services
        const services = [
            {
                name: 'General Medicine',
                description: 'Comprehensive primary healthcare services for adults, including routine check-ups, preventive care, and treatment of common medical conditions.',
                durationMinutes: 30,
                price: 150.00,
                category: 'Primary Care',
                features: [
                    'Routine health check-ups',
                    'Preventive care',
                    'Chronic disease management',
                    'Health screenings',
                    'Vaccination services'
                ]
            },
            {
                name: 'Pediatrics',
                description: 'Specialized medical care for infants, children, and adolescents, including wellness visits, vaccinations, and treatment of childhood illnesses.',
                durationMinutes: 45,
                price: 180.00,
                category: 'Specialty Care',
                features: [
                    'Child wellness visits',
                    'Pediatric vaccinations',
                    'Growth and development monitoring',
                    'Treatment of childhood illnesses',
                    'Parental guidance and support'
                ]
            },
            {
                name: 'Emergency Care',
                description: '24/7 urgent medical care for serious injuries, acute illnesses, and life-threatening conditions requiring immediate attention.',
                durationMinutes: 60,
                price: 300.00,
                category: 'Emergency Services',
                features: [
                    '24/7 availability',
                    'Trauma care',
                    'Cardiac emergency treatment',
                    'Advanced life support',
                    'Emergency surgery coordination'
                ]
            }
        ];

        console.log('📋 Adding services...');
        const createdServices = await Service.insertMany(services);
        console.log(`✅ Added ${createdServices.length} services`);

        // Add doctors
        const doctors = [
            {
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'dr.sarah.johnson@clinic.com',
                password: 'doctor123', // Will be hashed automatically by the model
                specialization: 'General Medicine',
                qualification: 'MD, MBBS',
                experienceYears: 12,
                phone: '+1-555-0101',
                consultationFee: 150.00,
                availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                availableHours: new Map([
                    ['monday', ['09:00', '17:00']],
                    ['tuesday', ['09:00', '17:00']],
                    ['wednesday', ['09:00', '17:00']],
                    ['thursday', ['09:00', '17:00']],
                    ['friday', ['09:00', '15:00']]
                ]),
                bio: 'Dr. Sarah Johnson is an experienced general practitioner with over 12 years of experience in primary healthcare. She specializes in preventive medicine, chronic disease management, and family medicine.',
                imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
            },
            {
                firstName: 'Michael',
                lastName: 'Chen',
                email: 'dr.michael.chen@clinic.com',
                password: 'doctor123', // Will be hashed automatically by the model
                specialization: 'Pediatrics',
                qualification: 'MD, Pediatrics Board Certified',
                experienceYears: 8,
                phone: '+1-555-0102',
                consultationFee: 180.00,
                availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                availableHours: new Map([
                    ['monday', ['08:00', '16:00']],
                    ['tuesday', ['08:00', '16:00']],
                    ['wednesday', ['08:00', '16:00']],
                    ['thursday', ['08:00', '16:00']],
                    ['friday', ['08:00', '16:00']],
                    ['saturday', ['09:00', '13:00']]
                ]),
                bio: 'Dr. Michael Chen is a dedicated pediatrician who provides comprehensive medical care for children from birth through adolescence. He has special interests in childhood development and preventive pediatric care.',
                imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
            }
        ];

        console.log('👨‍⚕️ Adding doctors...');
        const createdDoctors = await Doctor.insertMany(doctors);
        console.log(`✅ Added ${createdDoctors.length} doctors`);

        console.log('🎉 Database initialization completed successfully!');

        res.json({
            success: true,
            message: 'Database initialized successfully!',
            data: {
                services: createdServices.length,
                doctors: createdDoctors.length,
                credentials: {
                    'Dr. Sarah Johnson (General Medicine)': {
                        email: 'dr.sarah.johnson@clinic.com',
                        password: 'doctor123'
                    },
                    'Dr. Michael Chen (Pediatrics)': {
                        email: 'dr.michael.chen@clinic.com', 
                        password: 'doctor123'
                    }
                },
                next_steps: [
                    'Visit your frontend application',
                    'Go to Doctor Login page',
                    'Use the credentials above to login',
                    'Test the doctor dashboard functionality'
                ]
            }
        });
        
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Database initialization failed',
            error: error.message,
            suggestion: 'Check your MongoDB Atlas connection and try again'
        });
    }
});

// Health check for setup service
router.get('/status', async (req, res) => {
    try {
        const doctorCount = await Doctor.countDocuments();
        const serviceCount = await Service.countDocuments();
        
        res.json({
            success: true,
            message: 'Setup service is working',
            database_status: {
                doctors: doctorCount,
                services: serviceCount,
                initialized: doctorCount > 0 && serviceCount > 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

module.exports = router;
