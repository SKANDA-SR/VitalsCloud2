const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Doctor = require('../models/Doctor');

const fixPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_db');
        console.log('✅ Connected to MongoDB');

        const doctors = await Doctor.find({}).select('+password');
        console.log(`Found ${doctors.length} doctors`);

        for (const doctor of doctors) {
            if (!doctor.password.startsWith('$2a')) {
                console.log(`Fixing password for ${doctor.email}`);
                const hashedPassword = await bcrypt.hash('doctor123', 10);
                await Doctor.updateOne(
                    { _id: doctor._id },
                    { password: hashedPassword }
                );
                console.log(`Updated password for ${doctor.email}`);
            } else {
                console.log(`Password for ${doctor.email} is already hashed`);
            }
        }

        console.log('✅ Password fix completed!');
        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

fixPasswords();
