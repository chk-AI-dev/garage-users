@echo off
REM Garage Users - Backend Startup Script
REM This script kills existing processes and starts the backend server

cls
echo.
echo ========================================
echo Garage Users - Backend Startup
echo ========================================
echo.

REM Kill any existing Node processes
echo [1/4] Killing existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

REM Check if MongoDB is running
echo [2/4] Checking MongoDB connection...
netstat -ano | findstr :27017 >nul
if errorlevel 1 (
    echo.
    echo ⚠️  WARNING: MongoDB is not running!
    echo.
    echo MongoDB must be running for the backend to work properly.
    echo Start MongoDB with: mongod
    echo.
    pause
) else (
    echo ✓ MongoDB is running on port 27017
)

REM Navigate to backend directory
echo [3/4] Navigating to backend directory...
cd /d "%~dp0backend"
if errorlevel 1 (
    echo ✗ Failed to navigate to backend directory
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo [4/4] Installing dependencies...
    call npm install
) else (
    echo [4/4] Dependencies already installed
)

REM Start the server
echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo.
echo ℹ️  Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
