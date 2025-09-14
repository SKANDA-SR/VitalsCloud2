# 🎯 Render Configuration Guide - VitalsCloud2

## ❌ Common Mistake

**DO NOT** use root directory (blank or ".") for backend deployment!

```
❌ WRONG:
Root Directory: (leave blank or put ".")
```

This will fail because Render won't find your `package.json` and `server.js` files.

## ✅ Correct Configuration

Your VitalsCloud2 project has this structure:

```
VitalsCloud2/
├── backend/           ← Backend files here
│   ├── package.json   ← Render needs this
│   ├── server.js      ← Render needs this
│   ├── models/
│   ├── routes/
│   └── config/
├── frontend/          ← Frontend files here
│   ├── package.json   ← Render needs this
│   ├── src/
│   └── public/
├── README.md
└── render.yaml
```

## 🔧 Backend Service Configuration

When creating your **backend** service on Render:

```
Service Name: vitalscloud2-api
Environment: Node
Root Directory: backend          ← IMPORTANT!
Build Command: npm install
Start Command: npm start
```

## 🎨 Frontend Service Configuration

When creating your **frontend** service on Render:

```
Service Name: vitalscloud2
Environment: Static Site
Root Directory: frontend         ← IMPORTANT!
Build Command: npm install && npm run build
Publish Directory: build
```

## 🔍 Why Root Directory Matters

- **Root Directory** tells Render where to find your `package.json` file
- If you use root directory (blank), Render looks for `package.json` in the main folder
- But your `package.json` files are inside `backend/` and `frontend/` folders
- So you MUST specify the subdirectory!

## 📝 Step-by-Step in Render Dashboard

### For Backend API:
1. New Web Service → Connect GitHub → Select VitalsCloud2
2. **Name**: `vitalscloud2-api`
3. **Environment**: `Node`
4. **Root Directory**: Type `backend` (not blank!)
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add environment variables
8. Deploy

### For Frontend:
1. New Static Site → Connect GitHub → Select VitalsCloud2  
2. **Name**: `vitalscloud2`
3. **Environment**: `Static Site`
4. **Root Directory**: Type `frontend` (not blank!)
5. **Build Command**: `npm install && npm run build`
6. **Publish Directory**: `build`
7. Add environment variables
8. Deploy

## ⚠️ What Happens If You Use Root Directory?

If you leave Root Directory blank or use ".", Render will:

1. Look for `package.json` in the main VitalsCloud2 folder
2. Not find it (because it's in backend/ subfolder)
3. Fail with error: "No package.json found"
4. Your deployment will fail

## ✅ Success Indicators

**Backend deployment success:**
- Build logs show: "Found package.json in backend/"
- Server starts: "Server is running on port 10000"
- Health check works: `/api/health` returns 200

**Frontend deployment success:**
- Build logs show: "Found package.json in frontend/"  
- Build completes: "npm run build succeeded"
- Static files deployed successfully

## 🚨 Quick Fix

If you already deployed with wrong config:
1. Go to service Settings in Render dashboard
2. Change "Root Directory" from blank to `backend` (or `frontend`)
3. Save and redeploy

Remember: **backend** folder for API, **frontend** folder for UI! 🎯
