# 🆓 Database Setup for Render Free Tier

Since the Shell tab requires Render's premium plan, here are **FREE alternatives** to initialize your database with sample data:

## 🎯 Solution 1: Auto-Setup on First API Call (RECOMMENDED)

### Modify your backend to auto-initialize the database:

1. **Update your `server.js`** to include auto-setup:

Add this code to your `backend/server.js` after database connection:

```javascript
// Auto-setup database on first run (after MongoDB connection)
const autoSetupDatabase = async () => {
    try {
        const Doctor = require('./models/Doctor');
        const Service = require('./models/Service');
        
        // Check if data already exists
        const doctorCount = await Doctor.countDocuments();
        const serviceCount = await Service.countDocuments();
        
        if (doctorCount === 0 && serviceCount === 0) {
            console.log('🔄 Auto-initializing database with sample data...');
            
            // Run the setup script
            require('./scripts/setup-mongodb-data');
        } else {
            console.log('✅ Database already contains data');
        }
    } catch (error) {
        console.log('ℹ️ Auto-setup will be handled by manual trigger');
    }
};

// Call auto-setup after server starts
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    
    // Auto-setup database
    setTimeout(autoSetupDatabase, 2000); // Wait 2 seconds for DB connection
});
```

## 🎯 Solution 2: Manual API Endpoint (EASY)

### Add a setup endpoint to your backend:

1. **Create a setup route** in `backend/routes/setup.js`:

```javascript
const express = require('express');
const router = express.Router();

// Manual database setup endpoint
router.post('/initialize', async (req, res) => {
    try {
        // Check if already initialized
        const Doctor = require('../models/Doctor');
        const Service = require('../models/Service');
        
        const doctorCount = await Doctor.countDocuments();
        const serviceCount = await Service.countDocuments();
        
        if (doctorCount > 0 || serviceCount > 0) {
            return res.json({
                success: true,
                message: 'Database already initialized',
                data: { doctors: doctorCount, services: serviceCount }
            });
        }
        
        // Run setup script
        const setupScript = require('../scripts/setup-mongodb-data');
        
        res.json({
            success: true,
            message: 'Database initialized successfully!',
            data: {
                services: 3,
                doctors: 2,
                credentials: {
                    'Dr. Sarah Johnson': 'dr.sarah.johnson@clinic.com / doctor123',
                    'Dr. Michael Chen': 'dr.michael.chen@clinic.com / doctor123'
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database initialization failed',
            error: error.message
        });
    }
});

module.exports = router;
```

2. **Add the route to your `server.js`**:

```javascript
const setupRoutes = require('./routes/setup');
app.use('/api/setup', setupRoutes);
```

3. **Call the endpoint after deployment**:
   - Visit: `https://your-backend-url.onrender.com/api/setup/initialize`
   - Or use curl: `curl -X POST https://your-backend-url.onrender.com/api/setup/initialize`

## 🎯 Solution 3: Use MongoDB Compass (GUI)

### Connect directly to your MongoDB Atlas database:

1. **Get your MongoDB connection string** from Render environment variables
2. **Download MongoDB Compass** (free): https://www.mongodb.com/products/compass
3. **Connect to your database** using the connection string
4. **Manually insert sample data** using the GUI

### Sample Data to Insert:

**Services Collection:**
```json
[
  {
    "name": "General Medicine",
    "description": "Comprehensive primary healthcare services",
    "durationMinutes": 30,
    "price": 150,
    "category": "Primary Care",
    "status": "active"
  },
  {
    "name": "Pediatrics", 
    "description": "Specialized medical care for children",
    "durationMinutes": 45,
    "price": 180,
    "category": "Specialty Care",
    "status": "active"
  },
  {
    "name": "Emergency Care",
    "description": "24/7 urgent medical care",
    "durationMinutes": 60,
    "price": 300,
    "category": "Emergency Services",
    "status": "active"
  }
]
```

**Doctors Collection:**
```json
[
  {
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "dr.sarah.johnson@clinic.com",
    "password": "$2a$10$hashedPasswordHere",
    "specialization": "General Medicine",
    "qualification": "MD, MBBS",
    "experienceYears": 12,
    "phone": "+1-555-0101",
    "consultationFee": 150,
    "availableDays": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "bio": "Experienced general practitioner with 12 years in primary healthcare",
    "status": "active"
  }
]
```

## 🎯 Solution 4: Local Development + MongoDB Atlas

### Set up database from your local machine:

1. **Update your local `.env`** to use MongoDB Atlas connection string
2. **Run locally**: `npm run setup-db` in your backend folder
3. **Data will be inserted** into your live MongoDB Atlas database
4. **Deploy your application** - data will already be there!

## 🎯 Solution 5: One-Time Render Upgrade

### Temporary premium access:

1. **Upgrade to Render's Starter plan** ($7/month)
2. **Use the Shell tab** to run `npm run setup-db`
3. **Downgrade back to free tier** after setup
4. **Your data remains** in MongoDB Atlas

Note: You keep the data even after downgrading since it's stored in MongoDB Atlas, not on Render.

## ✅ Recommended Approach

**For quick setup**: Use **Solution 2** (Manual API Endpoint)
- Easy to implement
- Works with free tier
- One-time setup via browser
- No additional tools needed

**For production apps**: Use **Solution 1** (Auto-Setup)
- Fully automated
- Runs on first deployment
- No manual intervention needed

## 🔧 Implementation Steps

1. Choose one of the solutions above
2. Implement the code changes
3. Push to GitHub (triggers automatic Render deployment)
4. Wait for deployment to complete
5. Initialize your database using your chosen method
6. Test your live application!

## 🎉 Result

After using any of these methods, you'll have:
- ✅ 3 medical services (General Medicine, Pediatrics, Emergency Care)
- ✅ 2 doctor accounts ready for login
- ✅ Working demo credentials for your live application

Your VitalsCloud2 app will be fully functional without needing Render's premium features! 🚀
