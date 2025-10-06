import os
import logging
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
from data_store import DataStore
from auth import auth_bp, login_required, admin_required
from nutrition import nutrition_bp
from admin import admin_bp

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Initialize data store
data_store = DataStore()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(nutrition_bp, url_prefix='/nutrition')
app.register_blueprint(admin_bp, url_prefix='/admin')

# Make data_store available to all blueprints
app.config['DATA_STORE'] = data_store

@app.route('/')
def index():
    """Home page with food search functionality"""
    return render_template('index.html')

@app.route('/search')
def search():
    """Food search page"""
    query = request.args.get('q', '')
    foods = []
    
    if query:
        foods = data_store.search_foods(query)
    
    return render_template('search.html', foods=foods, query=query)

@app.route('/profile')
@login_required
def profile():
    """User profile page with nutrition stats"""
    user_id = session['user_id']
    user = data_store.get_user(user_id)
    meals = data_store.get_user_meals(user_id)
    
    # Calculate daily nutrition summary
    today = date.today().isoformat()
    today_meals = [meal for meal in meals if meal['date'] == today]
    
    daily_nutrition = {
        'calories': 0,
        'protein': 0,
        'carbs': 0,
        'fat': 0,
        'fiber': 0
    }
    
    for meal in today_meals:
        daily_nutrition['calories'] += meal['calories']
        daily_nutrition['protein'] += meal['protein']
        daily_nutrition['carbs'] += meal['carbs']
        daily_nutrition['fat'] += meal['fat']
        daily_nutrition['fiber'] += meal['fiber']
    
    return render_template('profile.html', user=user, meals=meals, 
                         daily_nutrition=daily_nutrition, today=today)

@app.route('/meal_plan')
@login_required
def meal_plan():
    """Meal planning page"""
    user_id = session['user_id']
    selected_date = request.args.get('date', date.today().isoformat())
    meals = data_store.get_user_meals_by_date(user_id, selected_date)
    
    return render_template('meal_plan.html', meals=meals, selected_date=selected_date)

@app.route('/add_meal', methods=['POST'])
@login_required
def add_meal():
    """Add a meal to user's plan"""
    user_id = session['user_id']
    food_id = request.form.get('food_id')
    quantity = float(request.form.get('quantity', 1))
    meal_date = request.form.get('date', date.today().isoformat())
    
    food = data_store.get_food(food_id)
    if food:
        meal_data = {
            'user_id': user_id,
            'food_id': food_id,
            'food_name': food['name'],
            'quantity': quantity,
            'date': meal_date,
            'calories': food['calories'] * quantity,
            'protein': food['protein'] * quantity,
            'carbs': food['carbs'] * quantity,
            'fat': food['fat'] * quantity,
            'fiber': food['fiber'] * quantity
        }
        
        data_store.add_meal(meal_data)
        flash('Meal added successfully!', 'success')
    else:
        flash('Food not found!', 'error')
    
    return redirect(url_for('meal_plan'))

@app.route('/delete_meal/<meal_id>')
@login_required
def delete_meal(meal_id):
    """Delete a meal from user's plan"""
    user_id = session['user_id']
    if data_store.delete_meal(meal_id, user_id):
        flash('Meal deleted successfully!', 'success')
    else:
        flash('Meal not found or unauthorized!', 'error')
    
    return redirect(url_for('meal_plan'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
