#!/usr/bin/env python3
"""
NutriTrack - Nutrition Tracking Application
Local development server startup script
"""
import os
from app import app

if __name__ == '__main__':
    # Set environment variables for local development
    os.environ.setdefault('SESSION_SECRET', 'your-secret-key-change-this-in-production')
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,
        use_reloader=True
    )