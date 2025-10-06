#!/bin/bash

echo "Starting NutriTrack Application..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed or not in PATH."
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install Flask==3.0.0 Werkzeug==3.0.1 email-validator==2.1.0 > /dev/null 2>&1

# Set environment variable
export SESSION_SECRET="dev-secret-key-change-in-production"

# Start the application
echo
echo "Starting NutriTrack on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo
python run.py