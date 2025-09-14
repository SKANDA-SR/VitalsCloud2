const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        address: { type: String },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relationship: { type: String }
        }
    },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    service: { type: String }, // Service name for quick access
    patientName: { type: String }, // Derived field for quick access
    patientEmail: { type: String }, // Derived field for quick access
    patientPhone: { type: String }, // Derived field for quick access
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
        default: 'pending'
    },
    reason: { type: String, required: true },
    symptoms: [String],
    notes: { type: String },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    followUp: {
        required: { type: Boolean, default: false },
        date: { type: Date },
        notes: { type: String }
    },
    payment: {
        amount: { type: Number, default: 0 },
        method: { type: String, enum: ['cash', 'card', 'insurance', 'online'] },
        status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
        transactionId: { type: String }
    },
    createdBy: { type: String, default: 'patient' }, // 'patient', 'staff', 'doctor'
    reminders: [{
        type: { type: String, enum: ['email', 'sms', 'call'] },
        sentAt: { type: Date },
        status: { type: String, enum: ['sent', 'delivered', 'failed'] }
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ 'patient.email': 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

// Virtual for full patient name
appointmentSchema.virtual('patient.fullName').get(function() {
    return `${this.patient.firstName} ${this.patient.lastName}`;
});

// Instance method to check if appointment is upcoming
appointmentSchema.methods.isUpcoming = function() {
    return new Date(this.appointmentDate) > new Date();
};

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate) {
    return this.find({
        appointmentDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

module.exports = mongoose.model('Appointment', appointmentSchema);
