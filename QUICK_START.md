# 🚀 Quick Start Guide

## Local Development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:socket_app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Using Docker (Easiest)
```bash
docker-compose -f docker-compose.production.yml up --build -d
```

### Manual Deployment

**1. Set Environment Variables:**
- Create `backend/.env` with production values
- Create `frontend/.env.production` with production URLs

**2. Build Frontend:**
```bash
cd frontend
npm install
npm run build
```

**3. Start Backend:**
```bash
cd backend
uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --workers 4
```

**4. Serve Frontend:**
- Use nginx to serve `frontend/dist/`
- Or use any static file server

## Environment Variables

**Backend (.env):**
```env
JWT_SECRET=<strong-random-secret>
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

## Health Check

Visit: `http://your-backend-url/health`

## Support

See `DEPLOYMENT.md` for detailed instructions.

