@echo off
title FreshGuard AI Launcher
echo ========================================================
echo       Starting FreshGuard AI Services (3 Terminals)
echo ========================================================
echo.
echo [1/3] Starting Express Server with MongoDB Atlas on http://localhost:5000 ...
start "FreshGuard [1/3] - Express Server" cmd /k "node server.js"

echo [2/3] Starting FastAPI MobileNetV3 AI Model on http://localhost:8000 ...
start "FreshGuard [2/3] - FastAPI AI Classifier" cmd /k "python ml_model/serve_api.py"

echo [3/3] Starting Vite React Frontend on http://localhost:5173 ...
start "FreshGuard [3/3] - Vite Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo [OK] All 3 services launched successfully!
echo   * Web App:    http://localhost:5173
echo   * Backend:    http://localhost:5000
echo   * AI Vision:  http://localhost:8000
echo ========================================================
echo You can close this launcher window anytime.
pause

