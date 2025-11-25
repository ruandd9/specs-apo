@echo off
echo Starting Apostilas Online Development Environment...
echo.

echo Starting Backend Server...
cd backend
start "Backend" npm run dev
cd ..

echo Starting Frontend Server...
cd frontend
start "Frontend" npm run dev
cd ..

echo.
echo Development servers started!
echo Frontend: http://localhost:3001
echo Backend: http://localhost:3000
echo Backend API Docs: http://localhost:3000/api-docs
echo.
echo Press any key to exit...
pause >nul