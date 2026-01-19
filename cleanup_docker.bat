@echo off
echo ========================================
echo  C: Drive Cleanup for Docker/Coolify
echo ========================================
echo.
echo WARNING: This will remove:
echo - Docker unused images, containers, volumes
echo - Docker build cache
echo - Temp files
echo.
pause

echo.
echo [1/4] Cleaning Docker containers...
docker container prune -f

echo.
echo [2/4] Cleaning Docker images...
docker image prune -a -f

echo.
echo [3/4] Cleaning Docker volumes...
docker volume prune -f

echo.
echo [4/4] Cleaning Docker build cache...
docker builder prune -f

echo.
echo ========================================
echo  Cleanup complete!
echo  Run this script again if needed.
echo ========================================
echo.

echo Current disk space:
wmic logicaldisk where "DeviceID='C:'" get DeviceID,FreeSpace,Size

pause
