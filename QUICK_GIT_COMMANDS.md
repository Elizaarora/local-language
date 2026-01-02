# 🚀 Quick Git Commands - Copy & Paste

## Run These Commands in Order

### 1. Navigate to Project
```bash
cd C:\Users\hp\Desktop\local-language
```

### 2. Initialize Git (if not already done)
```bash
git init
```

### 3. Configure Git (First time only - replace with your info)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 4. Add All Files
```bash
git add .
```

### 5. Commit
```bash
git commit -m "Prepare for deployment: Fix notifications, update UI, add production configs"
```

### 6. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `local-language-integrator`
3. Make it **Public** (or Private)
4. **Don't** check "Initialize with README"
5. Click "Create repository"

### 7. Connect to GitHub (Replace YOUR_USERNAME)
```bash
git remote add origin https://github.com/YOUR_USERNAME/local-language-integrator.git
git branch -M main
git push -u origin main
```

---

## That's It! 🎉

After step 7, your code will be on GitHub and ready for deployment!

**Next:** Follow `RAILWAY_DEPLOYMENT.md` to deploy!

