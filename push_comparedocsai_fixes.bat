@echo off
echo ========================================
echo  CompareDocsAI - UI Fixes Push
echo ========================================
echo.

cd "d:\Antigravity Projects\Onepager"

echo [1/3] Staging all changes...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "fix(ui): Immediate contact modal, better error handling, upload progress text"

echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo ========================================
echo  Done! Changes pushed to GitHub.
echo  Please redeploy in Coolify.
echo ========================================
pause
