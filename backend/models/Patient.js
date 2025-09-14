const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        nationality: { type: String },
        occupation: { type: String },
        maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] }
    },
    contactInfo: {
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
            country: { type: String }
        },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relationship: { type: String },
            address: { type: String }
        }
    },
    medicalInfo: {
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        height: { type: Number }, // in cm
        weight: { type: Number }, // in kg
        allergies: [String],
        chronicConditions: [String],
        currentMedications: [{
            name: { type: String },
            dosage: { type: String },
            frequency: { type: String },
            startDate: { type: Date },
            prescribedBy: { type: String }
        }],
        pastSurgeries: [{
            procedure: { type: String },
            date: { type: Date },
            hospital: { type: String },
            surgeon: { type: String },
            notes: { type: String }
        }],
        familyHistory: [{
            relation: { type: String },
            condition: { type: String },
            notes: { type: String }
        }],
        immunizations: [{
            vaccine: { type: String },
            date: { type: Date },
            nextDue: { type: Date }
        }]
    },
    insuranceInfo: {
        provider: { type: String },
        policyNumber: { type: String },
        groupNumber: { type: String },
        validUntil: { type: Date }
    },
    visitHistory: [{
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
        date: { type: Date },
        doctorId: { type: Number },
        diagnosis: { type: String },
        treatment: { type: String },
        prescriptions: [String],
        followUpRequired: { type: Boolean, default: false },
        followUpDate: { type: Date },
        notes: { type: String }
    }],
    preferences: {
        preferredLanguage: { type: String, default: 'English' },
        communicationMethod: { type: String, enum: ['email', 'sms', 'phone'], default: 'email' },
        appointmentReminders: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deceased'],
        default: 'active'
    },
    registrationDate: { type: Date, default: Date.now },
    lastVisit: { type: Date },
    totalVisits: { type: Number, default: 0 },
    notes: { type: String } // General notes about the patient
}, {
    timestamps: true
});

// Indexes
patientSchema.index({ 'personalInfo.email': 1 });
patientSchema.index({ 'personalInfo.phone': 1 });
patientSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });
patientSchema.index({ registrationDate: -1 });
patientSchema.index({ status: 1 });

// Virtual for full name
patientSchema.virtual('personalInfo.fullName').get(function() {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for age calculation
patientSchema.virtual('personalInfo.age').get(function() {
    if (!this.personalInfo.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.personalInfo.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual for BMI calculation
patientSchema.virtual('medicalInfo.bmi').get(function() {
    if (!this.medicalInfo.height || !this.medicalInfo.weight) return null;
    const heightInMeters = this.medicalInfo.height / 100;
    return (this.medicalInfo.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Instance method to add visit
patientSchema.methods.addVisit = function(visitData) {
    this.visitHistory.push(visitData);
    this.lastVisit = visitData.date;
    this.totalVisits += 1;
    return this.save();
};

// Static method to find patients by age range
patientSchema.statics.findByAgeRange = function(minAge, maxAge) {
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    
    return this.find({
        'personalInfo.dateOfBirth': {
            $gte: minBirthDate,
            $lte: maxBirthDate
        }
    });
};

module.exports = mongoose.model('Patient', patientSchema);
