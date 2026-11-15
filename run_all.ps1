Write-Host "========================================================" -ForegroundColor Green
Write-Host "      Starting FreshGuard AI Services (3 Processes)     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green

Write-Host "[1/3] Starting Express Server with MongoDB Atlas (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"

Write-Host "[2/3] Starting FastAPI MobileNetV3 AI Classifier (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python ml_model/serve_api.py"

Write-Host "[3/3] Starting Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "[OK] All 3 services started successfully!" -ForegroundColor Green
Write-Host "  * Frontend UI:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  * Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  * AI Classifier: http://localhost:8000" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green

