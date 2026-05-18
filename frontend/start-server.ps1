# Garage Users - Frontend Startup Script (PowerShell)
# This script starts the frontend development server

Write-Host ""
Write-Host "========================================"
Write-Host "Garage Users - Frontend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Vite processes on port 3000
Write-Host "[1/3] Checking for port 3000..." -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName localhost -Port 3000 -ErrorAction SilentlyContinue
if ($portTest.TcpTestSucceeded) {
    Write-Host "⚠️  Port 3000 is already in use" -ForegroundColor Red
    Write-Host "Attempting to free the port..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✓ Port check complete" -ForegroundColor Green
} else {
    Write-Host "✓ Port 3000 is available" -ForegroundColor Green
}

# Navigate to frontend directory
Write-Host "[2/3] Navigating to frontend directory..." -ForegroundColor Yellow
$frontendDir = Join-Path -Path $PSScriptRoot -ChildPath "frontend"
if (Test-Path $frontendDir) {
    Push-Location $frontendDir
    Write-Host "✓ Changed to: $((Get-Location).Path)" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend directory not found: $frontendDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if needed
Write-Host "[3/3] Checking dependencies..." -ForegroundColor Yellow
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
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""
Write-Host "ℹ️  Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Make sure backend is running on port 5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

Pop-Location
Read-Host "Press Enter to exit"
