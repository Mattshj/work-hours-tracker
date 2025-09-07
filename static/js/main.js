/**
 * Main JavaScript file for Work Hours Tracker
 * Handles UI interactions, form submissions, and AJAX requests
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing components...');
    
    try {
        // Initialize all components
        initializeAlerts();
        console.log('✓ Alerts initialized');
        
        initializeForms();
        console.log('✓ Forms initialized');
        
        initializeQuickActions();
        console.log('✓ Quick actions initialized');
        
        initializeTooltips();
        console.log('✓ Tooltips initialized');
        
        initializeSearch();
        console.log('✓ Search initialized');
        
        initializeAnimations();
        console.log('✓ Animations initialized');
        
        console.log('All components initialized successfully');
    } catch (error) {
        console.error('Error initializing components:', error);
    }
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

/**
 * Initialize search functionality
 */
function initializeSearch() {
    console.log('Starting search initialization...');
    
    // Wait a bit for DOM to be fully ready
    setTimeout(function() {
        const searchInput = document.getElementById('job-search');
        const searchClear = document.getElementById('search-clear');
        const jobsTable = document.querySelector('.jobs-table tbody');
        
        console.log('Search elements found:', {
            searchInput: !!searchInput,
            searchClear: !!searchClear,
            jobsTable: !!jobsTable
        });
        
        if (!searchInput) {
            console.log('Search initialization failed - search input not found');
            return;
        }
        
        if (!jobsTable) {
            console.log('Search initialization failed - jobs table not found');
            return;
        }
        
        console.log('Search initialization successful');
        
        // Simple search function without debounce for testing
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const rows = jobsTable.querySelectorAll('tr');
            
            console.log('Search triggered:', searchTerm, 'Rows found:', rows.length);
            
            let visibleCount = 0;
            
            rows.forEach((row, index) => {
                const jobTitle = row.querySelector('.job-title-link');
                const packageName = row.querySelector('.package-link');
                const status = row.querySelector('.status-badge');
                
                const jobTitleText = jobTitle ? jobTitle.textContent.toLowerCase() : '';
                const packageNameText = packageName ? packageName.textContent.toLowerCase() : '';
                const statusText = status ? status.textContent.toLowerCase() : '';
                
                console.log(`Row ${index}:`, {
                    jobTitle: jobTitleText,
                    packageName: packageNameText,
                    status: statusText,
                    searchTerm: searchTerm
                });
                
                const matches = jobTitleText.includes(searchTerm) || 
                              packageNameText.includes(searchTerm) || 
                              statusText.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Show/hide clear button
            if (searchClear) {
                if (searchTerm) {
                    searchClear.style.display = 'block';
                } else {
                    searchClear.style.display = 'none';
                }
            }
            
            console.log('Visible count after search:', visibleCount);
        }
        
        // Add event listeners
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keyup', performSearch);
        
        if (searchClear) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                performSearch();
                searchInput.focus();
            });
        }
        
        console.log('Search event listeners added');
        
        // Add test button functionality
        const testButton = document.getElementById('test-search');
        if (testButton) {
            testButton.addEventListener('click', function() {
                console.log('Test search button clicked');
                searchInput.value = 'test';
                performSearch();
            });
        }
        
    }, 100); // Small delay to ensure DOM is ready
}

/**
 * Show no results message
 */
function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('tr');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.innerHTML = `
            <td colspan="7" class="no-results">
                <div class="empty-state">
                    <p>No jobs found matching your search.</p>
                </div>
            </td>
        `;
        document.querySelector('.jobs-table tbody').appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

/**
 * Initialize animations
 */
function initializeAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.stat-card, .package-item, .detail-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Add slide-in animation to table rows
    const tableRows = document.querySelectorAll('.jobs-table tbody tr');
    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
        row.classList.add('slide-in');
    });
}

/**
 * Enhanced stop job functionality with better UX
 */
function stopJob(jobId) {
    if (!confirm('Are you sure you want to stop this job?')) {
        return;
    }
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const stopButton = document.querySelector(`button[onclick="stopJob(${jobId})"]`);
    
    // Show loading state
    if (stopButton) {
        stopButton.disabled = true;
        stopButton.innerHTML = '<span class="loading-spinner"></span> Stopping...';
    }
    
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
            // Add a small delay before reloading for better UX
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showNotification('Error stopping job: ' + (data.message || 'Unknown error'), 'error');
            // Restore button state
            if (stopButton) {
                stopButton.disabled = false;
                stopButton.innerHTML = 'Stop';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred while stopping the job.', 'error');
        // Restore button state
        if (stopButton) {
            stopButton.disabled = false;
            stopButton.innerHTML = 'Stop';
        }
    });
}

// Fallback search function
function fallbackSearch() {
    console.log('Fallback search function called');
    const searchInput = document.getElementById('job-search');
    const jobsTable = document.querySelector('.jobs-table tbody');
    
    if (!searchInput || !jobsTable) {
        console.log('Fallback search failed - elements not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const rows = jobsTable.querySelectorAll('tr');
    
    console.log('Fallback search:', searchTerm, 'Rows:', rows.length);
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export functions for global use
window.stopJob = stopJob;
window.showNotification = showNotification;
window.fallbackSearch = fallbackSearch;
