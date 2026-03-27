# 🚂 Railway Deployment Guide - Step by Step

## Prerequisites
- GitHub account
- Railway account (free at railway.app)
- Firebase credentials file

## Step 1: Prepare Your Code

### 1.1 Commit All Changes
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub

### 2.2 Create Backend Service
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `local-language` repository
4. Railway will detect it's a Python project

### 2.3 Configure Backend
1. Click on the service
2. Go to "Settings" → "Root Directory"
3. Set to: `backend`
4. Go to "Settings" → "Deploy"
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

### 2.4 Add Environment Variables
Go to "Variables" tab and add:
```
JWT_SECRET=<generate-strong-secret-here>
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-url.vercel.app
FIREBASE_CREDENTIALS_PATH=firebase-credentials-local-language.json
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.5 Add Firebase Credentials
1. Go to "Variables" tab
2. Click "New Variable"
3. Name: `FIREBASE_CREDENTIALS` (or upload as file)
4. Value: Copy entire contents of `firebase-credentials-local-language.json`
5. Or use Railway's file storage feature

### 2.6 Deploy
1. Railway will auto-deploy
2. Wait for deployment to complete
3. Copy the generated URL (e.g., `https://your-app.up.railway.app`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variables
Go to "Settings" → "Environment Variables":
```
VITE_API_BASE_URL=https://your-backend-url.up.railway.app
VITE_SOCKET_URL=https://your-backend-url.up.railway.app
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Copy the frontend URL (e.g., `https://your-app.vercel.app`)

### 3.5 Update Backend CORS
1. Go back to Railway
2. Update `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
3. Railway will auto-redeploy

## Step 4: Test Deployment

1. Visit your frontend URL
2. Test login/register
3. Test chat functionality
4. Test notifications
5. Verify all features work

## Step 5: Custom Domain (Optional)

### Frontend (Vercel)
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS instructions

### Backend (Railway)
1. Go to Railway service settings
2. Click "Generate Domain"
3. Or add custom domain in Railway Pro

## Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify environment variables
- Check Firebase credentials format

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Socket.IO not working
- Verify `VITE_SOCKET_URL` matches backend URL
- Check WebSocket support in Railway (may need upgrade)

## Cost
- **Railway**: $5/month free credit (usually enough)
- **Vercel**: Free for personal projects
- **Total**: ~$0-5/month

---

**Ready to deploy? Follow these steps!** 🚀


