# 🚀 Production Deployment Guide

## Quick Start

### 1. Environment Setup

**Backend (.env):**
```env
JWT_SECRET=<generate-strong-random-secret>
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
FIREBASE_CREDENTIALS_PATH=firebase-credentials-local-language.json
PORT=8000
HOST=0.0.0.0
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

### 2. Docker Deployment (Recommended)

```bash
# Production build
docker-compose -f docker-compose.production.yml up --build -d

# Check logs
docker-compose -f docker-compose.production.yml logs -f

# Stop
docker-compose -f docker-compose.production.yml down
```

### 3. Manual Deployment

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Serve dist/ with nginx or similar
```

## Pre-Deployment Checklist

- [ ] Generate strong JWT_SECRET
- [ ] Update CORS_ORIGINS with production domain
- [ ] Secure Firebase credentials
- [ ] Test all features
- [ ] Build frontend successfully
- [ ] Test backend API
- [ ] Verify Socket.IO connections
- [ ] Check all 14 languages work
- [ ] Test file uploads
- [ ] Verify notifications work
- [ ] Test on mobile devices
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Configure backups

## Health Checks

- Backend: `GET /health`
- API Docs: `GET /docs` (development only)
- Frontend: Check if index.html loads

## Security Notes

1. **JWT_SECRET**: Must be changed in production
2. **CORS**: Only allow your production domain
3. **Firebase**: Use secrets manager, never commit credentials
4. **HTTPS**: Required for production
5. **Rate Limiting**: Already configured (1000 req/min)
6. **API Docs**: Disabled in production automatically

## Support

For issues, check:
- Backend logs: `backend/logs/app.log`
- Docker logs: `docker-compose logs backend`
- Frontend console: Browser DevTools

