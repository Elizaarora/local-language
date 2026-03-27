# 🚀 Fly.io Deployment Guide

## Why Fly.io?
- ✅ **Free tier**: 3 shared VMs, 3GB storage
- ✅ Supports FastAPI + Socket.IO
- ✅ Automatic HTTPS
- ✅ Easy GitHub deployment
- ✅ Great for production

---

## Step 1: Install Fly.io CLI

### Windows (PowerShell):
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Or download from:
https://fly.io/docs/getting-started/installing-flyctl/

---

## Step 2: Login to Fly.io

```bash
fly auth login
```

This will open your browser to login/signup.

---

## Step 3: Deploy Backend

### 3.1 Navigate to backend
```bash
cd backend
```

### 3.2 Initialize Fly.io
```bash
fly launch
```

**Answer the prompts:**
- App name: `local-language-backend` (or choose your own)
- Region: Choose closest to you
- PostgreSQL: **No** (we use Firebase)
- Redis: **No**

### 3.3 Create `fly.toml` (if not auto-generated)

Create `backend/fly.toml`:
```toml
app = "local-language-backend"
primary_region = "iad"

[build]
  dockerfile = "../Dockerfile.production"

[env]
  ENVIRONMENT = "production"
  PORT = "8000"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[services]]
  http_checks = []
  internal_port = 8000
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

### 3.4 Set Environment Variables

```bash
# Generate JWT secret
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Set variables (replace values)
fly secrets set JWT_SECRET="your-generated-secret"
fly secrets set ENVIRONMENT="production"
fly secrets set CORS_ORIGINS="https://your-frontend.vercel.app"
```

### 3.5 Add Firebase Credentials

**Option A: As secret (recommended)**
```bash
# Read credentials file and set as secret
fly secrets set FIREBASE_CREDENTIALS="$(cat firebase-credentials-local-language.json)"
```

**Option B: Upload file**
```bash
fly secrets import < firebase-credentials-local-language.json
```

### 3.6 Deploy
```bash
fly deploy
```

### 3.7 Get your backend URL
```bash
fly status
# Or check: https://fly.io/dashboard
```

Your backend will be at: `https://local-language-backend.fly.dev`

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Go to Vercel
1. Visit https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your repository

### 4.2 Configure
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4.3 Environment Variables
```
VITE_API_BASE_URL=https://local-language-backend.fly.dev
VITE_SOCKET_URL=https://local-language-backend.fly.dev
```

### 4.4 Deploy
Click "Deploy"

---

## Step 5: Update CORS

Go back to Fly.io and update CORS:
```bash
fly secrets set CORS_ORIGINS="https://your-app.vercel.app"
fly deploy
```

---

## Step 6: Test

1. Visit your Vercel URL
2. Test login
3. Test chat
4. Test notifications

---

## Troubleshooting

### Backend won't start
- Check logs: `fly logs`
- Verify secrets: `fly secrets list`
- Check Dockerfile path

### Socket.IO not working
- Fly.io supports WebSockets
- Check firewall settings
- Verify Socket.IO URL in frontend

### Firebase errors
- Verify credentials are set correctly
- Check file format (must be valid JSON)

---

## Cost

**Free Tier:**
- 3 shared VMs
- 3GB storage
- 160GB outbound data transfer
- **Perfect for your app!**

---

**Ready to deploy? Follow the steps above!** 🚀


