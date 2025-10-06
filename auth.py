from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to require login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        
        data_store = current_app.config['DATA_STORE']
        user = data_store.get_user(session['user_id'])
        if not user or not user.get('is_admin', False):
            flash('Admin access required.', 'error')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        data_store = current_app.config['DATA_STORE']
        user = data_store.get_user_by_username(username)
        
        if user and data_store.verify_password(user, password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['is_admin'] = user.get('is_admin', False)
            
            flash(f'Welcome back, {user["username"]}!', 'success')
            
            # Redirect to admin panel if admin user
            if user.get('is_admin', False):
                return redirect(url_for('admin.dashboard'))
            else:
                return redirect(url_for('profile'))
        else:
            flash('Invalid username or password.', 'error')
    
    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Validation
        if not username or not email or not password:
            flash('All fields are required.', 'error')
        elif password != confirm_password:
            flash('Passwords do not match.', 'error')
        elif len(password) < 6:
            flash('Password must be at least 6 characters long.', 'error')
        else:
            data_store = current_app.config['DATA_STORE']
            user_id = data_store.create_user(username, email, password)
            
            if user_id:
                session['user_id'] = user_id
                session['username'] = username
                session['is_admin'] = False
                flash(f'Welcome to NutriTrack, {username}!', 'success')
                return redirect(url_for('profile'))
            else:
                flash('Username or email already exists.', 'error')
    
    return render_template('register.html')

@auth_bp.route('/logout')
def logout():
    """User logout"""
    username = session.get('username', 'User')
    session.clear()
    flash(f'Goodbye, {username}! You have been logged out.', 'info')
    return redirect(url_for('index'))
