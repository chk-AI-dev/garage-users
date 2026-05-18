# Garage Users - Master Startup Script (PowerShell)
# Starts both backend and frontend servers in separate windows

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Garage Users - Master Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define paths
$projectRoot = $PSScriptRoot
$backendDir = Join-Path -Path $projectRoot -ChildPath "backend"
$frontendDir = Join-Path -Path $projectRoot -ChildPath "frontend"

# Kill any existing Node processes
Write-Host "[1/4] Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "✓ Process cleanup complete" -ForegroundColor Green

# Check MongoDB
Write-Host "[2/4] Checking MongoDB..." -ForegroundColor Yellow
$mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -ErrorAction SilentlyContinue
if ($mongoTest.TcpTestSucceeded) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is NOT running on port 27017" -ForegroundColor Red
    $startMongo = Read-Host "Would you like to start MongoDB? (yes/no)"
    if ($startMongo -eq "yes") {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Process "mongod"
        Start-Sleep -Seconds 3
    }
}

# Validate directories
Write-Host "[3/4] Validating project structure..." -ForegroundColor Yellow
if (-not (Test-Path $backendDir)) {
    Write-Host "✗ Backend directory not found" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $frontendDir)) {
    Write-Host "✗ Frontend directory not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Project structure verified" -ForegroundColor Green

# Start servers
Write-Host "[4/4] Starting development servers..." -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backendScript = Join-Path -Path $backendDir -ChildPath "start-server.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScript
Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$frontendScript = Join-Path -Path $frontendDir -ChildPath "start-server.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $frontendScript

Write-Host ""
Write-Host "========================================"
Write-Host "✓ All servers started successfully!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to open the application in your browser..." -ForegroundColor Yellow
Read-Host ""

Start-Process "http://localhost:3000"
