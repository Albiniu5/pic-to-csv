@echo off
echo ========================================
echo  CompareDocsAI - Git Push Automation
echo ========================================
echo.

cd "d:\Antigravity Projects\Onepager"

echo [1/3] Staging all changes...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "feat: Add contact form + download report + review widget with real data"

echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo ========================================
echo  Done! Changes pushed to GitHub.
echo  Coolify should auto-deploy shortly.
echo ========================================
pause
