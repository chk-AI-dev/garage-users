# Backend Startup Troubleshooting Guide

## Issue: EADDRINUSE - Port 5000 Already in Use

### ✅ Solution Applied

Fixed CORS configuration fallback:
- **Before:** `origin: process.env.FRONTEND_URL || 'http://localhost:5000'`
- **After:** `origin: process.env.FRONTEND_URL || 'http://localhost:3000'`

### 🔧 To Resolve Port Issues

#### Option 1: Kill All Node Processes (Windows)
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

#### Option 2: Use Different Port
Edit `backend/.env`:
```
PORT=5001  # Change from 5000 to 5001
```

#### Option 3: Find Process Using Port 5000
```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object OwningProcess, State, LocalAddress
```

---

## Issue: MongoDB Connection Error (ECONNREFUSED)

### ✅ Prerequisites Check

MongoDB must be running before starting the backend server.

### 🔧 Solution: Start MongoDB

#### Option 1: Local MongoDB (Windows)
```powershell
# If installed with MongoDB Community Edition
mongod

# Or if using MongoDB as a service
net start MongoDB
```

#### Option 2: Docker MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option 3: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a database cluster
3. Get connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garage-users
```

#### Option 4: Skip MongoDB for Testing
If developing without database, comment out MongoDB in server.js temporarily:
```javascript
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garage-users')
//   .then(() => console.log('✓ MongoDB connected'))
//   .catch(err => console.error('✗ MongoDB connection error:', err));

console.log('ℹ MongoDB connection skipped for testing');
```

---

## Complete Startup Sequence

### Step 1: Kill Existing Processes
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Ensure MongoDB is Running
```powershell
# Verify MongoDB is listening on port 27017
Test-NetConnection -ComputerName localhost -Port 27017
```

### Step 3: Verify Backend Environment
```powershell
cd c:\xampp\htdocs\projects\garage-users\backend
cat .env  # Verify configuration
```

### Step 4: Start Backend Server
```powershell
npm run dev
# Or for production:
npm start
```

### Step 5: Verify Backend Started
Look for output:
```
✓ Server running on http://localhost:5000
✓ MongoDB connected
```

---

## Environment Configuration Checklist


### Required in `.env`:

- ✅ PORT=5000
- ✅ NODE_ENV=development
- ✅ MONGODB_URI=mongodb://localhost:27017/garage-users
- ✅ JWT_SECRET=your_secret_key
- ✅ JWT_EXPIRE=7d
- ✅ FRONTEND_URL=http://localhost:3000


### Fixed Issues:

- ✅ CORS fallback changed to port 3000 (frontend)
- ✅ All environment variables configured

---

## Port Reference
| Service | Port | Status |
|---------|------|--------|
| Backend (Express) | 5000 | Must be free |
| Frontend (Vite) | 3000 | Must be free |
| MongoDB | 27017 | Must be running |

---

## Testing Backend Connection

### Test API Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running"
}
```

---

## Quick Start Commands

### Fresh Development Start
```powershell
# Kill any existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Verify MongoDB is running
# mongod  (run in separate terminal)

# Start backend
cd backend
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| EADDRINUSE | Port 5000 in use | Kill process or change port |
| ECONNREFUSED | MongoDB not running | Start MongoDB service |
| CORS error | Wrong frontend URL | Check FRONTEND_URL in .env |
| 401 Unauthorized | Missing JWT token | Include token in Authorization header |
| 404 Not Found | Endpoint doesn't exist | Verify API route in routes/ folder |

---

## Testing the Backend

### API Endpoints to Test

#### 1. Health Check
```
GET http://localhost:5000/api/health
```

#### 2. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### 3. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## Debugging Tips

### Enable Detailed Logs
```javascript
// In server.js, add before routes:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check MongoDB Connection
```powershell
mongo  # Connect to MongoDB CLI
db.version()  # Check if connected
```

### Monitor in Real-time
```bash
# Use nodemon (already configured)
npm run dev  # Automatically restarts on file changes
```

---

## If All Else Fails

### Nuclear Option: Fresh Start
```powershell
# Stop all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remove node_modules and reinstall
cd backend
rm -r node_modules package-lock.json
npm install

# Clear any stuck ports (restart machine if needed)
# Then try again
npm run dev
```

---

## Ready to Start?

Run these commands in order:

```powershell
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd c:\xampp\htdocs\projects\garage-users\backend
npm run dev

# Terminal 3: Start Frontend  
cd c:\xampp\htdocs\projects\garage-users\frontend
npm run dev

# Open browser
Start-Process http://localhost:3000
```

---

**All systems should now work correctly!** 🚀
