/**
 * Main JavaScript file for Work Hours Tracker
 * Handles UI interactions, form submissions, and AJAX requests
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeAlerts();
    initializeForms();
    initializeQuickActions();
    initializeTooltips();
});

/**
 * Initialize alert dismissal functionality
 */
function initializeAlerts() {
    const alertCloseButtons = document.querySelectorAll('.alert-close');
    
    alertCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            if (alert) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        });
    });
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        }, 5000);
    });
}

/**
 * Initialize form enhancements
 */
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add loading state to submit buttons
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

/**
 * Initialize quick actions functionality
 */
function initializeQuickActions() {
    const quickJobForm = document.querySelector('.quick-job-form');
    
    if (quickJobForm) {
        quickJobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="loading-spinner"></span> Starting...';
            }
            
            // Submit via AJAX
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Job started successfully!', 'success');
                    this.reset();
                    // Refresh the page to show the new job
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showNotification('Error starting job: ' + (data.message || 'Unknown error'), 'error');
                    displayFormErrors(this, data.errors);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while starting the job.', 'error');
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Start Job';
                }
            });
        });
    }
}

/**
 * Initialize tooltips for better UX
 */
function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

/**
 * Show tooltip
 */
function showTooltip(e) {
    const tooltipText = e.target.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target._tooltip = tooltip;
}

/**
 * Hide tooltip
 */
function hideTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.remove();
        delete e.target._tooltip;
    }
}

/**
 * Validate a form field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Title validation
    if (fieldName === 'title' && value && value.length < 3) {
        isValid = false;
        errorMessage = 'Title must be at least 3 characters long.';
    }
    
    // Date validation
    if (fieldName === 'start_time' && value) {
        const startDate = new Date(value);
        const now = new Date();
        if (startDate > now) {
            isValid = false;
            errorMessage = 'Start time cannot be in the future.';
        }
    }
    
    if (fieldName === 'end_time' && value) {
        const endDate = new Date(value);
        const startTimeField = field.form.querySelector('[name="start_time"]');
        if (startTimeField && startTimeField.value) {
            const startDate = new Date(startTimeField.value);
            if (endDate <= startDate) {
                isValid = false;
                errorMessage = 'End time must be after start time.';
            }
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 4px;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Display form errors from server response
 */
function displayFormErrors(form, errors) {
    // Clear existing errors
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    // Display new errors
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            showFieldError(field, errors[fieldName][0]);
        }
    });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#06b6d4'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Stop job functionality
 */
function stopJob(jobId) {
    if (!confirm('Are you sure you want to stop this job?')) {
        return;
    }
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    fetch(`/api/job/${jobId}/stop/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Job stopped successfully!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showNotification('Error stopping job: ' + (data.message || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred while stopping the job.', 'error');
    });
}

/**
 * Format duration for display
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for global use
window.stopJob = stopJob;
window.showNotification = showNotification;
