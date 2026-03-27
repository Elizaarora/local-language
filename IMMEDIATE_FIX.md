# ⚡ Immediate Fix for Render Build Error

## 🔴 Problem
Render build fails because `pydantic-core` tries to compile Rust code.

## ✅ Solution

I've fixed `requirements.txt`. Now do this:

### Step 1: Update Render Build Command

1. Go to **Render Dashboard**
2. Your service → **Settings**
3. Find **"Build Command"**
4. Change it to:
   ```
   pip install --upgrade pip setuptools wheel && pip install -r requirements.txt
   ```
5. **Save Changes**

### Step 2: Set Python Version

1. In **Settings**, find **"Python Version"** (or create environment variable)
2. Set to: `3.11` or `3.11.9`
3. **Save Changes**

### Step 3: Push Updated Requirements

```bash
git add backend/requirements.txt backend/runtime.txt
git commit -m "Fix Render build: Update dependencies"
git push
```

### Step 4: Redeploy

1. Go to **Manual Deploy** tab
2. Click **"Deploy latest commit"**

---

## ✅ What I Fixed

- Updated `pydantic` to `2.9.2` (has pre-built wheels)
- Updated other packages for compatibility
- Added `runtime.txt` for Python 3.11

---

## 🎯 Quick Actions

**In Render Dashboard:**
1. Settings → Build Command → Update (see above)
2. Settings → Python Version → `3.11`
3. Save → Manual Deploy

**Then push:**
```bash
git add backend/requirements.txt backend/runtime.txt
git commit -m "Fix Render build"
git push
```

---

**This will fix the build!** 🚀


