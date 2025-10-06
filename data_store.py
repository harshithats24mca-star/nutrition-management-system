import uuid
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash

class DataStore:
    """In-memory data storage for the nutrition tracking application"""
    
    def __init__(self):
        self.users = {}
        self.foods = {}
        self.meals = {}
        self.user_counter = 0
        self.meal_counter = 0
        
        # Initialize with sample food data
        self._initialize_food_database()
        
        # Create default admin user
        self._create_admin_user()
    
    def _initialize_food_database(self):
        """Initialize the food database with common foods"""
        foods_data = [
            {'name': 'Apple', 'calories': 52, 'protein': 0.3, 'carbs': 14, 'fat': 0.2, 'fiber': 2.4},
            {'name': 'Banana', 'calories': 89, 'protein': 1.1, 'carbs': 23, 'fat': 0.3, 'fiber': 2.6},
            {'name': 'Chicken Breast', 'calories': 165, 'protein': 31, 'carbs': 0, 'fat': 3.6, 'fiber': 0},
            {'name': 'Salmon', 'calories': 208, 'protein': 22, 'carbs': 0, 'fat': 12, 'fiber': 0},
            {'name': 'Brown Rice', 'calories': 111, 'protein': 2.6, 'carbs': 23, 'fat': 0.9, 'fiber': 1.8},
            {'name': 'Broccoli', 'calories': 34, 'protein': 2.8, 'carbs': 7, 'fat': 0.4, 'fiber': 2.6},
            {'name': 'Eggs', 'calories': 155, 'protein': 13, 'carbs': 1.1, 'fat': 11, 'fiber': 0},
            {'name': 'Greek Yogurt', 'calories': 59, 'protein': 10, 'carbs': 3.6, 'fat': 0.4, 'fiber': 0},
            {'name': 'Quinoa', 'calories': 120, 'protein': 4.4, 'carbs': 22, 'fat': 1.9, 'fiber': 2.8},
            {'name': 'Spinach', 'calories': 23, 'protein': 2.9, 'carbs': 3.6, 'fat': 0.4, 'fiber': 2.2},
            {'name': 'Sweet Potato', 'calories': 86, 'protein': 1.6, 'carbs': 20, 'fat': 0.1, 'fiber': 3},
            {'name': 'Almonds', 'calories': 576, 'protein': 21, 'carbs': 22, 'fat': 49, 'fiber': 12},
            {'name': 'Avocado', 'calories': 160, 'protein': 2, 'carbs': 9, 'fat': 15, 'fiber': 7},
            {'name': 'Oatmeal', 'calories': 68, 'protein': 2.4, 'carbs': 12, 'fat': 1.4, 'fiber': 1.7},
            {'name': 'Turkey', 'calories': 135, 'protein': 25, 'carbs': 0, 'fat': 3.2, 'fiber': 0}
        ]
        
        for food_data in foods_data:
            food_id = str(uuid.uuid4())
            food_data['id'] = food_id
            food_data['created_at'] = datetime.now().isoformat()
            self.foods[food_id] = food_data
    
    def _create_admin_user(self):
        """Create default admin user"""
        admin_id = str(uuid.uuid4())
        admin_data = {
            'id': admin_id,
            'username': 'admin',
            'email': 'admin@nutritrack.com',
            'password_hash': generate_password_hash('admin123'),
            'is_admin': True,
            'created_at': datetime.now().isoformat()
        }
        self.users[admin_id] = admin_data
    
    # User management methods
    def create_user(self, username, email, password):
        """Create a new user"""
        # Check if username or email already exists
        for user in self.users.values():
            if user['username'] == username or user['email'] == email:
                return None
        
        user_id = str(uuid.uuid4())
        user_data = {
            'id': user_id,
            'username': username,
            'email': email,
            'password_hash': generate_password_hash(password),
            'is_admin': False,
            'created_at': datetime.now().isoformat()
        }
        self.users[user_id] = user_data
        return user_id
    
    def get_user(self, user_id):
        """Get user by ID"""
        return self.users.get(user_id)
    
    def get_user_by_username(self, username):
        """Get user by username"""
        for user in self.users.values():
            if user['username'] == username:
                return user
        return None
    
    def get_all_users(self):
        """Get all users"""
        return list(self.users.values())
    
    def verify_password(self, user, password):
        """Verify user password"""
        return check_password_hash(user['password_hash'], password)
    
    def delete_user(self, user_id):
        """Delete a user"""
        if user_id in self.users:
            del self.users[user_id]
            # Also delete user's meals
            meals_to_delete = [meal_id for meal_id, meal in self.meals.items() 
                             if meal['user_id'] == user_id]
            for meal_id in meals_to_delete:
                del self.meals[meal_id]
            return True
        return False
    
    # Food management methods
    def get_all_foods(self):
        """Get all foods"""
        return list(self.foods.values())
    
    def get_food(self, food_id):
        """Get food by ID"""
        return self.foods.get(food_id)
    
    def search_foods(self, query):
        """Search foods by name"""
        query = query.lower()
        results = []
        for food in self.foods.values():
            if query in food['name'].lower():
                results.append(food)
        return results
    
    def add_food(self, name, calories, protein, carbs, fat, fiber):
        """Add a new food"""
        food_id = str(uuid.uuid4())
        food_data = {
            'id': food_id,
            'name': name,
            'calories': calories,
            'protein': protein,
            'carbs': carbs,
            'fat': fat,
            'fiber': fiber,
            'created_at': datetime.now().isoformat()
        }
        self.foods[food_id] = food_data
        return food_id
    
    def update_food(self, food_id, name, calories, protein, carbs, fat, fiber):
        """Update a food"""
        if food_id in self.foods:
            self.foods[food_id].update({
                'name': name,
                'calories': calories,
                'protein': protein,
                'carbs': carbs,
                'fat': fat,
                'fiber': fiber
            })
            return True
        return False
    
    def delete_food(self, food_id):
        """Delete a food"""
        if food_id in self.foods:
            del self.foods[food_id]
            return True
        return False
    
    # Meal management methods
    def add_meal(self, meal_data):
        """Add a meal"""
        meal_id = str(uuid.uuid4())
        meal_data['id'] = meal_id
        meal_data['created_at'] = datetime.now().isoformat()
        self.meals[meal_id] = meal_data
        return meal_id
    
    def get_user_meals(self, user_id):
        """Get all meals for a user"""
        user_meals = []
        for meal in self.meals.values():
            if meal['user_id'] == user_id:
                user_meals.append(meal)
        return sorted(user_meals, key=lambda x: x['date'], reverse=True)
    
    def get_user_meals_by_date(self, user_id, meal_date):
        """Get meals for a user on a specific date"""
        user_meals = []
        for meal in self.meals.values():
            if meal['user_id'] == user_id and meal['date'] == meal_date:
                user_meals.append(meal)
        return user_meals
    
    def delete_meal(self, meal_id, user_id=None):
        """Delete a meal"""
        if meal_id in self.meals:
            meal = self.meals[meal_id]
            if user_id is None or meal['user_id'] == user_id:
                del self.meals[meal_id]
                return True
        return False
    
    def get_all_meals(self):
        """Get all meals (admin function)"""
        return list(self.meals.values())
