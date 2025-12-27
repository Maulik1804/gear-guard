@echo off
REM Run script for Windows
echo Starting GearGuard API...

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found. Please run setup_env.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if .env file exists
if not exist ".env" (
    echo Warning: .env file not found. Using default values.
    echo Please create .env file with your database configuration.
)

REM Run the application
echo Starting FastAPI server...
python main.py

