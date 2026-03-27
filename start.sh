#!/bin/bash
# Production Start Script

echo "🚀 Starting Local Language Integrator..."

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found. Using defaults."
fi

# Start backend
echo "📦 Starting backend..."
cd backend
python -m uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --workers 4 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo "✅ Application started!"
echo "📡 Backend: http://localhost:8000"
echo "📡 Health: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop"

# Wait for interrupt
wait $BACKEND_PID


