# VitalsCloud2 - Healthcare Clinic Management System

A comprehensive clinic management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring appointment booking, patient management, doctor scheduling, and a complete doctor portal.

## 🏥 Features

### Patient Portal
- **Responsive Design**: Built with Bootstrap 5 and custom CSS
- **Modern UI/UX**: Clean, professional medical theme
- **Appointment Booking**: Interactive booking system with doctor selection
- **Service Catalog**: Browse medical services with detailed descriptions
- **Real-time Updates**: Toast notifications and loading states

### Doctor Portal
- **Secure Authentication**: JWT-based login system
- **Dashboard Overview**: Appointment statistics and quick insights
- **Appointment Management**: View, confirm, complete, or cancel appointments
- **Patient Information**: Access to comprehensive patient details
- **Schedule Management**: Real-time schedule viewing and updates

### Backend API
- **RESTful API**: Well-structured API endpoints
- **Database Integration**: MongoDB for all data storage
- **Data Validation**: Comprehensive input validation and error handling
- **Authentication**: JWT-based authentication for doctors
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Technology Stack

### Frontend
- React.js 18
- React Router DOM
- Bootstrap 5 & React Bootstrap
- Axios for API calls
- React Hook Form
- React DatePicker
- React Select
- React Toastify
- Moment.js

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- Express Validator
- CORS
- Dotenv
- Moment.js
- Multer (file uploads)
- JSON Web Tokens (JWT)
- BCryptjs for password hashing

### Database
- MongoDB (All application data)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- Git
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/VitalsCloud2.git
cd VitalsCloud2
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
```bash
# Copy environment template (if available)
# Create .env file with the following:
```

#### Sample .env Configuration
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/clinic_db

# JWT Secret
JWT_SECRET=clinic_mern_2024_super_secret_jwt_key_for_development_only
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### Initialize Database with Sample Data
```bash
node scripts/setup-mongodb-data.js
```

#### Start Backend Server
```bash
npm start
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

## 🔐 Demo Credentials

### Doctor Accounts
1. **Dr. Sarah Johnson** (General Medicine)
   - Email: `dr.sarah.johnson@clinic.com`
   - Password: `doctor123`

2. **Dr. Michael Chen** (Pediatrics)
   - Email: `dr.michael.chen@clinic.com`
   - Password: `doctor123`

## 🎯 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/yourusername/VitalsCloud2.git
cd VitalsCloud2

# Backend setup
cd backend
npm install
node scripts/setup-mongodb-data.js
npm start

# Frontend setup (in new terminal)
cd frontend
npm install
npm start

# Access
# Patient Portal: http://localhost:3000
# Doctor Portal: http://localhost:3000/doctor/login
# API: http://localhost:5000/api/health
```

## 🎨 Available Services

1. **General Medicine** - $150.00 (30 min)
2. **Pediatrics** - $180.00 (45 min)  
3. **Emergency Care** - $300.00 (60 min)

## 📞 Support

For technical support or questions, create an issue in this repository.

---

**Built with ❤️ for better healthcare management**
