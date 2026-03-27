#!/bin/bash
# Deployment Test Script

echo "🧪 Testing Local Language Integrator for Deployment..."
echo ""

# Test Python version
echo "1. Checking Python version..."
python --version || { echo "❌ Python not found"; exit 1; }
echo "✅ Python OK"
echo ""

# Test Node version
echo "2. Checking Node version..."
node --version || { echo "❌ Node.js not found"; exit 1; }
echo "✅ Node.js OK"
echo ""

# Test backend imports
echo "3. Testing backend imports..."
cd backend
python -c "from app.main import app; print('✅ Backend imports OK')" || { echo "❌ Backend imports failed"; exit 1; }
cd ..
echo ""

# Test frontend build
echo "4. Testing frontend build..."
cd frontend
npm run build > /dev/null 2>&1 && echo "✅ Frontend build OK" || { echo "❌ Frontend build failed"; exit 1; }
cd ..
echo ""

# Check required files
echo "5. Checking required files..."
files=(
    "backend/requirements.txt"
    "frontend/package.json"
    "docker-compose.yml"
    "Dockerfile"
    "backend/app/main.py"
)
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done
echo ""

echo "✅ All tests passed! Ready for deployment."


