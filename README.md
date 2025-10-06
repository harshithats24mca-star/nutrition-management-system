# NutriTrack - Nutrition Tracking Application

A comprehensive web application for tracking nutrition, managing meal plans, and monitoring dietary intake built with Flask.

## Features

- **User Authentication**: Secure registration and login system
- **Food Database**: Comprehensive database with nutritional information
- **Meal Planning**: Plan and track daily meals with nutritional calculations
- **Nutrition Analytics**: Visual charts and progress tracking
- **Admin Panel**: Administrative interface for managing users and foods
- **Responsive Design**: Mobile-friendly dark theme interface

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd nutritrack
   
   # Or extract if downloaded as ZIP
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install Flask==3.0.0 Werkzeug==3.0.1 email-validator==2.1.0
   ```

## Running the Application

1. **Start the development server**
   ```bash
   python run.py
   ```

2. **Access the application**
   Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Default Admin Account

For testing admin features, use these credentials:
- **Username**: admin
- **Password**: admin123

## Project Structure

```
nutritrack/
├── app.py              # Main Flask application
├── run.py              # Development server startup script
├── main.py             # Production WSGI entry point
├── auth.py             # Authentication module
├── nutrition.py        # Nutrition API endpoints
├── admin.py            # Admin panel functionality
├── data_store.py       # In-memory data storage
├── templates/          # HTML templates
│   ├── base.html       # Base template
│   ├── index.html      # Homepage
│   ├── login.html      # Login page
│   ├── register.html   # Registration page
│   ├── profile.html    # User profile
│   ├── meal_plan.html  # Meal planning
│   ├── search.html     # Food search
│   └── admin/          # Admin templates
├── static/             # Static assets
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript files
└── README.md          # This file
```

## Usage

### For Regular Users:
1. Register a new account or login
2. Search for foods to view nutritional information
3. Add foods to your meal plan for specific dates
4. View your nutrition progress on the profile page
5. Track daily intake with visual charts

### For Administrators:
1. Login with admin credentials
2. Access the admin panel via the navigation menu
3. Manage the food database (add, edit, delete foods)
4. View user accounts and system statistics
5. Monitor application usage and activity

## API Endpoints

The application provides several API endpoints for nutrition data:

- `GET /nutrition/api/foods` - Get all foods
- `GET /nutrition/api/search?q=<query>` - Search foods
- `GET /nutrition/api/food/<food_id>` - Get specific food details
- `GET /nutrition/api/nutrition_facts/<food_id>` - Get nutrition facts with quantity

## Customization

### Adding New Foods
1. Login as admin
2. Go to Admin Panel > Food Management
3. Use the "Add New Food" form
4. Enter nutritional values per 100g serving

### Changing Appearance
- Edit `static/css/custom.css` for styling changes
- Modify templates in the `templates/` directory
- Update Bootstrap theme in `templates/base.html`

### Database Integration
The application currently uses in-memory storage. To add persistent database storage:
1. Install SQLAlchemy: `pip install SQLAlchemy`
2. Replace `data_store.py` with proper database models
3. Update the application configuration

## Production Deployment

For production deployment:

1. **Set environment variables**
   ```bash
   export SESSION_SECRET="your-very-secure-secret-key"
   ```

2. **Use a production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 main:app
   ```

3. **Configure reverse proxy** (nginx recommended)

## Security Notes

- Change the default admin password in production
- Set a secure SESSION_SECRET environment variable
- Use HTTPS in production
- Consider implementing rate limiting for API endpoints
- Regular backup of user data if using persistent storage

## Troubleshooting

### Common Issues:

1. **Port already in use**
   - Change the port in `run.py` or stop other applications using port 5000

2. **Module not found errors**
   - Ensure virtual environment is activated
   - Verify all dependencies are installed

3. **Template not found**
   - Check that all template files are in the correct directory structure

4. **Static files not loading**
   - Verify static files are in the `static/` directory
   - Check browser developer tools for 404 errors

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Ensure all prerequisites are properly installed