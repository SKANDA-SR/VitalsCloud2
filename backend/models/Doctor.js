const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [100, 'First name cannot exceed 100 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [100, 'Last name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
        maxlength: [100, 'Specialization cannot exceed 100 characters']
    },
    qualification: {
        type: String,
        trim: true,
        maxlength: [200, 'Qualification cannot exceed 200 characters']
    },
    experienceYears: {
        type: Number,
        default: 0,
        min: [0, 'Experience years cannot be negative'],
        max: [60, 'Experience years cannot exceed 60']
    },
    phone: {
        type: String,
        trim: true
    },
    consultationFee: {
        type: Number,
        default: 0,
        min: [0, 'Consultation fee cannot be negative']
    },
    availableDays: {
        type: [String],
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    availableHours: {
        type: Map,
        of: [String],
        default: new Map()
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    imageUrl: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    role: {
        type: String,
        default: 'doctor'
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
