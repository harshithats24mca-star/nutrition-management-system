// Admin Panel JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminFunctionality();
    initializeDeleteConfirmations();
    initializeFormValidation();
});

// Initialize admin-specific functionality
function initializeAdminFunctionality() {
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize delete confirmations with better UX
function initializeDeleteConfirmations() {
    const deleteLinks = document.querySelectorAll('a[onclick*="confirm"]');
    
    deleteLinks.forEach(link => {
        // Remove the inline onclick and handle with event listener
        const onclickContent = link.getAttribute('onclick');
        if (onclickContent) {
            link.removeAttribute('onclick');
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Extract the confirmation message
                const confirmMatch = onclickContent.match(/confirm\('([^']*)'\)/);
                const confirmMessage = confirmMatch ? confirmMatch[1] : 'Are you sure you want to delete this item?';
                
                // Create custom confirmation modal or use native confirm
                if (typeof bootstrap !== 'undefined') {
                    showCustomConfirmModal(confirmMessage, () => {
                        window.location.href = this.href;
                    });
                } else {
                    if (confirm(confirmMessage)) {
                        window.location.href = this.href;
                    }
                }
            });
        }
    });
}

// Custom confirmation modal
function showCustomConfirmModal(message, onConfirm) {
    const modalHTML = `
        <div class="modal fade" id="confirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                            Confirm Action
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmBtn">
                            <i class="fas fa-trash me-2"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize and show modal
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    
    // Handle confirm button click
    document.getElementById('confirmBtn').addEventListener('click', function() {
        modal.hide();
        onConfirm();
    });
    
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('confirmModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            } else {
                // Add loading state to submit button
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    addLoadingState(submitBtn);
                }
            }
        });
        
        // Real-time validation for numeric inputs
        const numericInputs = form.querySelectorAll('input[type="number"]');
        numericInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateNumericInput(this);
            });
        });
        
        // Real-time validation for required text inputs
        const textInputs = form.querySelectorAll('input[type="text"][required]');
        textInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateTextInput(this);
            });
        });
    });
}

// Validate form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showInputError(input, 'This field is required');
            isValid = false;
        } else {
            clearInputError(input);
            
            // Additional validation based on input type
            if (input.type === 'number') {
                if (parseFloat(input.value) < 0) {
                    showInputError(input, 'Value cannot be negative');
                    isValid = false;
                }
            }
            
            if (input.type === 'email') {
                if (!isValidEmail(input.value)) {
                    showInputError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        }
    });
    
    return isValid;
}

// Validate numeric input
function validateNumericInput(input) {
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value < 0) {
        showInputError(input, 'Please enter a valid positive number');
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

// Validate text input
function validateTextInput(input) {
    if (!input.value.trim()) {
        showInputError(input, 'This field is required');
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

// Show input error
function showInputError(input, message) {
    // Remove existing error
    clearInputError(input);
    
    // Add error class
    input.classList.add('is-invalid');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    // Insert after input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

// Clear input error
function clearInputError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add loading state to button
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    button.disabled = true;
    
    // Store original text for potential restoration
    button.dataset.originalText = originalText;
}

// Remove loading state from button
function removeLoadingState(button) {
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
        delete button.dataset.originalText;
    }
}

// Statistics animation for dashboard
function animateStatistics() {
    const statNumbers = document.querySelectorAll('.card h2');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (isNaN(finalValue)) return;
        
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 50);
        const duration = 1000; // 1 second
        const stepTime = duration / (finalValue / increment);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = currentValue;
        }, stepTime);
    });
}

// Initialize statistics animation when dashboard loads
if (window.location.pathname.includes('/admin/dashboard')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(animateStatistics, 500);
    });
}

// Enhanced table functionality
function initializeEnhancedTables() {
    const tables = document.querySelectorAll('.table');
    
    tables.forEach(table => {
        // Add hover effect to rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--bs-secondary-bg)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
        
        // Add sorting capability to headers (basic implementation)
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (header.textContent.trim() && !header.querySelector('button')) {
                header.style.cursor = 'pointer';
                header.style.userSelect = 'none';
                
                header.addEventListener('click', function() {
                    sortTable(table, index);
                });
                
                // Add sort indicator
                header.innerHTML += ' <i class="fas fa-sort text-muted ms-1"></i>';
            }
        });
    });
}

// Basic table sorting
function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort order
    const isAscending = !table.dataset.sortAsc || table.dataset.sortAsc === 'false';
    table.dataset.sortAsc = isAscending.toString();
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Check if values are numeric
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        } else {
            return isAscending 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        }
    });
    
    // Update sort indicators
    const headers = table.querySelectorAll('th i.fa-sort, th i.fa-sort-up, th i.fa-sort-down');
    headers.forEach((icon, index) => {
        if (index === columnIndex) {
            icon.className = `fas ${isAscending ? 'fa-sort-up' : 'fa-sort-down'} text-primary ms-1`;
        } else {
            icon.className = 'fas fa-sort text-muted ms-1';
        }
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

// Export admin utilities for global use
window.AdminUtils = {
    showCustomConfirmModal,
    addLoadingState,
    removeLoadingState,
    validateForm,
    animateStatistics,
    sortTable
};

// Initialize enhanced tables when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeEnhancedTables, 100);
});

// Keyboard shortcuts for admin panel
document.addEventListener('keydown', function(e) {
    // Alt + D for Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        window.location.href = '/admin/dashboard';
    }
    
    // Alt + U for Users
    if (e.altKey && e.key === 'u') {
        e.preventDefault();
        window.location.href = '/admin/users';
    }
    
    // Alt + F for Foods
    if (e.altKey && e.key === 'f') {
        e.preventDefault();
        window.location.href = '/admin/foods';
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }
});

// Auto-save draft functionality for forms
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        const formId = form.id || form.action || 'default';
        
        // Load saved data
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(`admin_draft_${formId}_${input.name}`);
            if (savedValue && !input.value) {
                input.value = savedValue;
            }
            
            // Save on input
            input.addEventListener('input', function() {
                localStorage.setItem(`admin_draft_${formId}_${this.name}`, this.value);
            });
        });
        
        // Clear saved data on successful submit
        form.addEventListener('submit', function() {
            inputs.forEach(input => {
                localStorage.removeItem(`admin_draft_${formId}_${input.name}`);
            });
        });
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', initializeAutoSave);

console.log('Admin JavaScript loaded successfully');
