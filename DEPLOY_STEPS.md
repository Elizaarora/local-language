# 🚀 Deploy Steps - Follow These Now!

## ✅ Step 1: Deploy Backend to Render

### 1.1 Go to Render
👉 **https://render.com**

### 1.2 Sign Up
- Click "Get Started for Free"
- Sign up with **GitHub** (easiest)

### 1.3 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub → Find `local-language` → **Connect**

### 1.4 Configure Service

**Copy these exact settings:**

| Setting | Value |
|---------|-------|
| **Name** | `local-language-backend` |
| **Region** | `Oregon (US West)` (or closest) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ **IMPORTANT!** |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT` |

### 1.5 Add Environment Variables

Click **"Environment"** tab, add these:

**First, generate JWT secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Then add these variables:**

```
Key: JWT_SECRET
Value: <paste-generated-secret>

Key: ENVIRONMENT
Value: production

Key: CORS_ORIGINS
Value: https://your-app.vercel.app
(We'll update this after Vercel deployment)

Key: FIREBASE_CREDENTIALS
Value: <paste-entire-json-from-firebase-credentials-local-language.json>
(Open the file, copy all content, paste here - can be multiline)

Key: PORT
Value: 10000
```

**To get Firebase credentials:**
1. Open `backend/firebase-credentials-local-language.json`
2. Select all (Ctrl+A) → Copy (Ctrl+C)
3. Paste in Render as `FIREBASE_CREDENTIALS` value

### 1.6 Deploy
1. Click **"Create Web Service"**
2. Wait for build (~5-10 minutes)
3. **Copy your backend URL**: `https://local-language-backend.onrender.com`

---

## ✅ Step 2: Deploy Frontend to Vercel

### 2.1 Go to Vercel
👉 **https://vercel.com**

### 2.2 Sign Up
- Sign up with **GitHub**

### 2.3 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find `local-language` repository
3. Click **"Import"**

### 2.4 Configure

**Important Settings:**
- **Root Directory**: Click **"Edit"** → Type: `frontend` ⚠️ **IMPORTANT!**
- Framework: Vite (auto-detected)
- Build: `npm run build` (auto)
- Output: `dist` (auto)

### 2.5 Environment Variables

Click **"Environment Variables"**, add:

```
VITE_API_BASE_URL=https://local-language-backend.onrender.com
VITE_SOCKET_URL=https://local-language-backend.onrender.com
```

**Replace with your actual Render URL!**

### 2.6 Deploy
1. Click **"Deploy"**
2. Wait for build (~2-3 minutes)
3. **Copy your frontend URL**: `https://local-language.vercel.app`

---

## ✅ Step 3: Update CORS

1. Go back to **Render dashboard**
2. Click your backend service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGINS`
5. Update value to: `https://your-app.vercel.app` (your actual Vercel URL)
6. Render will **auto-redeploy**

---

## 🎉 Done!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://local-language-backend.onrender.com`

---

## 🧪 Test

1. Visit your Vercel URL
2. Register a new account
3. Test chat
4. Test notifications
5. Test all features!

---

## ⚠️ Important Notes

### Render Free Tier:
- ⏸️ Spins down after 15 min of inactivity
- 🐌 First request after spin-down: ~30 seconds (cold start)
- ✅ Auto-wakes on request
- ✅ 750 hours/month free

**If you need always-on:**
- Upgrade Render to **Starter Plan ($7/month)**
- No spin-downs, faster response

---

## 🆘 Need Help?

- **Render logs**: Dashboard → Your service → Logs
- **Vercel logs**: Dashboard → Your project → Deployments → View logs
- **Check guides**: `RENDER_DEPLOYMENT.md` and `VERCEL_FRONTEND_DEPLOYMENT.md`

---

**Ready? Start with Step 1!** 🚀


