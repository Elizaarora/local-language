# 🚀 Render Backend Deployment Guide

## Step-by-Step Deployment

### Step 1: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest way)

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your `local-language` repository

### Step 3: Configure Backend Service

**Basic Settings:**
- **Name**: `local-language-backend` (or your choice)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Python Version**: `3.11` (important - avoids Rust compilation issues)
- **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

### Step 4: Environment Variables

Click "Environment" tab and add:

```
JWT_SECRET=<generate-strong-secret>
ENVIRONMENT=production
CORS_ORIGINS=https://your-app.vercel.app
FIREBASE_CREDENTIALS_PATH=firebase-credentials-local-language.json
PORT=10000
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Add Firebase Credentials

**Option A: As Environment Variable (Recommended)**
1. Open `backend/firebase-credentials-local-language.json`
2. Copy entire JSON content
3. In Render, add environment variable:
   - **Key**: `FIREBASE_CREDENTIALS`
   - **Value**: Paste entire JSON (as single line or multiline)

**Option B: Upload as Secret File**
- Render doesn't support file uploads directly
- Use environment variable method (Option A)

### Step 6: Deploy

1. Click "Create Web Service"
2. Render will start building
3. Wait for deployment (~5-10 minutes)
4. Get your backend URL: `https://local-language-backend.onrender.com`

### Step 7: Important Settings

After deployment, go to **Settings**:
- **Auto-Deploy**: Enabled (deploys on every push)
- **Health Check Path**: `/health`
- **Plan**: Free (or upgrade if needed)

---

## ⚠️ Important Notes for Render

### Free Tier Limitations:
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ **First request after spin-down takes ~30 seconds** (cold start)
- ✅ **Auto-wakes on request**
- ✅ **750 hours/month free**

### For Production (Optional):
- Upgrade to **Starter Plan ($7/month)** for:
  - No spin-downs
  - Faster response times
  - Better performance

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify `requirements.txt` is correct
- Check Python version (should be 3.10+)

### App Won't Start
- Check start command: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`
- Verify environment variables are set
- Check logs in Render dashboard

### Socket.IO Not Working
- Render free tier supports WebSockets
- Verify Socket.IO URL in frontend matches backend URL
- Check CORS settings

---

## 📝 Next Steps

After backend is deployed:
1. Copy your Render backend URL
2. Deploy frontend to Vercel (see `VERCEL_FRONTEND_DEPLOYMENT.md`)
3. Update CORS in Render with Vercel URL
4. Test everything!

---

**Ready to deploy? Follow the steps above!** 🚀

