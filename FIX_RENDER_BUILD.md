# 🔧 Quick Fix for Render Build Error

## Problem
Render build fails because `pydantic-core` tries to compile Rust code, which fails.

## ✅ Solution

I've updated `requirements.txt` with compatible versions. Do this:

### Step 1: Commit the Fix
```bash
git add backend/requirements.txt backend/runtime.txt
git commit -m "Fix Render build: Update dependencies"
git push
```

### Step 2: Update Render Settings

1. Go to Render dashboard
2. Your service → **Settings**
3. Update **Build Command**:
   ```
   pip install --upgrade pip && pip install -r requirements.txt
   ```
4. If available, set **Python Version** to `3.11`
5. Save and redeploy

---

## What I Fixed

- ✅ Updated `pydantic` to 2.9.0 (has pre-built wheels)
- ✅ Updated other packages for compatibility
- ✅ Added `runtime.txt` for Python 3.11

---

**After pushing, Render will auto-redeploy with the fix!** 🚀


