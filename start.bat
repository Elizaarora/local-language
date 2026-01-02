@echo off
REM Production Start Script for Windows

echo 🚀 Starting Local Language Integrator...

REM Check if .env exists
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env not found. Using defaults.
)

REM Start backend
echo 📦 Starting backend...
cd backend
start /B python -m uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --workers 4

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Check if backend is running
curl -f http://localhost:8000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend started successfully
) else (
    echo ❌ Backend failed to start
    exit /b 1
)

echo ✅ Application started!
echo 📡 Backend: http://localhost:8000
echo 📡 Health: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop

pause

