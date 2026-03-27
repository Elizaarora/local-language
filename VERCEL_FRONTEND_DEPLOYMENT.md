# ⚡ Vercel Frontend Deployment - Quick Guide

## Why Vercel?
- ✅ **100% Free** for personal projects
- ✅ Automatic deployments from GitHub
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Zero configuration needed

---

## Step-by-Step Deployment

### Step 1: Sign Up
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find your `local-language` repository
3. Click "Import"

### Step 3: Configure Project

**Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `frontend` (click "Edit" and set this)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 4: Environment Variables

Click "Environment Variables" and add:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Important:** Replace `your-backend-url.onrender.com` with your actual Render backend URL!

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Get your frontend URL (e.g., `https://local-language.vercel.app`)

### Step 6: Update Backend CORS

After getting your Vercel URL, update backend CORS:

1. Go to Render dashboard
2. Go to your backend service → "Environment"
3. Update `CORS_ORIGINS` variable:
   ```
   https://your-app.vercel.app
   ```
4. Render will auto-redeploy

---

## Automatic Deployments

✅ **Every push to GitHub = Auto deploy!**
- Push to `main` branch → Production deploy
- Create pull request → Preview deploy

---

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. Wait for SSL certificate

---

## That's It! 🎉

Your frontend is now live on Vercel!

**Next:** Update backend CORS with your Vercel URL.

