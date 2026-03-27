#!/usr/bin/env python3
"""
Deployment Test Script for Local Language Integrator
Tests all critical components before deployment
"""

import sys
import os

def test_backend_imports():
    """Test if all backend imports work"""
    print("🔍 Testing backend imports...")
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
        from app.main import app, socket_app
        from app.core.config import settings
        from app.core.socketio_manager import sio
        from app.api import auth, chat, files, reactions, profile, notifications, privacy
        print("✅ All backend imports successful")
        return True
    except Exception as e:
        print(f"❌ Backend import error: {e}")
        return False

def test_configuration():
    """Test configuration settings"""
    print("\n🔍 Testing configuration...")
    try:
        from app.core.config import settings
        assert settings.APP_NAME == "Local Language Integrator"
        assert settings.VERSION is not None
        print("✅ Configuration loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def test_dependencies():
    """Test if all required dependencies are available"""
    print("\n🔍 Testing dependencies...")
    required_modules = [
        'fastapi',
        'uvicorn',
        'socketio',
        'firebase_admin',
        'pydantic',
        'jose',
        'passlib',
        'bcrypt',
        'deep_translator',
        'textblob',
        'aiofiles'
    ]
    
    missing = []
    for module in required_modules:
        try:
            if module == 'jose':
                __import__('jose')
            elif module == 'deep_translator':
                __import__('deep_translator')
            else:
                __import__(module)
        except ImportError:
            missing.append(module)
    
    if missing:
        print(f"❌ Missing dependencies: {', '.join(missing)}")
        return False
    else:
        print("✅ All dependencies available")
        return True

def test_file_structure():
    """Test if all required files exist"""
    print("\n🔍 Testing file structure...")
    required_files = [
        'backend/app/main.py',
        'backend/app/core/config.py',
        'backend/app/core/socketio_manager.py',
        'backend/requirements.txt',
        'frontend/package.json',
        'frontend/vite.config.js',
        'docker-compose.yml',
        'Dockerfile'
    ]
    
    missing = []
    for file in required_files:
        if not os.path.exists(file):
            missing.append(file)
    
    if missing:
        print(f"❌ Missing files: {', '.join(missing)}")
        return False
    else:
        print("✅ All required files present")
        return True

def main():
    """Run all tests"""
    print("=" * 60)
    print("🚀 Local Language Integrator - Deployment Test")
    print("=" * 60)
    
    results = []
    
    # Change to backend directory for imports
    os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))
    
    results.append(("File Structure", test_file_structure()))
    results.append(("Dependencies", test_dependencies()))
    results.append(("Configuration", test_configuration()))
    results.append(("Backend Imports", test_backend_imports()))
    
    print("\n" + "=" * 60)
    print("📊 Test Results:")
    print("=" * 60)
    
    all_passed = True
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False
    
    print("=" * 60)
    if all_passed:
        print("✅ All tests passed! Application is ready for deployment.")
        return 0
    else:
        print("❌ Some tests failed. Please fix issues before deployment.")
        return 1

if __name__ == "__main__":
    sys.exit(main())


