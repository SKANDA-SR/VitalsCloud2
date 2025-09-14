const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connections
const connectMongoDB = require('./config/mongodb');
const { connectMySQL } = require('./config/mysql');

// Import routes
const appointmentRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const serviceRoutes = require('./routes/services');
const authRoutes = require('./routes/auth');
const doctorAppointmentsRoutes = require('./routes/doctorAppointments');
const setupRoutes = require('./routes/setup');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to databases
connectMongoDB();
// connectMySQL(); // Using MongoDB for all data storage

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/doctor', doctorAppointmentsRoutes);
app.use('/api/setup', setupRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Clinic Management System API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});
