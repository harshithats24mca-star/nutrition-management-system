@echo off
echo Starting NutriTrack Application...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if needed
echo Installing dependencies...
pip install Flask==3.0.0 Werkzeug==3.0.1 email-validator==2.1.0 >nul 2>&1

REM Set environment variable
set SESSION_SECRET=dev-secret-key-change-in-production

REM Start the application
echo.
echo Starting NutriTrack on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python run.py