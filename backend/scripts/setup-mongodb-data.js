const mongoose = require('mongoose');
require('dotenv').config();

const Doctor = require('../models/Doctor');
const Service = require('../models/Service');

const setupData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Service.deleteMany({});
        await Doctor.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Add two specific services
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
                ],
                imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop&crop=center'
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
                ],
                imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop&crop=center'
            }
        ];

        console.log('📋 Adding services...');
        const createdServices = await Service.insertMany(services);
        console.log(`✅ Added ${createdServices.length} services`);

        // Add two doctors with Indian names
        const doctors = [
            {
                firstName: 'Smitha',
                lastName: 'Sharma',
                email: 'dr.smitha.sharma@clinic.com',
                password: 'doctor123', // Will be hashed automatically
                specialization: 'General Medicine',
                qualification: 'MD, MBBS',
                experienceYears: 12,
                phone: '+91-98765-43210',
                consultationFee: 150.00,
                availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                availableHours: new Map([
                    ['monday', ['09:00', '17:00']],
                    ['tuesday', ['09:00', '17:00']],
                    ['wednesday', ['09:00', '17:00']],
                    ['thursday', ['09:00', '17:00']],
                    ['friday', ['09:00', '15:00']]
                ]),
                bio: 'Dr. Smitha Sharma is an experienced general practitioner with over 12 years of experience in primary healthcare. She specializes in preventive medicine, chronic disease management, and family medicine.',
                imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
            },
            {
                firstName: 'Varun',
                lastName: 'Kumar',
                email: 'dr.varun.kumar@clinic.com',
                password: 'doctor123', // Will be hashed automatically
                specialization: 'Pediatrics',
                qualification: 'MD, Pediatrics Board Certified',
                experienceYears: 8,
                phone: '+91-98765-43211',
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
                bio: 'Dr. Varun Kumar is a dedicated pediatrician who provides comprehensive medical care for children from birth through adolescence. He has special interests in childhood development and preventive pediatric care.',
                imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
            }
        ];

        console.log('👨‍⚕️ Adding doctors...');
        const createdDoctors = [];
        for (const doctorData of doctors) {
            const doctor = new Doctor(doctorData);
            await doctor.save(); // This triggers the password hashing middleware
            createdDoctors.push(doctor);
        }
        console.log(`✅ Added ${createdDoctors.length} doctors`);

        console.log('\n🎉 Data setup completed successfully!');
        console.log('\n🔐 Doctor Login Credentials:');
        console.log('1. Dr. Smitha Sharma (General Medicine)');
        console.log('   Email: dr.smitha.sharma@clinic.com');
        console.log('   Password: doctor123');
        console.log('');
        console.log('2. Dr. Varun Kumar (Pediatrics)');
        console.log('   Email: dr.varun.kumar@clinic.com');
        console.log('   Password: doctor123');
        console.log('');
        console.log('🌐 Access the application at: http://localhost:3000');
        console.log('🔗 API Health Check: http://localhost:5000/api/health');

        process.exit(0);
    } catch (error) {
        console.error('❌ Setup error:', error.message);
        process.exit(1);
    }
};

// Run the setup
setupData();
