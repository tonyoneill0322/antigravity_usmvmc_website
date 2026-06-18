@echo off
title USMV MC - Photo Gallery Scanner
echo ===================================================
echo   USMV MC WEBSITE - PHOTO GALLERY AUTO-SCANNER
echo ===================================================
echo.
echo Scanning the "gallery/" folder and generating js/gallery-data.js...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_gallery.ps1"
echo.
echo ===================================================
echo Done! Refresh your browser to see the new photos.
echo ===================================================
echo.
pause
