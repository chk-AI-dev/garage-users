# 🔧 Backend Startup Error - Complete Fix Guide


## ❌ The Error You Got


```
Error: listen EADDRINUSE: address already in use :::5000
```

This means **port 5000 is already in use** by another process.

---


## ✅ Issues Fixed


### 1. CORS Configuration Bug
**Problem:** Backend was using wrong fallback URL for frontend
- **Before:** `origin: process.env.FRONTEND_URL || 'http://localhost:5000'`
- **After:** `origin: process.env.FRONTEND_URL || 'http://localhost:3000'`


**Status:** ✅ FIXED


### 2. Port 5000 Already in Use
**Problem:** Node process or other service is using port 5000


**Solutions Below** ⬇️

---

## 🚀 Quick Fix (Choose One)

### Option A: Clean Restart (Recommended)
Run this PowerShell command:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force; npm run dev
```

### Option B: Use the Startup Script
```powershell
cd c:\xampp\htdocs\projects\garage-users\backend
.\start-server.ps1
```

### Option C: Use Different Port
Edit `backend/.env`:
```
PORT=5001
```

Then start:
```bash
npm run dev
```

### Option D: Find and Kill the Process
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object OwningProcess, State, LocalAddress

# Kill it
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start server
npm run dev
```

---

## 🎯 Complete Startup Procedure

### Prerequisites
1. **MongoDB Running**
   ```powershell
   mongod  # In a separate terminal
   ```

2. **Ports Available**
   - 5000 (Backend)
   - 3000 (Frontend)
   - 27017 (MongoDB)

### Step-by-Step

#### Terminal 1: Start Backend
```powershell
cd c:\xampp\htdocs\projects\garage-users\backend
npm run dev
```

**Expected Output:**
```
✓ Server running on http://localhost:5000
✓ MongoDB connected
```

#### Terminal 2: Start Frontend
```powershell
cd c:\xampp\htdocs\projects\garage-users\frontend
npm run dev
```

**Expected Output:**
```
  Local:   http://localhost:3000/
```

#### Terminal 3: MongoDB (if needed)
```powershell
mongod
```

---

## 📊 Automated Startup Scripts

We've created helper scripts for you:

### PowerShell Scripts
- `backend/start-server.ps1` - Start backend only
- `frontend/start-server.ps1` - Start frontend only
- `START_ALL.ps1` - Start both + MongoDB check

### Usage
```powershell
# Start backend
c:\xampp\htdocs\projects\garage-users\backend\start-server.ps1

# Start frontend
c:\xampp\htdocs\projects\garage-users\frontend\start-server.ps1

# Start everything
c:\xampp\htdocs\projects\garage-users\START_ALL.ps1
```

---

## 🧪 Test the Backend

### Health Check
```powershell
Invoke-WebRequest http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running"
}
```

### Register User
```powershell
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test@garage.com"
    password = "test123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

---

## 🚨 If It Still Doesn't Work

### Nuclear Reset
```powershell
# Kill everything
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear yarn/npm cache
npm cache clean --force

# Reinstall dependencies
cd backend
rm -r node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Check Logs
```powershell
# See what's using port 5000
netstat -ano | findstr :5000

# See all Node processes
Get-Process node

# Check MongoDB status
Test-NetConnection -ComputerName localhost -Port 27017
```

---

## 📋 Troubleshooting Checklist

- [ ] Port 5000 is free (or changed to different port)
- [ ] MongoDB is running on port 27017
- [ ] `.env` file exists in backend folder
- [ ] `FRONTEND_URL=http://localhost:3000` in `.env`
- [ ] `MONGODB_URI=mongodb://localhost:27017/garage-users` in `.env`
- [ ] No errors in PowerShell terminal
- [ ] Health check returns 200 status

---

## 🔗 Port Configuration

### Current Setup
| Service | Port | Environment Variable |
|---------|------|---------------------|
| Backend | 5000 | PORT in .env |
| Frontend | 3000 | Vite default |
| MongoDB | 27017 | MONGODB_URI in .env |

### To Change Backend Port
Edit `backend/.env`:
```
PORT=5001  # or any available port
```

Then update frontend API URL in `frontend/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

---

## 💡 Pro Tips

1. **Use Separate Terminals**
   - Terminal 1: Backend
   - Terminal 2: Frontend  
   - Terminal 3: MongoDB
   - Terminal 4: Git/utilities

2. **Avoid Restarting**
   - nodemon watches files and auto-restarts
   - No need to manually restart backend
   - Just save your file

3. **Check Logs First**
   - Most errors are in the PowerShell output
   - Read the error message carefully
   - Look for "error:", "failed", "refused" keywords

4. **Keep MongoDB Running**
   - MongoDB should stay open in background
   - Don't close the MongoDB terminal
   - Use Windows Task Manager if needed

---

## ✅ Verification Checklist

After starting, verify:
```powershell
# 1. Backend is running
curl http://localhost:5000/api/health

# 2. Frontend is running
curl http://localhost:3000

# 3. MongoDB is connected
# Check backend logs for "✓ MongoDB connected"

# 4. No errors in Chrome DevTools
# Open http://localhost:3000 in browser
# Press F12 and check Console tab
```

---

## 📚 Additional Resources

- **Backend README:** `backend/README.md`
- **Frontend README:** `frontend/README.md`
- **Complete Guide:** `STARTUP_GUIDE.md`
- **Test Report:** `TEST_REPORT.md`

---

## 🆘 Still Having Issues?

Try these in order:
1. Run: `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force`
2. Wait 5 seconds
3. Run: `npm run dev` again

If that doesn't work:
1. Restart PowerShell (close and reopen)
2. Check if MongoDB is running
3. Check if ports are actually free: `netstat -ano | findstr :5000`

---

**Everything should work now!** 🎉

Next: Open http://localhost:3000 in your browser and log in!
