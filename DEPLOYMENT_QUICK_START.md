# 🚀 Quick Deployment Start Guide

## ✅ Git Status: Ready!

Your code is pushed to GitHub and ready for deployment! 🎉

---

## 🎯 Best Free Option: **Fly.io + Vercel**

### Why This Combo?
- ✅ **100% FREE** (both have generous free tiers)
- ✅ Easy setup
- ✅ Professional hosting
- ✅ Automatic deployments

---

## 📋 Deployment Steps

### **Step 1: Deploy Backend to Fly.io** (15 min)

1. **Install Fly.io CLI:**
   ```powershell
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Deploy:**
   ```bash
   cd backend
   fly launch
   ```
   - App name: `local-language-backend`
   - Region: Choose closest
   - PostgreSQL: **No**
   - Redis: **No**

4. **Set Secrets:**
   ```bash
   # Generate JWT secret
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # Set secrets (replace values)
   fly secrets set JWT_SECRET="your-generated-secret"
   fly secrets set ENVIRONMENT="production"
   fly secrets set CORS_ORIGINS="https://your-frontend.vercel.app"
   fly secrets set FIREBASE_CREDENTIALS="$(cat firebase-credentials-local-language.json)"
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

6. **Get URL:**
   ```bash
   fly status
   ```
   Your backend: `https://local-language-backend.fly.dev`

**Full guide:** See `FLYIO_DEPLOYMENT.md`

---

### **Step 2: Deploy Frontend to Vercel** (5 min)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
6. Environment Variables:
   ```
   VITE_API_BASE_URL=https://local-language-backend.fly.dev
   VITE_SOCKET_URL=https://local-language-backend.fly.dev
   ```
7. Click "Deploy"
8. Get your frontend URL: `https://your-app.vercel.app`

**Full guide:** See `VERCEL_FRONTEND_DEPLOYMENT.md`

---

### **Step 3: Update CORS**

```bash
fly secrets set CORS_ORIGINS="https://your-app.vercel.app"
fly deploy
```

---

## 🎉 Done!

Your app is now live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://local-language-backend.fly.dev`

---

## 📚 Full Guides

- **`FLYIO_DEPLOYMENT.md`** - Complete Fly.io guide
- **`VERCEL_FRONTEND_DEPLOYMENT.md`** - Complete Vercel guide
- **`FREE_DEPLOYMENT_OPTIONS.md`** - All alternatives

---

## 💰 Cost

**Total: $0/month** - Both platforms have free tiers! 🎉

---

**Ready? Start with Step 1!** 🚀


