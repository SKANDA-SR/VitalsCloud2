const { connectMySQL, getPool } = require('../config/mysql');
const bcrypt = require('bcryptjs');

const setupData = async () => {
    try {
        await connectMySQL();
        const pool = getPool();

        // Clear existing data (optional - comment out if you want to keep existing data)
        await pool.execute('DELETE FROM services');
        await pool.execute('DELETE FROM doctors');
        await pool.execute('DELETE FROM users WHERE role = "doctor"');

        // Add three specific services
        const services = [
            {
                name: 'General Medicine',
                description: 'Comprehensive primary healthcare services for adults, including routine check-ups, preventive care, and treatment of common medical conditions.',
                duration_minutes: 30,
                price: 150.00,
                category: 'Primary Care'
            },
            {
                name: 'Pediatrics',
                description: 'Specialized medical care for infants, children, and adolescents, including wellness visits, vaccinations, and treatment of childhood illnesses.',
                duration_minutes: 45,
                price: 180.00,
                category: 'Specialty Care'
            },
            {
                name: 'Emergency Care',
                description: '24/7 urgent medical care for serious injuries, acute illnesses, and life-threatening conditions requiring immediate attention.',
                duration_minutes: 60,
                price: 300.00,
                category: 'Emergency Services'
            }
        ];

        console.log('Adding services...');
        for (const service of services) {
            await pool.execute(
                'INSERT INTO services (name, description, duration_minutes, price, category) VALUES (?, ?, ?, ?, ?)',
                [service.name, service.description, service.duration_minutes, service.price, service.category]
            );
        }

        // Add two doctors
        const doctors = [
            {
                first_name: 'Sarah',
                last_name: 'Johnson',
                specialization: 'General Medicine',
                qualification: 'MD, MBBS',
                experience_years: 12,
                phone: '+1-555-0101',
                email: 'dr.sarah.johnson@clinic.com',
                consultation_fee: 150.00,
                available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                available_hours: {
                    'monday': ['09:00', '17:00'],
                    'tuesday': ['09:00', '17:00'],
                    'wednesday': ['09:00', '17:00'],
                    'thursday': ['09:00', '17:00'],
                    'friday': ['09:00', '15:00']
                },
                bio: 'Dr. Sarah Johnson is a experienced general practitioner with over 12 years of experience in primary healthcare. She specializes in preventive medicine, chronic disease management, and family medicine.',
                image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
            },
            {
                first_name: 'Michael',
                last_name: 'Chen',
                specialization: 'Pediatrics',
                qualification: 'MD, Pediatrics Board Certified',
                experience_years: 8,
                phone: '+1-555-0102',
                email: 'dr.michael.chen@clinic.com',
                consultation_fee: 180.00,
                available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                available_hours: {
                    'monday': ['08:00', '16:00'],
                    'tuesday': ['08:00', '16:00'],
                    'wednesday': ['08:00', '16:00'],
                    'thursday': ['08:00', '16:00'],
                    'friday': ['08:00', '16:00'],
                    'saturday': ['09:00', '13:00']
                },
                bio: 'Dr. Michael Chen is a dedicated pediatrician who provides comprehensive medical care for children from birth through adolescence. He has special interests in childhood development and preventive pediatric care.',
                image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
            }
        ];

        console.log('Adding doctors...');
        for (const doctor of doctors) {
            const [result] = await pool.execute(`
                INSERT INTO doctors (
                    first_name, last_name, specialization, qualification, experience_years,
                    phone, email, consultation_fee, available_days, available_hours, bio, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                doctor.first_name,
                doctor.last_name,
                doctor.specialization,
                doctor.qualification,
                doctor.experience_years,
                doctor.phone,
                doctor.email,
                doctor.consultation_fee,
                JSON.stringify(doctor.available_days),
                JSON.stringify(doctor.available_hours),
                doctor.bio,
                doctor.image_url
            ]);

            // Create doctor login credentials in users table
            const hashedPassword = await bcrypt.hash('doctor123', 10);
            await pool.execute(`
                INSERT INTO users (email, password, role, first_name, last_name, phone)
                VALUES (?, ?, 'doctor', ?, ?, ?)
            `, [
                doctor.email,
                hashedPassword,
                doctor.first_name,
                doctor.last_name,
                doctor.phone
            ]);

            console.log(`Added doctor: Dr. ${doctor.first_name} ${doctor.last_name} (${doctor.email})`);
        }

        console.log('✅ Data setup completed successfully!');
        console.log('\n🔐 Doctor Login Credentials:');
        console.log('1. Dr. Sarah Johnson (General Medicine)');
        console.log('   Email: dr.sarah.johnson@clinic.com');
        console.log('   Password: doctor123');
        console.log('');
        console.log('2. Dr. Michael Chen (Pediatrics)');
        console.log('   Email: dr.michael.chen@clinic.com');
        console.log('   Password: doctor123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Setup error:', error.message);
        process.exit(1);
    }
};

setupData();
