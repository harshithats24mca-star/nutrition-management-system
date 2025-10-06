from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from auth import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    """Admin dashboard"""
    data_store = current_app.config['DATA_STORE']
    
    # Get statistics
    total_users = len(data_store.get_all_users())
    total_foods = len(data_store.get_all_foods())
    total_meals = len(data_store.get_all_meals())
    
    # Get recent activity
    recent_users = sorted(data_store.get_all_users(), 
                         key=lambda x: x['created_at'], reverse=True)[:5]
    recent_meals = sorted(data_store.get_all_meals(), 
                         key=lambda x: x['created_at'], reverse=True)[:10]
    
    stats = {
        'total_users': total_users,
        'total_foods': total_foods,
        'total_meals': total_meals
    }
    
    return render_template('admin/dashboard.html', stats=stats, 
                         recent_users=recent_users, recent_meals=recent_meals)

@admin_bp.route('/foods')
@admin_required
def foods():
    """Admin food management"""
    data_store = current_app.config['DATA_STORE']
    foods = data_store.get_all_foods()
    return render_template('admin/foods.html', foods=foods)

@admin_bp.route('/foods/add', methods=['POST'])
@admin_required
def add_food():
    """Add a new food"""
    data_store = current_app.config['DATA_STORE']
    
    name = request.form.get('name')
    calories = float(request.form.get('calories', 0))
    protein = float(request.form.get('protein', 0))
    carbs = float(request.form.get('carbs', 0))
    fat = float(request.form.get('fat', 0))
    fiber = float(request.form.get('fiber', 0))
    
    if name:
        food_id = data_store.add_food(name, calories, protein, carbs, fat, fiber)
        flash(f'Food "{name}" added successfully!', 'success')
    else:
        flash('Food name is required.', 'error')
    
    return redirect(url_for('admin.foods'))

@admin_bp.route('/foods/edit/<food_id>', methods=['POST'])
@admin_required
def edit_food(food_id):
    """Edit an existing food"""
    data_store = current_app.config['DATA_STORE']
    
    name = request.form.get('name')
    calories = float(request.form.get('calories', 0))
    protein = float(request.form.get('protein', 0))
    carbs = float(request.form.get('carbs', 0))
    fat = float(request.form.get('fat', 0))
    fiber = float(request.form.get('fiber', 0))
    
    if data_store.update_food(food_id, name, calories, protein, carbs, fat, fiber):
        flash(f'Food "{name}" updated successfully!', 'success')
    else:
        flash('Food not found.', 'error')
    
    return redirect(url_for('admin.foods'))

@admin_bp.route('/foods/delete/<food_id>')
@admin_required
def delete_food(food_id):
    """Delete a food"""
    data_store = current_app.config['DATA_STORE']
    
    food = data_store.get_food(food_id)
    if food and data_store.delete_food(food_id):
        flash(f'Food "{food["name"]}" deleted successfully!', 'success')
    else:
        flash('Food not found.', 'error')
    
    return redirect(url_for('admin.foods'))

@admin_bp.route('/users')
@admin_required
def users():
    """Admin user management"""
    data_store = current_app.config['DATA_STORE']
    users = data_store.get_all_users()
    return render_template('admin/users.html', users=users)

@admin_bp.route('/users/delete/<user_id>')
@admin_required
def delete_user(user_id):
    """Delete a user"""
    data_store = current_app.config['DATA_STORE']
    
    user = data_store.get_user(user_id)
    if user and not user.get('is_admin', False):
        if data_store.delete_user(user_id):
            flash(f'User "{user["username"]}" deleted successfully!', 'success')
        else:
            flash('Failed to delete user.', 'error')
    else:
        flash('Cannot delete admin user or user not found.', 'error')
    
    return redirect(url_for('admin.users'))
