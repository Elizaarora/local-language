# ⚡ Render Quick Deploy - Copy & Paste

## 🚀 Deploy Backend to Render (5 Minutes)

### Step 1: Go to Render
👉 https://render.com

### Step 2: Sign Up
- Click "Get Started for Free"
- Sign up with GitHub

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub → Select `local-language` repo
3. Click "Connect"

### Step 4: Configure (Copy These Settings)

**Basic:**
- **Name**: `local-language-backend`
- **Region**: `Oregon (US West)` or closest
- **Branch**: `main`
- **Root Directory**: `backend` ← **IMPORTANT!**

**Build & Deploy:**
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

### Step 5: Environment Variables

Click "Environment" tab, add these:

**1. Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**2. Add Variables:**
```
JWT_SECRET=<paste-generated-secret>
ENVIRONMENT=production
CORS_ORIGINS=https://your-app.vercel.app
FIREBASE_CREDENTIALS=<paste-entire-json-from-firebase-credentials-local-language.json>
PORT=10000
```

**To get Firebase credentials:**
1. Open `backend/firebase-credentials-local-language.json`
2. Copy entire JSON content
3. Paste as `FIREBASE_CREDENTIALS` value (can be multiline)

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait ~5-10 minutes for build
3. Get your URL: `https://local-language-backend.onrender.com`

---

## ⚡ Deploy Frontend to Vercel (3 Minutes)

### Step 1: Go to Vercel
👉 https://vercel.com

### Step 2: Sign Up
- Sign up with GitHub

### Step 3: Import Project
1. Click "Add New..." → "Project"
2. Find `local-language` repository
3. Click "Import"

### Step 4: Configure
- **Root Directory**: `frontend` ← **IMPORTANT!**
- Framework: Vite (auto-detected)
- Build: `npm run build` (auto)
- Output: `dist` (auto)

### Step 5: Environment Variables
Add these (replace with your Render URL):

```
VITE_API_BASE_URL=https://local-language-backend.onrender.com
VITE_SOCKET_URL=https://local-language-backend.onrender.com
```

### Step 6: Deploy
1. Click "Deploy"
2. Wait ~2-3 minutes
3. Get URL: `https://local-language.vercel.app`

---

## 🔄 Update CORS

1. Go to Render dashboard
2. Your service → "Environment"
3. Update `CORS_ORIGINS`:
   ```
   https://local-language.vercel.app
   ```
4. Auto-redeploys!

---

## ✅ Done!

Your app is live:
- Frontend: `https://local-language.vercel.app`
- Backend: `https://local-language-backend.onrender.com`

---

## ⚠️ Render Free Tier Note

- Spins down after 15 min inactivity
- First request after spin-down: ~30 sec (cold start)
- Auto-wakes on request
- 750 hours/month free

**For always-on:** Upgrade to Starter ($7/month)

---

**Ready? Start with Render!** 🚀


