#!/bin/bash
# Run script for Linux/Mac

echo "Starting GearGuard API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Please run setup_env.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Using default values."
    echo "Please create .env file with your database configuration."
fi

# Run the application
echo "Starting FastAPI server..."
python main.py

