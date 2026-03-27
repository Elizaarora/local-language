# 🚀 Deploy Now - Render + Vercel

## Quick Deployment Steps

### 🎯 Part 1: Deploy Backend to Render (15 minutes)

#### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo: `local-language`
3. Click "Connect"

#### Step 3: Configure
- **Name**: `local-language-backend`
- **Region**: Choose closest (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

#### Step 4: Environment Variables
Click "Environment" and add:

```env
JWT_SECRET=<generate-this>
ENVIRONMENT=production
CORS_ORIGINS=https://your-app.vercel.app
FIREBASE_CREDENTIALS=<paste-entire-json-here>
PORT=10000
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Get Firebase Credentials:**
1. Open `backend/firebase-credentials-local-language.json`
2. Copy entire content
3. Paste as `FIREBASE_CREDENTIALS` value (can be multiline)

#### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for build (~5-10 min)
3. Get URL: `https://local-language-backend.onrender.com`

---

### 🎯 Part 2: Deploy Frontend to Vercel (5 minutes)

#### Step 1: Sign Up
1. Go to https://vercel.com
2. Sign up with GitHub

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find `local-language` repository
3. Click "Import"

#### Step 3: Configure
- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `frontend` ← **IMPORTANT!**
- **Build Command**: `npm run build` (auto)
- **Output Directory**: `dist` (auto)

#### Step 4: Environment Variables
Add these (replace with your Render URL):

```env
VITE_API_BASE_URL=https://local-language-backend.onrender.com
VITE_SOCKET_URL=https://local-language-backend.onrender.com
```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for build (~2-3 min)
3. Get URL: `https://local-language.vercel.app`

---

### 🎯 Part 3: Update CORS

1. Go back to Render dashboard
2. Go to your backend service → "Environment"
3. Update `CORS_ORIGINS`:
   ```
   https://local-language.vercel.app
   ```
4. Render will auto-redeploy

---

## ✅ Done!

Your app is live:
- **Frontend**: `https://local-language.vercel.app`
- **Backend**: `https://local-language-backend.onrender.com`

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Test registration/login
3. Test chat functionality
4. Test notifications

---

## ⚠️ Important Notes

### Render Free Tier:
- Spins down after 15 min inactivity
- First request after spin-down: ~30 sec (cold start)
- Auto-wakes on request
- 750 hours/month free

### If You Need Always-On:
- Upgrade Render to Starter ($7/month)
- Or use Fly.io instead (better free tier)

---

## 🆘 Troubleshooting

**Backend not responding?**
- Check Render logs
- Verify environment variables
- Check if service is running

**Frontend can't connect?**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in Render
- Ensure backend is running

**Socket.IO not working?**
- Verify `VITE_SOCKET_URL` matches backend
- Check WebSocket support (Render free tier supports it)

---

**Ready? Start with Part 1!** 🚀


