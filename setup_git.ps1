# Git Setup Script for Local Language Integrator
# Run this script to prepare your code for GitHub

Write-Host "🚀 Setting up Git for deployment..." -ForegroundColor Cyan

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = "C:\Users\hp\Desktop\local-language"
Set-Location $projectPath

# Initialize git if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Check git config
Write-Host "`n📝 Checking git configuration..." -ForegroundColor Yellow
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "⚠️  Git user not configured. Please set:" -ForegroundColor Yellow
    Write-Host "   git config user.name 'Your Name'" -ForegroundColor Cyan
    Write-Host "   git config user.email 'your.email@example.com'" -ForegroundColor Cyan
    Write-Host "`nOr run these commands now:" -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config user.name $name
    git config user.email $email
    Write-Host "✅ Git user configured" -ForegroundColor Green
} else {
    Write-Host "✅ Git user: $userName <$userEmail>" -ForegroundColor Green
}

# Add all files
Write-Host "`n📁 Adding files to git..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added" -ForegroundColor Green

# Check what will be committed
Write-Host "`n📋 Files to be committed:" -ForegroundColor Yellow
git status --short | Select-Object -First 20

# Commit
Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = "Prepare for deployment: Fix notifications, update UI, add production configs"
git commit -m $commitMessage
Write-Host "✅ Changes committed" -ForegroundColor Green

# Check if remote exists
Write-Host "`n🔗 Checking for remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null

if ($remote) {
    Write-Host "✅ Remote found: $remote" -ForegroundColor Green
    Write-Host "`n📤 Ready to push! Run:" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor White
} else {
    Write-Host "⚠️  No remote repository configured" -ForegroundColor Yellow
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
    Write-Host "2. Then run:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Cyan
    Write-Host "   git branch -M main" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
}

Write-Host "`n✅ Git setup complete!" -ForegroundColor Green
Write-Host "`n📚 See GIT_SETUP.md for detailed instructions" -ForegroundColor Cyan


