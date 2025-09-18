// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
    if (window.sharedUtils && window.sharedUtils.renderNavbar) {
        window.sharedUtils.renderNavbar();
    }
});// Customer Service Functions

// let currentUser 

// Initialize customer service when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    currentUser = getCurrentUser();
    initializeCustomerService();
});

// Initialize all customer service functionality
function initializeCustomerService() {
    initializeEventListeners();
    loadTicketCounter();
    autoFillUserData();
}

// Initialize all event listeners
function initializeEventListeners() {
    // Form submission
    const form = document.getElementById('customerServiceForm');
    if (form) {
        form.addEventListener('submit', submitCustomerServiceForm);
    }

    // Priority change handler
    const prioritySelect = document.getElementById('contactPriority');
    if (prioritySelect) {
        prioritySelect.addEventListener('change', (e) => updatePriorityIndicator(e.target.value));
    }

    // Subject change handler
    const subjectSelect = document.getElementById('contactSubject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', (e) => updateSubjectDescription(e.target.value));
    }

    // Message counter
    const messageTextarea = document.getElementById('contactMessage');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', (e) => updateMessageCounter(e.target.value));
    }

    // Agreement checkbox
    const agreementCheckbox = document.getElementById('contactAgreement');
    if (agreementCheckbox) {
        agreementCheckbox.addEventListener('change', validateForm);
    }
}

// Auto-fill form with user data if logged in
function autoFillUserData() {
    if (currentUser) {
        const nameField = document.getElementById('contactName');
        const emailField = document.getElementById('contactEmail');

        if (nameField && currentUser.firstName && currentUser.lastName) {
            nameField.value = `${currentUser.firstName} ${currentUser.lastName}`;
            nameField.readOnly = true;
        }

        if (emailField && currentUser.email) {
            emailField.value = currentUser.email;
            emailField.readOnly = true;
        }
    }
}

// Update priority indicator
function updatePriorityIndicator(priority) {
    const indicator = document.getElementById('priorityIndicator');
    if (!indicator) return;

    const priorityClasses = {
        'low': 'bg-success',
        'medium': 'bg-warning',
        'high': 'bg-danger',
        'urgent': 'bg-danger'
    };

    const priorityText = priority.toUpperCase();

    // Remove all priority classes
    Object.values(priorityClasses).forEach(cls => indicator.classList.remove(cls));

    // Add new priority class
    indicator.classList.add(priorityClasses[priority] || 'bg-warning');
    indicator.textContent = priorityText;
}

// Update subject description
function updateSubjectDescription(subject) {
    const description = document.getElementById('subjectDescription');
    if (!description) return;

    const descriptions = {
        'technical': 'Describe the technical issue you\'re experiencing in detail.',
        'billing': 'Provide details about your billing question or concern.',
        'feature': 'Tell us about the feature you\'d like to see implemented.',
        'general': 'Ask any general question about our services or products.'
    };

    description.textContent = descriptions[subject] || '';
}

// Update message counter
function updateMessageCounter(message) {
    const counter = document.getElementById('messageCounter');
    const submitBtn = document.querySelector('#customerServiceForm button[type="submit"]');

    if (!counter || !submitBtn) return;

    const length = message.length;
    const minLength = 10;

    counter.textContent = `${length}/${minLength}`;

    if (length >= minLength) {
        counter.classList.remove('text-danger');
        counter.classList.add('text-success');
    } else {
        counter.classList.remove('text-success');
        counter.classList.add('text-danger');
    }

    validateForm();
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('is-invalid');
    field.classList.remove('is-valid');

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }

    // Phone validation
    if (field.name === 'contactPhone' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }

    // Apply validation styling
    if (isValid && value) {
        field.classList.add('is-valid');
    } else if (!isValid) {
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }

    // Add new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone format
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('customerServiceForm');
    if (!form) return false;

    const submitBtn = form.querySelector('button[type="submit"]');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Check agreement
    const agreement = document.getElementById('contactAgreement');
    if (agreement && !agreement.checked) {
        isValid = false;
    }

    // Enable/disable submit button
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }

    return isValid;
}

// Submit customer service form
function submitCustomerServiceForm(event) {
    event.preventDefault();

    if (!validateForm()) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const ticketData = {
        id: generateTicketId(),
        subject: formData.get('contactSubject'),
        priority: formData.get('contactPriority'),
        message: formData.get('contactMessage'),
        customerId: currentUser?.id || 'guest',
        customerEmail: formData.get('contactEmail'),
        customerName: formData.get('contactName'),
        customerPhone: formData.get('contactPhone'),
        category: formData.get('contactCategory'),
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
    };

    submitSupportTicket(ticketData);
}

// Generate unique ticket ID
function generateTicketId() {
    const randomStr = Math.random().toString(36).substr(2, 6);
    return `TKT-${randomStr}`.toUpperCase();
}

// Submit support ticket
function submitSupportTicket(ticketData) {
    // Show loading state
    const submitBtn = document.querySelector('#customerServiceForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Save ticket to localStorage
        saveSupportTicket(ticketData);

        // Reset form and show success
        resetForm();
        showToast('Your message has been sent successfully! We\'ll get back to you soon.', 'success');

        // Send confirmation email (simulated)
        sendConfirmationEmail(ticketData);

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Update ticket counter
        loadTicketCounter();
    }, 2000);
}

// Save support ticket to localStorage
function saveSupportTicket(ticketData) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    tickets.push(ticketData);
    localStorage.setItem('supportTickets', JSON.stringify(tickets));

    // Update admin panel if available
    if (window.adminPanel) {
        window.adminPanel.loadSupportTickets();
    }
}

// Send confirmation email (simulated)
function sendConfirmationEmail(ticketData) {
    showTicketConfirmation(ticketData);
}

// Show ticket confirmation modal
function showTicketConfirmation(ticketData) {
    const modal = `
        <div class="modal fade" id="ticketConfirmationModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="fas fa-check-circle me-2"></i>Ticket Submitted Successfully</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-success">
                            <strong>Ticket ID:</strong> ${ticketData.id}<br>
                            <strong>Subject:</strong> ${ticketData.subject}<br>
                            <strong>Priority:</strong> ${ticketData.priority}<br>
                            <strong>Status:</strong> ${ticketData.status}
                        </div>
                        <p>We've received your message and will respond within 24 hours. You'll receive updates via email.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    document.getElementById('ticketConfirmationModal')?.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modal);

    // Show modal
    const modalElement = new bootstrap.Modal(document.getElementById('ticketConfirmationModal'));
    modalElement.show();
}

// Reset form
function resetForm() {
    const form = document.getElementById('customerServiceForm');
    if (form) {
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });

        // Reset message counter
        const messageCounter = document.getElementById('messageCounter');
        if (messageCounter) {
            messageCounter.textContent = '0/10';
            messageCounter.classList.remove('text-success');
            messageCounter.classList.add('text-danger');
        }

        // Reset priority indicator
        updatePriorityIndicator('medium');

        // Clear subject description
        const subjectDescription = document.getElementById('subjectDescription');
        if (subjectDescription) {
            subjectDescription.textContent = '';
        }

        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
    }
}

// Load ticket counter
function loadTicketCounter() {
    const counter = document.getElementById('ticketCounter');
    if (!counter) return;

    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const userTickets = currentUser
        ? tickets.filter(ticket => ticket.customerId === currentUser.id)
        : tickets.filter(ticket => ticket.customerEmail === document.getElementById('contactEmail')?.value);

    counter.textContent = userTickets.length;
}

// View my tickets
function viewMyTickets() {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const userTickets = currentUser
        ? tickets.filter(ticket => ticket.customerId === currentUser.id)
        : tickets.filter(ticket => ticket.customerEmail === document.getElementById('contactEmail')?.value);

    if (userTickets.length === 0) {
        showToast('No tickets found. Please submit a ticket first.', 'info');
        return;
    }

    // Separate open and closed tickets
    const openTickets = userTickets.filter(ticket => ticket.status !== 'closed');
    const closedTickets = userTickets.filter(ticket => ticket.status === 'closed');

    showTicketsModal(openTickets, closedTickets);
}

// Show tickets modal
function showTicketsModal(openTickets, closedTickets = []) {
    const modal = `
        <div class="modal fade" id="ticketsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-ticket-alt me-2"></i>My Support Tickets</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Open Tickets Section -->
                        <div class="mb-4">
                            <h6 class="text-primary mb-3">
                                <i class="fas fa-folder-open me-2"></i>Open Tickets (${openTickets.length})
                            </h6>
                            ${openTickets.length > 0 ? `
                                <div class="row">
                                    ${openTickets.map(ticket => `
                                        <div class="col-12 mb-3">
                                            <div class="card ticket-card border-primary">
                                                <div class="card-body">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 class="card-title mb-0">${ticket.subject}</h6>
                                                        <span class="badge bg-${getPriorityColor(ticket.priority)}">${ticket.priority.toUpperCase()}</span>
                                                    </div>
                                                    <p class="card-text text-muted mb-2">${ticket.message.substring(0, 100)}${ticket.message.length > 100 ? '...' : ''}</p>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <small class="text-muted">
                                                            <i class="fas fa-calendar me-1"></i>
                                                            ${new Date(ticket.createdAt).toLocaleDateString()}
                                                        </small>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <span class="badge bg-${getStatusColor(ticket.status)}">${ticket.status.toUpperCase()}</span>
                                                            ${ticket.responses && ticket.responses.length > 0 ?
            `<span class="badge bg-info"><i class="fas fa-comments me-1"></i>${ticket.responses.length} responses</span>` :
            '<span class="badge bg-secondary"><i class="fas fa-comment me-1"></i>No responses</span>'
        }
                                                        </div>
                                                    </div>
                                                    <div class="mt-3">
                                                        <button class="btn btn-outline-primary btn-sm" onclick="viewTicketDetails('${ticket.id}')">
                                                            <i class="fas fa-eye me-1"></i>View Details & Responses
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<div class="text-center text-muted py-3">No open tickets found.</div>'}
                        </div>

                        <!-- Closed Tickets Section -->
                        ${closedTickets.length > 0 ? `
                            <div class="mb-4">
                                <h6 class="text-secondary mb-3">
                                    <i class="fas fa-folder me-2"></i>Closed Tickets (${closedTickets.length})
                                </h6>
                                <div class="row">
                                    ${closedTickets.map(ticket => `
                                        <div class="col-12 mb-3">
                                            <div class="card ticket-card border-secondary opacity-75">
                                                <div class="card-body">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 class="card-title mb-0">${ticket.subject}</h6>
                                                        <span class="badge bg-${getPriorityColor(ticket.priority)}">${ticket.priority.toUpperCase()}</span>
                                                    </div>
                                                    <p class="card-text text-muted mb-2">${ticket.message.substring(0, 100)}${ticket.message.length > 100 ? '...' : ''}</p>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <small class="text-muted">
                                                            <i class="fas fa-calendar me-1"></i>
                                                            ${new Date(ticket.createdAt).toLocaleDateString()}
                                                        </small>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <span class="badge bg-${getStatusColor(ticket.status)}">${ticket.status.toUpperCase()}</span>
                                                            ${ticket.responses && ticket.responses.length > 0 ?
                `<span class="badge bg-info"><i class="fas fa-comments me-1"></i>${ticket.responses.length} responses</span>` :
                '<span class="badge bg-secondary"><i class="fas fa-comment me-1"></i>No responses</span>'
            }
                                                        </div>
                                                    </div>
                                                    <div class="mt-3">
                                                        <button class="btn btn-outline-secondary btn-sm" onclick="viewTicketDetails('${ticket.id}')">
                                                            <i class="fas fa-eye me-1"></i>View Details & Responses
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    document.getElementById('ticketsModal')?.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modal);

    // Show modal
    const modalElement = new bootstrap.Modal(document.getElementById('ticketsModal'));
    modalElement.show();
}

// View ticket details with responses
function viewTicketDetails(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) {
        showToast('Ticket not found', 'error');
        return;
    }

    showTicketDetailsModal(ticket);
}

// Show ticket details modal with responses
function showTicketDetailsModal(ticket) {
    const modal = `
        <div class="modal fade" id="ticketDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-ticket-alt me-2"></i>Ticket Details: ${ticket.subject}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Ticket Information -->
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>Ticket Information</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Ticket ID:</strong></div>
                                            <div class="col-8">${ticket.id}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Status:</strong></div>
                                            <div class="col-8">
                                                <span class="badge bg-${getStatusColor(ticket.status)}">${ticket.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Priority:</strong></div>
                                            <div class="col-8">
                                                <span class="badge bg-${getPriorityColor(ticket.priority)}">${ticket.priority.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Category:</strong></div>
                                            <div class="col-8">${ticket.category || 'General'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Created:</strong></div>
                                            <div class="col-8">${new Date(ticket.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Updated:</strong></div>
                                            <div class="col-8">${new Date(ticket.updatedAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0"><i class="fas fa-user me-2"></i>Customer Information</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Name:</strong></div>
                                            <div class="col-8">${ticket.customerName}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Email:</strong></div>
                                            <div class="col-8">${ticket.customerEmail}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-4"><strong>Phone:</strong></div>
                                            <div class="col-8">${ticket.customerPhone || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Original Message -->
                        <div class="card mb-4">
                            <div class="card-header bg-primary text-white">
                                <h6 class="mb-0"><i class="fas fa-comment me-2"></i>Original Message</h6>
                            </div>
                            <div class="card-body">
                                <p class="mb-0">${ticket.message}</p>
                            </div>
                        </div>

                        <!-- Responses Section -->
                        <div class="card mb-4">
                            <div class="card-header bg-success text-white">
                                <h6 class="mb-0"><i class="fas fa-reply me-2"></i>Responses & Updates</h6>
                            </div>
                            <div class="card-body">
                                ${ticket.responses && ticket.responses.length > 0 ?
            ticket.responses.map(response => `
                                        <div class="response-item mb-3 p-3 border rounded ${response.isAdmin ? 'bg-light' : 'bg-info text-white'}">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <strong>${response.isAdmin ? 'Support Team' : 'You'}</strong>
                                                    <small class="ms-2 text-muted">${new Date(response.timestamp).toLocaleString()}</small>
                                                </div>
                                                ${response.isAdmin ? '<span class="badge bg-primary">Admin Response</span>' : '<span class="badge bg-info">Customer Reply</span>'}
                                            </div>
                                            <p class="mb-0">${response.message}</p>
                                        </div>
                                    `).join('') :
            '<div class="text-center text-muted py-3">No responses yet. Our support team will respond soon.</div>'
        }
                            </div>
                        </div>

                        <!-- Reply Form -->
                        <div class="card">
                            <div class="card-header bg-warning text-dark">
                                <h6 class="mb-0"><i class="fas fa-reply me-2"></i>Add Your Reply</h6>
                            </div>
                            <div class="card-body">
                                <form id="replyForm" onsubmit="submitReply(event, '${ticket.id}')">
                                    <div class="mb-3">
                                        <label for="replyMessage" class="form-label">Your Message:</label>
                                        <textarea class="form-control" id="replyMessage" name="replyMessage" rows="4" 
                                            placeholder="Type your reply here..." required minlength="10"></textarea>
                                        <div class="form-text">Minimum 10 characters required</div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-paper-plane me-2"></i>Send Reply
                                        </button>
                                        <div class="d-flex align-items-center gap-2">
                                            <small class="text-muted">Your reply will be sent to our support team</small>
                                            ${ticket.status !== 'closed' ?
            `<button type="button" class="btn btn-outline-danger btn-sm" onclick="closeTicket('${ticket.id}')">
                                                    <i class="fas fa-times-circle me-1"></i>Close Ticket
                                                </button>` : ''
        }
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    document.getElementById('ticketDetailsModal')?.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modal);

    // Show modal
    const modalElement = new bootstrap.Modal(document.getElementById('ticketDetailsModal'));
    modalElement.show();
}

// Submit reply to ticket
function submitReply(event, ticketId) {
    event.preventDefault();

    const replyMessage = document.getElementById('replyMessage').value.trim();

    if (replyMessage.length < 10) {
        showToast('Reply message must be at least 10 characters long', 'error');
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        // Get tickets from localStorage
        const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);

        if (ticketIndex === -1) {
            showToast('Ticket not found', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Create reply object
        const reply = {
            id: generateResponseId(),
            message: replyMessage,
            timestamp: new Date().toISOString(),
            isAdmin: false,
            customerId: currentUser?.id || 'guest',
            customerEmail: currentUser?.email || document.getElementById('contactEmail')?.value
        };

        // Add reply to ticket
        tickets[ticketIndex].responses.push(reply);
        tickets[ticketIndex].updatedAt = new Date().toISOString();
        tickets[ticketIndex].status = 'in-progress'; // Update status to show customer has replied

        // Save updated tickets
        localStorage.setItem('supportTickets', JSON.stringify(tickets));

        // Update admin panel if available
        if (window.adminPanel) {
            window.adminPanel.loadSupportTickets();
        }

        // Show success message
        showToast('Your reply has been sent successfully!', 'success');

        // Clear form
        document.getElementById('replyMessage').value = '';

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Update ticket counter
        loadTicketCounter();

        // Refresh the modal to show the new reply
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('ticketDetailsModal'));
            if (modal) {
                modal.hide();
            }
            viewTicketDetails(ticketId);
        }, 1000);
    }, 1000);
}

// Close ticket
function closeTicket(ticketId) {
    if (!confirm('Are you sure you want to close this ticket? You won\'t be able to add more replies.')) {
        return;
    }

    // Get tickets from localStorage
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) {
        showToast('Ticket not found', 'error');
        return;
    }

    // Update ticket status
    tickets[ticketIndex].status = 'closed';
    tickets[ticketIndex].updatedAt = new Date().toISOString();

    // Save updated tickets
    localStorage.setItem('supportTickets', JSON.stringify(tickets));

    // Update admin panel if available
    if (window.adminPanel) {
        window.adminPanel.loadSupportTickets();
    }

    // Show success message
    showToast('Ticket has been closed successfully!', 'success');

    // Refresh the modal to show updated status
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('ticketDetailsModal'));
        if (modal) {
            modal.hide();
        }
        viewTicketDetails(ticketId);
    }, 1000);
}

// Generate unique response ID
function generateResponseId() {
    const randomStr = Math.random().toString(36).substr(2, 8);
    return `RESP-${randomStr}`.toUpperCase();
}

// Get priority color
function getPriorityColor(priority) {
    const colors = {
        'low': 'success',
        'medium': 'warning',
        'high': 'danger',
        'urgent': 'danger'
    };
    return colors[priority] || 'warning';
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'open': 'primary',
        'in-progress': 'warning',
        'resolved': 'success',
        'closed': 'secondary'
    };
    return colors[status] || 'primary';
}

// Toast notification function
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const toast = `
        <div id="${toastId}" class="toast show bg-${type} text-white" role="alert">
            <div class="toast-body d-flex align-items-center">
                <i class="fas fa-${getToastIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toast);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.remove();
        }
    }, 5000);
}

// Get toast icon based on type
function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Global function for scroll to form
function scrollToForm() {
    document.getElementById('supportFormSection').scrollIntoView({
        behavior: 'smooth'
    });
}
