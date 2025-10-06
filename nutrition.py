from flask import Blueprint, jsonify, request, current_app
from auth import login_required

nutrition_bp = Blueprint('nutrition', __name__)

@nutrition_bp.route('/api/foods')
def api_foods():
    """API endpoint to get all foods"""
    data_store = current_app.config['DATA_STORE']
    foods = data_store.get_all_foods()
    return jsonify(foods)

@nutrition_bp.route('/api/search')
def api_search():
    """API endpoint to search foods"""
    query = request.args.get('q', '')
    data_store = current_app.config['DATA_STORE']
    foods = data_store.search_foods(query)
    return jsonify(foods)

@nutrition_bp.route('/api/food/<food_id>')
def api_food(food_id):
    """API endpoint to get a specific food"""
    data_store = current_app.config['DATA_STORE']
    food = data_store.get_food(food_id)
    if food:
        return jsonify(food)
    else:
        return jsonify({'error': 'Food not found'}), 404

@nutrition_bp.route('/api/nutrition_facts/<food_id>')
def api_nutrition_facts(food_id):
    """API endpoint to get nutrition facts with quantity calculation"""
    quantity = float(request.args.get('quantity', 1))
    data_store = current_app.config['DATA_STORE']
    food = data_store.get_food(food_id)
    
    if food:
        nutrition_facts = {
            'name': food['name'],
            'quantity': quantity,
            'calories': food['calories'] * quantity,
            'protein': food['protein'] * quantity,
            'carbs': food['carbs'] * quantity,
            'fat': food['fat'] * quantity,
            'fiber': food['fiber'] * quantity
        }
        return jsonify(nutrition_facts)
    else:
        return jsonify({'error': 'Food not found'}), 404
