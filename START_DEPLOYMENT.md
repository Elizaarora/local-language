# 🚀 Start Deployment - Render + Vercel

## ✅ Your Code is Ready!

Everything is prepared for deployment. Follow these steps:

---

## 📋 Deployment Checklist

### Backend (Render) - Do First
- [ ] Sign up at https://render.com
- [ ] Create Web Service
- [ ] Configure settings
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get backend URL

### Frontend (Vercel) - Do Second
- [ ] Sign up at https://vercel.com
- [ ] Import repository
- [ ] Configure settings
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get frontend URL

### Final Step
- [ ] Update CORS in Render with Vercel URL
- [ ] Test everything!

---

## 🎯 Quick Start

### 1. Deploy Backend (Render)

**Go to:** https://render.com

**Steps:**
1. Sign up → Connect GitHub
2. New + → Web Service
3. Select your repository
4. Configure:
   - Name: `local-language-backend`
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`
5. Add environment variables (see below)
6. Deploy!

**Environment Variables for Render:**
```
JWT_SECRET=<generate-secret>
ENVIRONMENT=production
CORS_ORIGINS=https://your-app.vercel.app
FIREBASE_CREDENTIALS=<paste-json-here>
PORT=10000
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### 2. Deploy Frontend (Vercel)

**Go to:** https://vercel.com

**Steps:**
1. Sign up → Connect GitHub
2. Add New Project
3. Import repository
4. Configure:
   - Root Directory: `frontend`
   - Framework: Vite (auto)
5. Add environment variables:
   ```
   VITE_API_BASE_URL=https://local-language-backend.onrender.com
   VITE_SOCKET_URL=https://local-language-backend.onrender.com
   ```
6. Deploy!

---

### 3. Update CORS

After getting Vercel URL:
1. Go to Render dashboard
2. Update `CORS_ORIGINS` with your Vercel URL
3. Service will auto-redeploy

---

## 📚 Detailed Guides

- **`RENDER_DEPLOYMENT.md`** - Complete Render guide
- **`VERCEL_FRONTEND_DEPLOYMENT.md`** - Complete Vercel guide
- **`DEPLOY_NOW.md`** - Quick reference

---

## 💡 Tips

1. **Render Free Tier**: Spins down after 15 min. First request after spin-down takes ~30 sec.
2. **Always-On Option**: Upgrade Render to Starter ($7/month) for no spin-downs
3. **Testing**: Test locally first, then deploy
4. **Logs**: Check Render and Vercel logs if issues occur

---

## 🎉 After Deployment

Your app will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://local-language-backend.onrender.com`

**Test everything and enjoy your deployed app!** 🚀

---

**Ready? Start with Render backend deployment!** 

See `RENDER_DEPLOYMENT.md` for detailed step-by-step instructions.


