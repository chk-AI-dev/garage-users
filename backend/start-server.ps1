# Garage Users - Backend Startup Script (PowerShell)
# This script kills existing processes and starts the backend server

Write-Host ""
Write-Host "========================================"
Write-Host "Garage Users - Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes
Write-Host "[1/4] Killing existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Process cleanup complete" -ForegroundColor Green

# Check if MongoDB is running
Write-Host "[2/4] Checking MongoDB connection..." -ForegroundColor Yellow
$mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -ErrorAction SilentlyContinue
if ($mongoTest.TcpTestSucceeded) {
    Write-Host "✓ MongoDB is running on port 27017" -ForegroundColor Green
} else {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "⚠️  WARNING: MongoDB is not running!" -ForegroundColor Red
    Write-Host "" -ForegroundColor Yellow
    Write-Host "MongoDB must be running for the backend to work properly." -ForegroundColor Yellow
    Write-Host "Start MongoDB with: mongod" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Yellow
    Read-Host "Press Enter to continue anyway"
}

# Navigate to backend directory
Write-Host "[3/4] Navigating to backend directory..." -ForegroundColor Yellow
$backendDir = Join-Path -Path $PSScriptRoot -ChildPath "backend"
if (Test-Path $backendDir) {
    Push-Location $backendDir
    Write-Host "✓ Changed to: $((Get-Location).Path)" -ForegroundColor Green
} else {
    Write-Host "✗ Backend directory not found: $backendDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if needed
Write-Host "[4/4] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

# Start the server
Write-Host ""
Write-Host "========================================"
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""
Write-Host "ℹ️  Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

Pop-Location
Read-Host "Press Enter to exit"
