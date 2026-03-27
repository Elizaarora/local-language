# 🚀 Deployment Checklist - Local Language Integrator

## Pre-Deployment Testing

### ✅ Backend Tests
- [x] All imports working correctly
- [x] API endpoints functional
- [x] Socket.IO connections working
- [x] Database connections stable
- [x] Error handling in place
- [x] Logging configured

### ✅ Frontend Tests
- [x] Build process successful
- [x] All routes working
- [x] API connections functional
- [x] Socket.IO connections working
- [x] Responsive design verified
- [x] Dark mode working

## Production Configuration

### Environment Variables

**Backend (.env):**
```env
JWT_SECRET=<generate-strong-secret-key>
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

### Security Checklist

- [ ] Change JWT_SECRET to a strong random key
- [ ] Update CORS_ORIGINS with production domain
- [ ] Secure Firebase credentials (use secrets manager)
- [ ] Enable HTTPS/SSL
- [ ] Set up proper error logging
- [ ] Configure rate limiting
- [ ] Review and update dependencies
- [ ] Remove debug endpoints in production
- [ ] Set secure cookie flags
- [ ] Enable CORS only for production domains

### Firebase Setup

1. Create Firebase project
2. Enable Firestore Database
3. Enable Authentication
4. Download service account JSON
5. Place in `backend/firebase-credentials-local-language.json`
6. **IMPORTANT:** Add to `.gitignore` (already done)

### Docker Deployment

**Development:**
```bash
docker-compose up --build
```

**Production:**
```bash
docker-compose -f docker-compose.production.yml up --build -d
```

### Manual Deployment

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with nginx or similar
```

## Platform-Specific Deployment

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Add Firebase credentials as secret
4. Deploy

### Render
1. Create new Web Service
2. Set build command: `cd backend && pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Deploy

### Vercel (Frontend)
1. Connect repository
2. Set build command: `cd frontend && npm install && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables
5. Deploy

### AWS/EC2
1. Set up EC2 instance
2. Install Docker
3. Clone repository
4. Set environment variables
5. Run `docker-compose -f docker-compose.production.yml up -d`

## Post-Deployment

- [ ] Test all features
- [ ] Monitor logs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure backups
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Test SSL certificate
- [ ] Verify CORS settings
- [ ] Test Socket.IO connections
- [ ] Verify file uploads work
- [ ] Test all 14 languages

## Monitoring

- Backend health: `https://api.yourdomain.com/health`
- API docs: `https://api.yourdomain.com/docs`
- Check logs: `docker-compose logs -f backend`

## Troubleshooting

### Common Issues

1. **CORS errors**: Check CORS_ORIGINS environment variable
2. **Socket.IO not connecting**: Verify VITE_SOCKET_URL matches backend URL
3. **Firebase errors**: Check credentials file path and permissions
4. **Build failures**: Check Node.js and Python versions
5. **Port conflicts**: Change ports in docker-compose.yml

## Support

For issues, check:
- Backend logs: `backend/logs/app.log`
- Frontend console: Browser DevTools
- API docs: `/docs` endpoint


