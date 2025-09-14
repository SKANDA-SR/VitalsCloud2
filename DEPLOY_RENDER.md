# VitalsCloud2 Render Deployment Guide

This guide will help you deploy your VitalsCloud2 healthcare management system to Render.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub (✅ Already done)
2. **Render Account**: Sign up at https://render.com
3. **MongoDB Atlas Account**: Sign up at https://cloud.mongodb.com (for database)

## Step 1: Set Up MongoDB Atlas (Free Tier)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new project called "VitalsCloud2"
3. Build a database:
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster: `vitalscloud2-cluster`
4. Create a database user:
   - Username: `vitalscloud2_user`
   - Password: Generate a secure password and save it
5. Set up Network Access:
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
6. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 2: Deploy Backend API to Render

1. **Login to Render**: Go to https://render.com and sign up/login
2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your `VitalsCloud2` repository
   - Configure the service:

### Backend Service Configuration:
```
Name: vitalscloud2-api
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### Environment Variables:
Add these in Render dashboard under "Environment":

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://vitalscloud2_user:YOUR_PASSWORD@vitalscloud2-cluster.mongodb.net/clinic_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=https://vitalscloud2.onrender.com
```

**Important**: Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password!

3. **Deploy**: Click "Create Web Service"

## Step 3: Deploy Frontend to Render

1. **Create Another Web Service**:
   - Click "New +" → "Web Service"
   - Select your `VitalsCloud2` repository again
   - Configure the service:

### Frontend Service Configuration:
```
Name: vitalscloud2
Root Directory: frontend
Environment: Static Site
Build Command: npm install && npm run build
Publish Directory: build
```

### Environment Variables for Frontend:
```
REACT_APP_API_URL=https://vitalscloud2-api.onrender.com/api
GENERATE_SOURCEMAP=false
```

2. **Deploy**: Click "Create Web Service"

## Step 4: Initialize Database with Sample Data

After both services are deployed:

1. Go to your backend service dashboard on Render
2. Open the "Shell" tab (or use the Console)
3. Run the database setup command:
   ```bash
   npm run setup-db
   ```

This will populate your MongoDB Atlas database with:
- 3 medical services (General Medicine, Pediatrics, Emergency Care)
- 2 doctor accounts with login credentials

## Step 5: Access Your Deployed Application

- **Frontend (Patient Portal)**: https://vitalscloud2.onrender.com
- **Backend API**: https://vitalscloud2-api.onrender.com
- **API Health Check**: https://vitalscloud2-api.onrender.com/api/health
- **Doctor Login**: https://vitalscloud2.onrender.com/doctor/login

## Demo Credentials (After database setup)

- **Dr. Sarah Johnson (General Medicine)**
  - Email: `dr.sarah.johnson@clinic.com`
  - Password: `doctor123`

- **Dr. Michael Chen (Pediatrics)**
  - Email: `dr.michael.chen@clinic.com`
  - Password: `doctor123`

## Troubleshooting

### Common Issues:

1. **Backend API not working**: Check MongoDB connection string and ensure all environment variables are set correctly.

2. **Frontend can't connect to backend**: Verify the `REACT_APP_API_URL` environment variable in frontend service.

3. **Database connection failed**: 
   - Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
   - Verify username/password in connection string
   - Ensure database user has read/write permissions

4. **Services starting slowly**: Free tier services on Render may have cold start delays. First request might take 30-60 seconds.

### Render Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- 750 hours per month (sufficient for demo purposes)
- Cold starts can take 30-60 seconds

## Custom Domain (Optional)

To use a custom domain:
1. Purchase a domain from any registrar
2. In Render dashboard, go to your frontend service
3. Add custom domain in "Settings" → "Custom Domains"
4. Update DNS records as instructed

## Environment-Specific URLs

After deployment, update these in your services if the auto-generated URLs are different:

**Frontend Environment Variables:**
- `REACT_APP_API_URL`: Should point to your backend service URL + `/api`

**Backend Environment Variables:**
- `FRONTEND_URL`: Should point to your frontend service URL

## Monitoring

Monitor your services in Render dashboard:
- View logs for debugging
- Check metrics and performance
- Set up alerts for downtime

---

## Quick Deploy Summary

1. **Create MongoDB Atlas cluster** (5 minutes)
2. **Deploy backend to Render** with MongoDB connection string (5 minutes)
3. **Deploy frontend to Render** with backend API URL (5 minutes)
4. **Initialize database** with sample data (2 minutes)
5. **Test your live application** (2 minutes)

**Total time**: ~20 minutes

Your VitalsCloud2 healthcare management system will be live and accessible worldwide! 🚀
