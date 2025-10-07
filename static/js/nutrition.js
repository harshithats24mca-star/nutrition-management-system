// Nutrition Tracker JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeFoodSearch();
    initializeNutritionPreview();
});

// Food search functionality
function initializeFoodSearch() {
    const searchInput = document.getElementById('foodSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performFoodSearch);
    }
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performFoodSearch();
        }
    });
    
    // Search as user types (with debounce)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performFoodSearch, 300);
    });
}

// Perform food search
function performFoodSearch() {
    const searchInput = document.getElementById('foodSearch');
    const searchResults = document.getElementById('searchResults');
    const query = searchInput.value.trim();
    
    if (!query) {
        searchResults.innerHTML = '';
        return;
    }
    
    // Show loading state
    searchResults.innerHTML = `
        <div class="text-center p-3">
            <i class="fas fa-spinner fa-spin me-2"></i>Searching...
        </div>
    `;
    
    // Simulate API call with setTimeout for demo
    setTimeout(() => {
        fetch(`/nutrition/api/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(foods => {
                displaySearchResults(foods);
            })
            .catch(error => {
                console.error('Search error:', error);
                searchResults.innerHTML = `
                    <div class="text-center p-3 text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Search failed. Please try again.
                    </div>
                `;
            });
    }, 500);
}

// Display search results
function displaySearchResults(foods) {
    const searchResults = document.getElementById('searchResults');
    
    if (foods.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center p-3 text-muted">
                <i class="fas fa-search me-2"></i>No foods found
            </div>
        `;
        return;
    }
    
    let resultsHTML = '';
    foods.forEach(food => {
        resultsHTML += `
            <div class="food-result-item" onclick="selectFood('${food.id}', '${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat}, ${food.fiber})">
                <div class="food-result-name">${food.name}</div>
                <div class="food-result-nutrition">
                    ${Math.round(food.calories)} cal • ${food.protein.toFixed(1)}g protein • ${food.carbs.toFixed(1)}g carbs • ${food.fat.toFixed(1)}g fat
                </div>
            </div>
        `;
    });
    
    searchResults.innerHTML = resultsHTML;
}

// Select a food from search results
function selectFood(id, name, calories, protein, carbs, fat, fiber) {
    document.getElementById('selectedFoodId').value = id;
    document.getElementById('selectedFoodName').value = name;
    
    // Store food data for nutrition preview
    window.selectedFood = { id, name, calories, protein, carbs, fat, fiber };
    
    // Update nutrition preview
    updateNutritionPreview();
    
    // Enable add button
    document.getElementById('addMealBtn').disabled = false;
    
    // Clear search
    document.getElementById('foodSearch').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

// Initialize nutrition preview functionality
function initializeNutritionPreview() {
    const quantityInput = document.getElementById('quantity');
    
    if (quantityInput) {
        quantityInput.addEventListener('input', updateNutritionPreview);
    }
}

// Update nutrition preview based on quantity
function updateNutritionPreview() {
    if (!window.selectedFood) return;
    
    const quantity = parseFloat(document.getElementById('quantity').value) || 1;
    const food = window.selectedFood;
    
    // Calculate nutrition values
    const calories = (food.calories * quantity).toFixed(0);
    const protein = (food.protein * quantity).toFixed(1);
    const carbs = (food.carbs * quantity).toFixed(1);
    const fat = (food.fat * quantity).toFixed(1);
    
    // Update preview elements
    document.getElementById('previewCalories').textContent = calories;
    document.getElementById('previewProtein').textContent = protein;
    document.getElementById('previewCarbs').textContent = carbs;
    document.getElementById('previewFat').textContent = fat;
    
    // Show nutrition preview
    document.getElementById('nutritionPreview').style.display = 'block';
}

// Utility functions for nutrition calculations
function calculateBMR(weight, height, age, gender) {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

function calculateTDEE(bmr, activityLevel) {
    const multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    };
    
    return bmr * (multipliers[activityLevel] || 1.2);
}

// Format nutrition values for display
function formatNutrition(value, unit = '') {
    if (typeof value !== 'number') return '0' + unit;
    
    if (unit === 'g' && value < 1) {
        return value.toFixed(1) + unit;
    } else if (unit === 'g') {
        return Math.round(value) + unit;
    } else {
        return Math.round(value) + unit;
    }
}

// Calculate macronutrient percentages
function calculateMacroPercentages(protein, carbs, fat) {
    const proteinCals = protein * 4;
    const carbsCals = carbs * 4;
    const fatCals = fat * 9;
    const totalCals = proteinCals + carbsCals + fatCals;
    
    if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
        protein: Math.round((proteinCals / totalCals) * 100),
        carbs: Math.round((carbsCals / totalCals) * 100),
        fat: Math.round((fatCals / totalCals) * 100)
    };
}

// Animate progress bars
function animateProgressBar(element, targetWidth) {
    let currentWidth = 0;
    const increment = targetWidth / 20;
    
    const animate = () => {
        if (currentWidth < targetWidth) {
            currentWidth += increment;
            element.style.width = Math.min(currentWidth, targetWidth) + '%';
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

// Initialize progress bar animations on page load
document.addEventListener('DOMContentLoaded', function() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const targetWidth = parseFloat(bar.style.width);
        if (targetWidth > 0) {
            bar.style.width = '0%';
            setTimeout(() => animateProgressBar(bar, targetWidth), 500);
        }
    });
});

// Form validation helpers
function validateNutritionForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length === 0) {
        errors.push('Food name is required');
    }
    
    if (formData.calories < 0) {
        errors.push('Calories cannot be negative');
    }
    
    if (formData.protein < 0 || formData.carbs < 0 || formData.fat < 0) {
        errors.push('Macronutrients cannot be negative');
    }
    
    return errors;
}

// Export functions for use in other scripts
window.NutritionTracker = {
    performFoodSearch,
    selectFood,
    updateNutritionPreview,
    calculateBMR,
    calculateTDEE,
    formatNutrition,
    calculateMacroPercentages,
    validateNutritionForm
};
