// Note: Orders are read-only and loaded from invoices
// Admin can view, print, and export order data but cannot modify order status

// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
    if (window.sharedUtils && window.sharedUtils.renderNavbar) {
        window.sharedUtils.renderNavbar();
    }
});
if (!localStorage.getItem("currentUser") || currentUser.role !== "admin") {

    showNotification("You are not authorized to access this page", "danger");
    // window.location.href = "../../index.html";
} else {
    showNotification("Welcome to the admin dashboard", "success");
}
// Admin Dashboard
let currentSection = 'dashboard';
let data = {
    users: [],
    products: [],
    orders: [],
    tickets: [],
    activities: []
};

let adUsers = users

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
});

// Main initialization function
async function init() {
    try {
        await loadData();
        initializeCharts();
        initializeNavigation();
        initializeEventListeners();
        updateDashboard();
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to initialize dashboard', 'danger');
    }
}

// Load data from localStorage or create sample data
function loadData() {
    const storageKeys = ['adUsers', 'products', 'admin_orders', 'supportTickets', 'admin_activities'];
    const dataKeys = ['users', 'products', 'orders', 'tickets', 'activities'];


    dataKeys.forEach((key, index) => {
        if (key === 'users') {
            if (localStorage.getItem('adUsers')) {
                data[key] = [...adUsers];
            } else {
                data[key] = [...users];
            }
        } else if (key === 'products') {
            if (localStorage.getItem('products')) {
                data[key] = [...products];
            } else {
                data[key] = [...products];
            }
        } else {
            data[key] = getItemFromLocalStorage(storageKeys[index]) ?? [];
        }
    });

    // Add sample activities if none exist
    if (!data.activities || data.activities.length === 0) {
        data.activities = [
            {
                id: 'A001',
                type: 'dashboard_loaded',
                message: 'Admin dashboard initialized successfully',
                timestamp: new Date().toLocaleString()
            },
            {
                id: 'A002',
                type: 'system_ready',
                message: 'All systems are operational',
                timestamp: new Date().toLocaleString()
            }
        ];
    }

    saveData();
}

// Create sample data based on type


// Save data to localStorage
function saveData() {
    const storageKeys = ['adUsers', 'products', 'admin_orders', 'supportTickets', 'admin_activities'];
    const dataKeys = ['users', 'products', 'orders', 'tickets', 'activities'];

    dataKeys.forEach((key, index) => {
        setItemToLocalStorage(storageKeys[index], data[key]);
    });
}

// Initialize Navigation
function initializeNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const pageInfo = new Map([
        ['dashboard', { title: 'Dashboard', subtitle: 'System overview and analytics' }],
        ['users', { title: 'User Management', subtitle: 'Manage user accounts and permissions' }],
        ['products', { title: 'Product Moderation', subtitle: 'Review and moderate product listings' }],
        ['orders', { title: 'Order Management', subtitle: 'Track and manage customer orders' }],
        ['support', { title: 'Customer Service', subtitle: 'Handle support tickets and inquiries' }]
    ]);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            sidebarLinks.forEach(s => s.classList.remove('active'));
            link.classList.add('active');

            const section = link.getAttribute('data-section');
            currentSection = section;

            const info = pageInfo.get(section);
            if (info) {
                pageTitle.textContent = info.title;
                pageSubtitle.textContent = info.subtitle;
            }

            showSection(section);
        });
    });
}

// Initialize Event Listeners
function initializeEventListeners() {
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addUser();
        });
    }

    // Initialize ticket modal
    initializeTicketModal();
}

// Show selected section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        loadSectionData(sectionName);
    }
}

// Load section-specific data
function loadSectionData(section) {
    const sectionHandlers = new Map([
        ['dashboard', () => updateDashboard()],
        ['users', () => loadUsers()],
        ['products', () => loadProducts()],
        ['orders', () => loadOrders()],
        ['support', () => {
            refreshTickets();
            loadTickets();

        }]
    ]);

    const handler = sectionHandlers.get(section);
    if (handler) handler();
}

// Update dashboard statistics
function updateDashboard() {
    const ticketStats = getTicketStats();
    getUserCounts();
    
    // Get order statistics from invoices
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const totalOrders = invoices.length;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.total || 0), 0);
    
    const elements = {
        totalUsers: data.users.length -1,
        totalProducts: data.products.length,
        totalOrders: totalOrders,
        pendingTickets: ticketStats.open,
        totalTickets: ticketStats.total,
        resolvedTickets: ticketStats.resolved,
        avgResponseTime: ticketStats.avgResponseTime,
        responseRate: ticketStats.responseRate
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'avgResponseTime') {
                element.textContent = `${value}h`;
            } else if (id === 'responseRate') {
                element.textContent = `${value}%`;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update ticket priority breakdown if element exists
    const priorityBreakdown = document.getElementById('ticketPriorityBreakdown');
    if (priorityBreakdown) {
        priorityBreakdown.innerHTML = `
            <div class="row text-center">
                <div class="col">
                    <div class="bg-danger text-white p-2 rounded">
                        <strong>${ticketStats.urgent}</strong><br>
                        <small>Urgent</small>
                    </div>
                </div>
                <div class="col">
                    <div class="bg-warning text-dark p-2 rounded">
                        <strong>${ticketStats.high}</strong><br>
                        <small>High</small>
                    </div>
                </div>
                <div class="col">
                    <div class="bg-info text-white p-2 rounded">
                        <strong>${ticketStats.medium}</strong><br>
                        <small>Medium</small>
                    </div>
                </div>
                <div class="col">
                    <div class="bg-success text-white p-2 rounded">
                        <strong>${ticketStats.low}</strong><br>
                        <small>Low</small>
                    </div>
                </div>
            </div>
        `;
    }

    // Update dashboard order statistics
    const dashboardTotalOrders = document.getElementById('dashboardTotalOrders');
    const dashboardTotalRevenue = document.getElementById('dashboardTotalRevenue');
    
    if (dashboardTotalOrders) dashboardTotalOrders.textContent = totalOrders;
    if (dashboardTotalRevenue) dashboardTotalRevenue.textContent = `$${totalRevenue.toFixed(2)}`;

    // Load recent activities
    loadActivityList();
}

// Load users table
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    if (!data.users || data.users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                        <p class="mb-0">No users found</p>
                </td>
            </tr>
        `;
        return;
    }
    // console.log(data.users);
    getUserCounts()
    tbody.innerHTML = data.users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName || ''}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-${getRoleBadgeColor(user.role)}">${user.role}</span></td>
            <td><span class="badge bg-${getStatusBadgeColor(user.status)}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editUser('${user.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="resetPassword('${user.id}')">
                    <i class="bi bi-key"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeUser('${user.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load products table
function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    if (!data.products || data.products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p class="mb-0">No products found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${data.users.find(u => u.id === product.sellerId)?.firstName} ${data.users.find(u => u.id === product.sellerId)?.lastName}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td><span class="badge bg-${getProductStatusBadgeColor(product.adminReview.status)}">${product.adminReview.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewProduct('${product.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success me-1" onclick="approveProduct('${product.id}')" ${product.adminReview.status === 'approved' ? 'disabled' : ''}>
                    <i class="bi bi-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="rejectProduct('${product.id}')" ${product.adminReview.status === 'rejected' ? 'disabled' : ''}>
                    <i class="bi bi-x"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load orders table
function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    // Load orders from invoices
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    
    if (invoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p class="mb-0">No orders found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = invoices.map(invoice => {
        const orderDate = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'Unknown';
        
        return `
            <tr>
                <td><strong>#${invoice.id}</strong></td>
                <td>
                    <div>
                        <strong>${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</strong><br>
                        <small class="text-muted">${invoice.userInfo.email}</small>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        ${invoice.items.map(item => 
                            `<span class="badge bg-light text-dark">${item.name} x${item.qty}</span>`
                        ).join('')}
                    </div>
                </td>
                <td><strong>$${invoice.total}</strong></td>
                <td><span class="badge bg-success">Completed</span></td>
                <td><small class="text-muted">${orderDate}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewOrder('${invoice.id}')" title="View Order Details">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    loadActivityList();
}

// Load tickets table
function loadTickets() {
    const tbody = document.getElementById('ticketsTableBody');
    if (!tbody) {
        console.log('Tickets table body not found');
        return;
    }

    console.log('Loading tickets:', data.tickets);

    if (!data.tickets || data.tickets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p class="mb-0">No support tickets found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.tickets.map(ticket => {
        const createdDate = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown';
        const updatedDate = ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'Unknown';
        const responseCount = ticket.responses ? ticket.responses.length : 0;
        const lastResponse = ticket.responses && ticket.responses.length > 0 ?
            new Date(ticket.responses[ticket.responses.length - 1].timestamp || ticket.responses[ticket.responses.length - 1]).toLocaleString() :
            'No responses';

        return `
            <tr class="${ticket.status === 'closed' ? 'table-secondary' : ''}">
                <td>
                    <div class="d-flex flex-column">
                        <strong>${ticket.id || 'Unknown'}</strong>
                        <small class="text-muted">${ticket.category || 'General'}</small>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <strong>${ticket.customerName || ticket.customer || 'Unknown'}</strong>
                        <small class="text-muted">${ticket.customerEmail || 'No email'}</small>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <strong>${ticket.subject || 'No subject'}</strong>
                        <small class="text-muted text-truncate" style="max-width: 200px;" title="${ticket.message || ''}">
                            ${(ticket.message || '').substring(0, 50)}${(ticket.message || '').length > 50 ? '...' : ''}
                        </small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${getPriorityBadgeColor(ticket.priority)}">
                        <i class="bi bi-flag me-1"></i>${ticket.priority || 'Unknown'}
                    </span>
                </td>
                <td>
                    <span class="badge bg-${getTicketStatusBadgeColor(ticket.status)}">
                        <i class="bi bi-circle-fill me-1"></i>${ticket.status || 'Unknown'}
                    </span>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <small><i class="bi bi-calendar me-1"></i>${createdDate}</small>
                        <small class="text-muted"><i class="bi bi-clock me-1"></i>${updatedDate}</small>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column align-items-center">
                        <span class="badge bg-info mb-1">
                            <i class="bi bi-chat me-1"></i>${responseCount} responses
                        </span>
                        <small class="text-muted">${lastResponse}</small>
                    </div>
                </td>
                <td>
                    <div class="btn-group-vertical btn-group-sm">
                        <button class="btn btn-outline-primary mb-1" onclick="viewTicket('${ticket.id}')" title="View Details">
                            <i class="bi bi-eye"></i> View
                        </button>
                        <button class="btn btn-outline-success" onclick="respondToTicket('${ticket.id}')" title="Respond to Ticket">
                            <i class="bi bi-reply"></i> Respond
                        </button>
                    </td>
            </tr>
        `;
    }).join('');
}

// Load activity list
function loadActivityList() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    if (!data.activities || data.activities.length === 0) {
        activityList.innerHTML = `
            <div class="list-group-item border-0 px-0 text-center text-muted">
                <i class="bi bi-info-circle me-2"></i>
                <small>No recent activities</small>
            </div>
        `;
        return;
    }

    activityList.innerHTML = data.activities
        .slice(0, 5)
        .map(activity => `
            <div class="list-group-item border-0 px-0">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${activity.type.replace('_', ' ').toUpperCase()}</h6>
                    <small class="text-muted">${activity.timestamp}</small>
                </div>
                <p class="mb-1">${activity.message}</p>
            </div>
        `).join('');
}

// Utility functions for badge colors using Map for better performance
const badgeColors = new Map([
    ['role', new Map([
        ['user', 'secondary'],
        ['seller', 'info'],
        ['admin', 'danger']
    ])],
    ['status', new Map([
        ['active', 'success'],
        ['inactive', 'secondary'],
        ['pending', 'warning']
    ])],
    ['productStatus', new Map([
        ['pending', 'warning'],
        ['approved', 'success'],
        ['rejected', 'danger']
    ])],
    ['orderStatus', new Map([
        ['pending', 'warning'],
        ['processing', 'info'],
        ['completed', 'success'],
        ['cancelled', 'danger']
    ])],
    ['priority', new Map([
        ['low', 'success'],
        ['medium', 'warning'],
        ['high', 'danger']
    ])],
    ['ticketStatus', new Map([
        ['open', 'warning'],
        ['in-progress', 'info'],
        ['resolved', 'success']
    ])]
]);

function getRoleBadgeColor(role) {
    return badgeColors.get('role').get(role) ?? 'secondary';
}

function getStatusBadgeColor(status) {
    return badgeColors.get('status').get(status) ?? 'secondary';
}

function getProductStatusBadgeColor(status) {
    return badgeColors.get('productStatus').get(status) ?? 'secondary';
}

function getOrderStatusBadgeColor(status) {
    return badgeColors.get('orderStatus').get(status) ?? 'secondary';
}

function getPriorityBadgeColor(priority) {
    return badgeColors.get('priority').get(priority) ?? 'secondary';
}

function getTicketStatusBadgeColor(status) {
    return badgeColors.get('ticketStatus').get(status) ?? 'secondary';
}

// User Management Functions
function addUser() {
    const formData = {
        name: document.getElementById('userName')?.value,
        email: document.getElementById('userEmail')?.value,
        role: document.getElementById('userRole')?.value,
        password: document.getElementById('userPassword')?.value
    };

    if (Object.values(formData).some(value => !value)) {
        showNotification('Please fill all fields', 'warning');
        return;
    }

    const newUser = {
        id: `U${String(data.users.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'active',
        password: btoa(formData.password), // Simple encoding (use proper hashing in production)
        createdAt: new Date().toISOString().split('T')[0]
    };

    data.users.push(newUser);
    saveData();
    loadUsers();
    updateDashboard();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal?.hide();

    // Clear form
    document.getElementById('addUserForm')?.reset();

    showNotification('User added successfully', 'success');
    addActivity('user_added', `New user ${formData.name} added`);
}

function editUser(userId) {
    const user = data.users.find(u => u.id === +userId);
    if (user) {
        // Populate the edit form with user data
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.firstName + ' ' + user.lastName;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.status;
        document.getElementById('editUserPassword').value = ''; // Clear password field

        // Show the edit modal
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    } else {
        showNotification('User not found', 'danger');
    }
}

function updateUser() {
    const userId = +document.getElementById('editUserId').value;
    const formData = {
        name: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        role: document.getElementById('editUserRole').value,
        status: document.getElementById('editUserStatus').value,
        password: document.getElementById('editUserPassword').value
    };

    if (!formData.name || !formData.email || !formData.role || !formData.status) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        const user = data.users[userIndex];
        const oldName = user.firstName;

        // Update user data
        user.firstName = formData.name;
        user.email = formData.email;
        user.role = formData.role;
        user.status = formData.status;

        // Update password only if a new one is provided
        if (formData.password.trim()) {
            user.password = btoa(formData.password); // Simple encoding (use proper hashing in production)
        }

        // Update timestamp
        user.updatedAt = new Date().toISOString().split('T')[0];

        saveData();
        loadUsers();
        updateDashboard();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal?.hide();

        // Clear form
        document.getElementById('editUserForm')?.reset();

        showNotification(`User ${oldName} updated successfully`, 'success');
        addActivity('user_updated', `User ${oldName} updated`);
    } else {
        showNotification('User not found', 'danger');
    }
}

function resetPassword(userId) {
    const user = data.users.find(u => u.id === userId);
    if (user) {
        const newPassword = Math.random().toString(36).slice(-8);
        user.password = btoa(newPassword);
        saveData();
        showNotification(`Password reset for ${user.name}. New password: ${newPassword}`, 'success');
        addActivity('password_reset', `Password reset for user ${user.name}`);
    }
}

function removeUser(userId) {
    if (confirm('Are you sure you want to remove this user?')) {
        const userIndex = data.users.findIndex(u => u.id === +userId);
        if (userIndex > -1) {
            const userName = data.users[userIndex].firstName + ' ' + data.users[userIndex].lastName;
            data.users.splice(userIndex, 1);
            saveData();
            loadUsers();
            updateDashboard();
            showNotification(`User ${userName} removed`, 'success');
            addActivity('user_removed', `User ${userName} removed`);
        }
    }
}

// Product Management Functions
function viewProduct(productId) {
    const product = data.products.find(p => p.id === +productId);
    if (product) {
        // Store the current product ID globally for approve/reject functions
        window.currentProductId = productId;

        const modal = new bootstrap.Modal(document.getElementById('productReviewModal'));
        document.getElementById('productReviewContent').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Product Details</h6>
                    <p><strong>Name:</strong> ${product.name}</p>
                    <p><strong>Seller:</strong> ${data.users.find(u => u.id === product.sellerId)?.firstName} ${data.users.find(u => u.id === product.sellerId)?.lastName}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Status:</strong> ${product.adminReview.status}</p>
                    <p><strong>Created:</strong> ${product.createdAt}</p>
                </div>
                <div class="col-md-6">
                    <h6>Description</h6>
                    <p>${product.description}</p>
                </div>
            </div>
        `;
        // modal.setAttribute('data-product-id', product.id);
        modal.show()
            ;
    }
}

function approveProduct(productId) {
    const product = data.products.find(p => p.id === +productId);
    if (product) {
        product.adminReview.status = 'approved';
        saveData();
        loadProducts();
        showNotification(`Product ${product.name} approved`, 'success');
        addActivity('product_approved', `Product ${product.name} approved`);
    }
}

function rejectProduct(productId) {
    const product = data.products.find(p => p.id === +productId);
    if (product) {
        product.adminReview.status = 'rejected';
        saveData();
        loadProducts();
        showNotification(`Product ${product.name} rejected`, 'warning');
        addActivity('product_rejected', `Product ${product.name} rejected`);
    }
}

// Order Management Functions
function viewOrder(orderId) {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = invoices.find(inv => inv.id === orderId);
    
    if (invoice) {
        // Create a modal to show order details
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'orderDetailsModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order #${invoice.id} Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <h6>Customer Information</h6>
                                <p><strong>Name:</strong> ${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</p>
                                <p><strong>Email:</strong> ${invoice.userInfo.email}</p>
                                <p><strong>Address:</strong> ${invoice.address || 'Not provided'}</p>
                                <p><strong>Phone:</strong> ${invoice.phone || 'Not provided'}</p>
                            </div>
                            <div class="col-md-4">
                                <h6>Order Information</h6>
                                <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
                                <p><strong>Shipping:</strong> ${invoice.shippingMethod || 'Standard'}</p>
                                <p><strong>Payment:</strong> ${invoice.paymentMethod || 'Credit Card'}</p>
                                <p><strong>Status:</strong> <span class="badge bg-success">Completed</span></p>
                            </div>
                            <div class="col-md-4">
                                <h6>Financial Summary</h6>
                                <p><strong>Subtotal:</strong> $${(invoice.total - (invoice.tax || 0) - (invoice.shippingCost || 0)).toFixed(2)}</p>
                                <p><strong>Tax:</strong> $${invoice.tax || 0}</p>
                                <p><strong>Shipping:</strong> $${invoice.shippingCost || 0}</p>
                                <p><strong>Total:</strong> <strong>$${invoice.total}</strong></p>
                            </div>
                        </div>
                        
                        <h6>Products Ordered</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoice.items.map(item => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>${item.qty}</td>
                                            <td>$${item.price}</td>
                                            <td>$${(item.price * item.qty).toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    } else {
        showNotification('Order not found', 'warning');
    }
}

// Note: Orders are read-only. Admin can view order details but cannot modify order status.
// console.log(data.tickets);

// Ticket Management Functions
function viewTicket(ticketId) {
    if (!ticketId) {
        showNotification('Invalid ticket ID', 'error');
        return;
    }

    const ticket = data.tickets.find(t => t.id === ticketId);
    if (ticket) {
        const modalElement = document.getElementById('ticketResponseModal');
        const ticketDetailsElement = document.getElementById('ticketDetails');
        const ticketStatusElement = document.getElementById('ticketStatus');
        const ticketPriorityElement = document.getElementById('ticketPriority');
        const ticketCategoryElement = document.getElementById('ticketCategory');

        if (!modalElement || !ticketDetailsElement || !ticketStatusElement) {
            showNotification('Modal elements not found', 'error');
            return;
        }

        try {
            const modal = new bootstrap.Modal(modalElement);

            // Format the creation and update dates
            const createdDate = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown';
            const updatedDate = ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'Unknown';

            // Format responses for better display
            let responsesHtml = '';
            if (ticket.responses && ticket.responses.length > 0) {
                responsesHtml = `
                    <hr>
                    <h6 class="text-primary mb-3">
                        <i class="bi bi-chat-dots me-2"></i>Conversation History (${ticket.responses.length} responses)
                    </h6>
                    <div class="conversation-history" style="max-height: 300px; overflow-y: auto;">
                        ${ticket.responses.map((response, index) => {
                    if (typeof response === 'string') {
                        // Handle old format responses
                        return `<div class="response-item mb-2 p-2 bg-light rounded">
                                    <small class="text-muted">${response}</small>
                                </div>`;
                    } else {
                        // Handle new format responses
                        return `<div class="response-item mb-3 p-3 border rounded ${response.isAdmin ? 'bg-primary text-white' : 'bg-light'}">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <strong>${response.isAdmin ? 'Support Team' : 'Customer'}</strong>
                                            <small class="ms-2 ${response.isAdmin ? 'text-white-50' : 'text-muted'}">
                                                ${new Date(response.timestamp).toLocaleString()}
                                            </small>
                                        </div>
                                        <span class="badge ${response.isAdmin ? 'bg-light text-primary' : 'bg-primary'}">
                                            ${response.isAdmin ? 'Admin' : 'Customer'}
                                        </span>
                                    </div>
                                    <p class="mb-0">${response.message}</p>
                                </div>`;
                    }
                }).join('')}
                    </div>
                `;
            }

            ticketDetailsElement.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-info-circle me-2"></i>Ticket Information</h6>
                            </div>
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-4"><strong>ID:</strong></div>
                                    <div class="col-8"><code>${ticket.id}</code></div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Subject:</strong></div>
                                    <div class="col-8">${ticket.subject || 'No subject'}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Category:</strong></div>
                                    <div class="col-8">${ticket.category || 'General'}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Created:</strong></div>
                                    <div class="col-8">${createdDate}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Updated:</strong></div>
                                    <div class="col-8">${updatedDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-person me-2"></i>Customer Information</h6>
                            </div>
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Name:</strong></div>
                                    <div class="col-8">${ticket.customerName || ticket.customer || 'Unknown'}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Email:</strong></div>
                                    <div class="col-8">${ticket.customerEmail || 'Not provided'}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Phone:</strong></div>
                                    <div class="col-8">${ticket.customerPhone || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-chat me-2"></i>Original Message</h6>
                    </div>
                    <div class="card-body">
                        <p class="mb-0">${ticket.message || 'No message'}</p>
                    </div>
                </div>
                
                ${responsesHtml}
            `;

            // Set form values
            ticketStatusElement.value = ticket.status;
            if (ticketPriorityElement) ticketPriorityElement.value = ticket.priority;
            if (ticketCategoryElement) ticketCategoryElement.value = ticket.category || 'general';

            // Store the current ticket ID for the update function
            modalElement.setAttribute('data-current-ticket-id', ticketId);

            modal.show();
        } catch (error) {
            console.error('Error showing ticket modal:', error);
            showNotification('Failed to open ticket modal', 'error');
        }
    } else {
        showNotification('Ticket not found', 'error');
    }
}

function respondToTicket(ticketId) {
    if (!ticketId) {
        showNotification('Invalid ticket ID', 'error');
        return;
    }

    // Clear previous response and set current ticket ID
    const responseField = document.getElementById('adminResponse');
    const modalElement = document.getElementById('ticketResponseModal');

    if (!responseField || !modalElement) {
        showNotification('Modal elements not found', 'error');
        return;
    }

    try {
        responseField.value = '';
        modalElement.setAttribute('data-current-ticket-id', ticketId);
        viewTicket(ticketId);
    } catch (error) {
        console.error('Error preparing ticket response:', error);
        showNotification('Failed to prepare ticket response', 'error');
    }
}

function updateTicket() {
    const ticketId = getCurrentTicketId();
    const response = document.getElementById('adminResponse')?.value;
    const status = document.getElementById('ticketStatus')?.value;
    const priority = document.getElementById('ticketPriority')?.value;
    const category = document.getElementById('ticketCategory')?.value;

    if (!response?.trim()) {
        showNotification('Please provide a response', 'warning');
        return;
    }

    if (!ticketId) {
        showNotification('No ticket selected', 'error');
        return;
    }

    const ticket = data.tickets.find(t => t.id === ticketId);
    if (ticket) {
        try {
            // Initialize responses array if it doesn't exist
            if (!ticket.responses) {
                ticket.responses = [];
            }

            // Create new response object with proper structure
            const newResponse = {
                id: generateResponseId(),
                message: response.trim(),
                timestamp: new Date().toISOString(),
                isAdmin: true,
                adminId: currentUser?.id || 'admin',
                adminName: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Support Team'
            };

            // Add response to ticket
            ticket.responses.push(newResponse);

            // Update ticket properties
            ticket.status = status;
            ticket.priority = priority || ticket.priority;
            ticket.category = category || ticket.category;
            ticket.updatedAt = new Date().toISOString();
            ticket.lastAdminResponse = new Date().toISOString();

            // Update the ticket in localStorage
            const tickets = getItemFromLocalStorage('supportTickets') || [];
            const ticketIndex = tickets.findIndex(t => t.id === ticketId);
            if (ticketIndex !== -1) {
                tickets[ticketIndex] = ticket;
                setItemToLocalStorage('supportTickets', tickets);
            }

            // Update local data and refresh display
            data.tickets = tickets;
            loadTickets();
            updateDashboard(); // Refresh dashboard stats

            // Close the modal
            try {
                const modal = bootstrap.Modal.getInstance(document.getElementById('ticketResponseModal'));
                if (modal) {
                    modal.hide();
                } else {
                    // Fallback: manually hide the modal
                    const modalElement = document.getElementById('ticketResponseModal');
                    if (modalElement) {
                        modalElement.classList.remove('show');
                        modalElement.style.display = 'none';
                        document.body.classList.remove('modal-open');
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) backdrop.remove();
                    }
                }
            } catch (error) {
                console.error('Error closing modal:', error);
            }

            showNotification('Ticket updated successfully', 'success');
            addActivity('ticket_updated', `Ticket ${ticketId} updated to ${status} with admin response`);

            // Clear the response field
            const responseField = document.getElementById('adminResponse');
            if (responseField) {
                responseField.value = '';
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
            showNotification('Failed to update ticket. Please try again.', 'error');
        }
    } else {
        showNotification('Ticket not found', 'error');
    }
}

// Generate unique response ID
function generateResponseId() {
    const randomStr = Math.random().toString(36).substr(2, 8);
    return `RESP-${randomStr}`.toUpperCase();
}

function getCurrentTicketId() {
    // Get the ticket ID from the modal's data attribute
    const modal = document.getElementById('ticketResponseModal');
    if (!modal) {
        console.warn('Ticket response modal not found');
        return null;
    }

    const ticketId = modal.getAttribute('data-current-ticket-id');
    if (!ticketId) {
        console.warn('No current ticket ID found');
        return null;
    }
    return ticketId;
}

// Refresh tickets data from localStorage
function refreshTickets() {
    try {
        const tickets = getItemFromLocalStorage('supportTickets') || [];
        console.log('Refreshing tickets:', tickets);

        // Validate ticket data structure
        const validTickets = tickets.filter(ticket =>
            ticket &&
            ticket.id &&
            ticket.subject &&
            ticket.message &&
            ticket.status
        );

        if (validTickets.length !== tickets.length) {
            console.warn(`Filtered out ${tickets.length - validTickets.length} invalid tickets`);
        }

        data.tickets = validTickets;
        loadTickets();

        if (validTickets.length > 0) {
            showNotification(`Loaded ${validTickets.length} tickets`, 'success');
        }
    } catch (error) {
        console.error('Error refreshing tickets', error);
        showNotification('Failed to refresh tickets', 'error');
    }
}

// Get ticket statistics for dashboard
function getTicketStats() {
    const tickets = data.tickets || [];

    return {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        urgent: tickets.filter(t => t.priority === 'urgent').length,
        high: tickets.filter(t => t.priority === 'high').length,
        medium: tickets.filter(t => t.priority === 'medium').length,
        low: tickets.filter(t => t.priority === 'low').length,
        avgResponseTime: calculateAverageResponseTime(tickets),
        responseRate: calculateResponseRate(tickets)
    };
}

// Calculate average response time for tickets
function calculateAverageResponseTime(tickets) {
    const ticketsWithResponses = tickets.filter(t => t.responses && t.responses.length > 0);

    if (ticketsWithResponses.length === 0) return 0;

    let totalTime = 0;
    ticketsWithResponses.forEach(ticket => {
        const firstResponse = ticket.responses.find(r => r.isAdmin);
        if (firstResponse) {
            const created = new Date(ticket.createdAt);
            const responded = new Date(firstResponse.timestamp);
            totalTime += responded - created;
        }
    });

    return Math.round(totalTime / ticketsWithResponses.length / (1000 * 60 * 60)); // Hours
}

// Calculate response rate percentage
function calculateResponseRate(tickets) {
    if (tickets.length === 0) return 0;

    const respondedTickets = tickets.filter(t => t.responses && t.responses.length > 0);
    return Math.round((respondedTickets.length / tickets.length) * 100);
}

// Filter tickets by various criteria
function filterTickets(criteria = {}) {
    let filteredTickets = [...data.tickets];

    if (criteria.status && criteria.status !== 'all') {
        filteredTickets = filteredTickets.filter(t => t.status === criteria.status);
    }

    if (criteria.priority && criteria.priority !== 'all') {
        filteredTickets = filteredTickets.filter(t => t.priority === criteria.priority);
    }

    if (criteria.category && criteria.category !== 'all') {
        filteredTickets = filteredTickets.filter(t => t.category === criteria.category);
    }

    if (criteria.search) {
        const searchTerm = criteria.search.toLowerCase();
        filteredTickets = filteredTickets.filter(t =>
            t.subject.toLowerCase().includes(searchTerm) ||
            t.message.toLowerCase().includes(searchTerm) ||
            t.customerName.toLowerCase().includes(searchTerm) ||
            t.customerEmail.toLowerCase().includes(searchTerm)
        );
    }

    return filteredTickets;
}

// Export tickets to CSV
function exportTicketsToCSV() {
    const tickets = data.tickets || [];
    if (tickets.length === 0) {
        showNotification('No tickets to export', 'warning');
        return;
    }

    let csv = 'Ticket ID,Customer Name,Email,Subject,Priority,Status,Category,Created,Updated,Responses\n';

    tickets.forEach(ticket => {
        const row = [
            ticket.id || '',
            `"${ticket.customerName || ticket.customer || ''}"`,
            `"${ticket.customerEmail || ''}"`,
            `"${ticket.subject || ''}"`,
            ticket.priority || '',
            ticket.status || '',
            ticket.category || '',
            ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '',
            ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : '',
            ticket.responses ? ticket.responses.length : 0
        ].join(',');

        csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support_tickets_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Tickets exported successfully', 'success');
}

// Create sample ticket for testing
function createSampleTicket() {
    const sampleTicket = {
        id: generateTicketId(),
        subject: 'Sample Support Request',
        priority: 'medium',
        message: 'This is a sample ticket to test the admin dashboard functionality. Please respond to this ticket to see how the system works.',
        customerId: 'sample-user',
        customerEmail: 'sample@example.com',
        customerName: 'Sample Customer',
        customerPhone: '+1234567890',
        category: 'general',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
    };

    // Add to data and localStorage
    data.tickets.push(sampleTicket);
    const tickets = getItemFromLocalStorage('supportTickets') || [];
    tickets.push(sampleTicket);
    setItemToLocalStorage('supportTickets', tickets);

    // Refresh display
    loadTickets();
    updateDashboard();

    showNotification('Sample ticket created successfully', 'success');
}

// Generate unique ticket ID
function generateTicketId() {
    const randomStr = Math.random().toString(36).substr(2, 6);
    return `TKT-${randomStr}`.toUpperCase();
}

// Initialize ticket modal event listeners
function initializeTicketModal() {
    const modal = document.getElementById('ticketResponseModal');
    if (modal) {
        modal.addEventListener('hidden.bs.modal', () => {
            // Clear the current ticket ID when modal is closed
            modal.removeAttribute('data-current-ticket-id');
            const responseField = document.getElementById('adminResponse');
            if (responseField) {
                responseField.value = '';
            }
        });

        // Also handle when modal is shown to ensure proper initialization
        modal.addEventListener('shown.bs.modal', () => {
            console.log('Ticket modal shown');
        });

        console.log('Ticket modal initialized successfully');
    } else {
        console.warn('Ticket response modal not found');
    }
}


// Filter Functions
function filterProducts(status) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (!data.products || !Array.isArray(data.products)) {
        showNotification('No products data available', 'warning');
        return;
    }

    let filteredProducts = data.products;

    if (status !== 'all') {
        filteredProducts = data.products.filter(product => product.adminReview?.status === status);
    }

    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${data.users.find(u => u.id === product.sellerId)?.firstName} ${data.users.find(u => u.id === product.sellerId)?.lastName}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td><span class="badge bg-${getProductStatusBadgeColor(product.adminReview?.status)}">${product.adminReview?.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewProduct('${product.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success me-1" onclick="approveProduct('${product.id}')" ${product.adminReview?.status === 'approved' ? 'disabled' : ''}>
                    <i class="bi bi-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="rejectProduct('${product.id}')" ${product.adminReview?.status === 'rejected' ? 'disabled' : ''}>
                    <i class="bi bi-x"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Update active filter button states
    updateFilterButtonStates('products', status);
    showNotification(`Showing ${filteredProducts.length} products with status: ${status}`, 'info');
}

function filterTickets(status) {
    const tbody = document.getElementById('ticketsTableBody');
    if (!tbody) return;

    if (!data.tickets || !Array.isArray(data.tickets)) {
        showNotification('No tickets data available', 'warning');
        return;
    }

    let filteredTickets = data.tickets;

    if (status !== 'all') {
        filteredTickets = data.tickets.filter(ticket => ticket.status === status);
    }

    tbody.innerHTML = filteredTickets.map(ticket => {
        // Format the creation date
        const createdDate = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown';

        return `
            <tr>
                <td>${ticket.id || 'Unknown'}</td>
                <td>${ticket.customerName || ticket.customer || 'Unknown'}</td>
                <td>${ticket.subject || 'No subject'}</td>
                <td><span class="badge bg-${getPriorityBadgeColor(ticket.priority)}">${ticket.priority || 'Unknown'}</span></td>
                <td><span class="badge bg-${getTicketStatusBadgeColor(ticket.status)}">${ticket.status || 'Unknown'}</span></td>
                <td>${createdDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="viewTicket('${ticket.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="respondToTicket('${ticket.id}')">
                        <i class="bi bi-reply"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Update active filter button states
    updateFilterButtonStates('tickets', status);
    showNotification(`Showing ${filteredTickets.length} tickets with status: ${status}`, 'info');
}

function filterUsers(role) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (!data.users || !Array.isArray(data.users)) {
        showNotification('No users data available', 'warning');
        return;
    }

    let filteredUsers = data.users;

    if (role !== 'all') {
        filteredUsers = data.users.filter(user => user.role === role);
    }

    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName || ''}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-${getRoleBadgeColor(user.role)}">${user.role}</span></td>
            <td><span class="badge bg-${getStatusBadgeColor(user.status)}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editUser('${user.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="resetPassword('${user.id}')">
                    <i class="bi bi-key"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeUser('${user.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `);

    // Update active filter button states
    updateFilterButtonStates('users', role);
    showNotification(`Showing ${filteredUsers.length} users with role: ${role}`, 'info');
}

function updateFilterButtonStates(section, activeFilter) {
    // Remove active class from all filter buttons in the section
    const filterButtons = document.querySelectorAll(`[onclick*="filter${section.charAt(0).toUpperCase() + section.slice(1)}"]`);
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });

    // Add active class to the clicked filter button
    const activeButton = document.querySelector(`[onclick*="filter${section.charAt(0).toUpperCase() + section.slice(1)}('${activeFilter}')"]`);
    if (activeButton) {
        activeButton.classList.remove('btn-outline-primary');
        activeButton.classList.add('btn-primary');
        activeButton.classList.add('active');
    }
}

function resetFilters(section) {
    switch (section) {
        case 'users':
            loadUsers();
            break;
        case 'products':
            loadProducts();
            break;
        case 'tickets':
            loadTickets();
            break;
        case 'orders':
            loadOrders();
            break;
    }

    // Reset all filter button states
    const filterButtons = document.querySelectorAll(`[onclick*="filter${section.charAt(0).toUpperCase() + section.slice(1)}"]`);
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });

    showNotification(`Filters reset for ${section}`, 'info');
}

// Utility Functions
function addActivity(type, message) {
    const activity = {
        id: `A${String(data.activities.length + 1).padStart(3, '0')}`,
        type,
        message,
        timestamp: new Date().toLocaleString()
    };
    data.activities.unshift(activity);
    saveData();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification?.remove();
    }, 5000);
}

// Export data functionality
function exportData() {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin_data.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully', 'success');
}

// Modal functions
function showAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
}

function showAddModal() {
    // Show appropriate modal based on current section
    const sections = {
        users: showAddUserModal

    };

    const handler = sections[currentSection];
    if (handler) {
        handler();
    } else {
        showNotification('Add functionality for this section coming soon', 'info');
    }
}

function showEditUserModal(userId) {
    editUser(userId);
}


// Initialize Charts
function initializeCharts() {
    createSystemChart();
    createUserChart();
}

// Create system analytics chart
function createSystemChart() {
    const ctx = document.getElementById('systemChart');
    if (!ctx) return;
    const userCounts = getUserCounts();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['All Users', 'Sellers', 'Customers'],
            datasets: [{
                label: 'Users Count',
                data: [(userCounts.customer + userCounts.seller), userCounts.seller, userCounts.customer],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.5)',
                    'rgba(124, 58, 237, 0.5)',
                    'rgba(16, 185, 129, 0.5)'
                ],
                borderColor: [
                    'rgb(79, 70, 229)',
                    'rgb(124, 58, 237)',
                    'rgb(16, 185, 129)'
                ],
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Create user distribution chart
function createUserChart() {
    const ctx = document.getElementById('userChart');
    if (!ctx) return;

    const userCounts = getUserCounts();
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Customers', 'Sellers'],
            datasets: [{
                data: [userCounts.customer, userCounts.seller],
                backgroundColor: ['#4f46e5', '#7c3aed'],
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Get user counts by role
function getUserCounts() {
    const counts = { customer: 0, seller: 0, admin: 0 };
    data.users.forEach(({ role }) => {
        if (counts.hasOwnProperty(role)) {
            counts[role]++;
        }
    });
    return counts;
}

// Invoice Management Functions
function loadAdminInvoices() {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    displayAdminInvoices(invoices);
}

function displayAdminInvoices(invoices) {
    const tableBody = document.getElementById("invoicesTableBody");
    const noInvoices = document.getElementById("noInvoices");

    if (!tableBody) return;

    if (invoices.length === 0) {
        tableBody.innerHTML = "";
        if (noInvoices) noInvoices.classList.remove("d-none");
        return;
    }

    if (noInvoices) noInvoices.classList.add("d-none");

    tableBody.innerHTML = invoices.map(invoice => {
        const sellerInfo = getSellerInfo(invoice);

        return `
            <tr>
                <td><strong>#${invoice.id}</strong></td>
                <td>
                    <div>
                        <strong>${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</strong><br>
                        <small class="text-muted">${invoice.userInfo.email}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${sellerInfo.name}</strong><br>
                        <small class="text-muted">${sellerInfo.products} products</small>
                    </div>
                </td>
                <td>
                    ${invoice.items.map(item => `
                        <div class="mb-1">
                            <span class="badge bg-primary">${item.name}</span>
                            <small class="text-muted">x${item.qty}</small>
                        </div>
                    `).join('')}
                </td>
                <td>
                    <div>
                        <strong>$${invoice.total}</strong><br>
                        <small class="text-muted">Tax: $${invoice.tax}</small>
                    </div>
                </td>
                <td>
                    <small>${new Date(invoice.createdAt).toLocaleDateString()}</small>
                </td>
                <td>
                    <span class="badge bg-success">Completed</span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewAdminInvoiceDetails(${invoice.id})" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="printAdminInvoice(${invoice.id})" title="Print">
                            <i class="bi bi-printer"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="exportInvoiceData(${invoice.id})" title="Export">
                            <i class="bi bi-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getSellerInfo(invoice) {
    const products = getItemFromLocalStorage("products") || [];
    const sellerIds = new Set();
    const sellerNames = new Set();

    invoice.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        if (product && product.sellerId) {
            sellerIds.add(product.sellerId);
            const users = getItemFromLocalStorage("users") || [];
            const seller = users.find(u => u.id == product.sellerId);
            if (seller) {
                sellerNames.add(seller.firstName + " " + seller.lastName);
            }
        }
    });

    return {
        name: sellerNames.size > 0 ? Array.from(sellerNames).join(", ") : "Unknown",
        products: sellerIds.size
    };
}

function viewAdminInvoiceDetails(invoiceId) {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = invoices.find(inv => inv.id === invoiceId);

    if (!invoice) {
        showNotification("Invoice not found!", "danger");
        return;
    }

    const sellerInfo = getSellerInfo(invoice);

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'adminInvoiceModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Invoice #${invoice.id} - Admin View</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <h6>Customer Information</h6>
                            <p><strong>Name:</strong> ${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</p>
                            <p><strong>Email:</strong> ${invoice.userInfo.email}</p>
                            <p><strong>Address:</strong> ${invoice.address}</p>
                            <p><strong>Phone:</strong> ${invoice.phone}</p>
                        </div>
                        <div class="col-md-4">
                            <h6>Order Information</h6>
                            <p><strong>Date:</strong> ${invoice.createdAt}</p>
                            <p><strong>Shipping:</strong> ${invoice.shippingMethod}</p>
                            <p><strong>Payment:</strong> ${invoice.paymentMethod}</p>
                            <p><strong>Shipping Cost:</strong> $${invoice.shippingCost}</p>
                        </div>
                        <div class="col-md-4">
                            <h6>Seller Information</h6>
                            <p><strong>Seller:</strong> ${sellerInfo.name}</p>
                            <p><strong>Products:</strong> ${sellerInfo.products}</p>
                            <p><strong>Platform Fee:</strong> $${(invoice.total * 0.1).toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <h6>Products Ordered</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Seller</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.items.map(item => {
        const products = getItemFromLocalStorage("products") || [];
        const product = products.find(p => p.name === item.name);
        const users = getItemFromLocalStorage("users") || [];
        const seller = product ? users.find(u => u.id == product.sellerId) : null;
        const sellerName = seller ? seller.firstName + " " + seller.lastName : "Unknown";

        return `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>${sellerName}</td>
                                            <td>${item.qty}</td>
                                            <td>$${item.price}</td>
                                            <td>$${(item.price * item.qty).toFixed(2)}</td>
                                        </tr>
                                    `;
    }).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Financial Summary</h6>
                            <table class="table table-sm">
                                <tr><td>Subtotal:</td><td>$${(invoice.total - invoice.tax - invoice.shippingCost).toFixed(2)}</td></tr>
                                <tr><td>Tax (14%):</td><td>$${invoice.tax}</td></tr>
                                <tr><td>Shipping:</td><td>$${invoice.shippingCost}</td></tr>
                                <tr class="table-active"><td><strong>Total:</strong></td><td><strong>$${invoice.total}</strong></td></tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h6>Platform Revenue</h6>
                            <table class="table table-sm">
                                <tr><td>Total Order:</td><td>$${invoice.total}</td></tr>
                                <tr><td>Platform Fee (10%):</td><td>$${(invoice.total * 0.1).toFixed(2)}</td></tr>
                                <tr><td>Seller Revenue:</td><td>$${(invoice.total * 0.9).toFixed(2)}</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="printAdminInvoice(${invoice.id})">
                        <i class="bi bi-printer"></i> Print
                    </button>
                    <button type="button" class="btn btn-success" onclick="exportInvoiceData(${invoice.id})">
                        <i class="bi bi-download"></i> Export
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function printAdminInvoice(invoiceId) {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = invoices.find(inv => inv.id === invoiceId);

    if (!invoice) return;

    const sellerInfo = getSellerInfo(invoice);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Admin Invoice #${invoice.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .info { margin-bottom: 20px; }
                    .row { display: flex; justify-content: space-between; }
                    .col { flex: 1; margin: 0 10px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total { text-align: right; font-weight: bold; }
                    .platform-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Admin Invoice #${invoice.id}</h1>
                    <p>Date: ${invoice.createdAt}</p>
                    <p><strong>Platform Management Report</strong></p>
                </div>
                
                <div class="row">
                    <div class="col">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</p>
                        <p><strong>Email:</strong> ${invoice.userInfo.email}</p>
                        <p><strong>Address:</strong> ${invoice.address}</p>
                        <p><strong>Phone:</strong> ${invoice.phone}</p>
                    </div>
                    <div class="col">
                        <h3>Order Information</h3>
                        <p><strong>Date:</strong> ${invoice.createdAt}</p>
                        <p><strong>Shipping:</strong> ${invoice.shippingMethod}</p>
                        <p><strong>Payment:</strong> ${invoice.paymentMethod}</p>
                        <p><strong>Seller:</strong> ${sellerInfo.name}</p>
                    </div>
                </div>
                
                <h3>Products Ordered</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Seller</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => {
        const products = getItemFromLocalStorage("products") || [];
        const product = products.find(p => p.name === item.name);
        const users = getItemFromLocalStorage("users") || [];
        const seller = product ? users.find(u => u.id == product.sellerId) : null;
        const sellerName = seller ? seller.firstName + " " + seller.lastName : "Unknown";

        return `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${sellerName}</td>
                                    <td>${item.qty}</td>
                                    <td>$${item.price}</td>
                                    <td>$${(item.price * item.qty).toFixed(2)}</td>
                                </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
                
                <div class="row">
                    <div class="col">
                        <h4>Financial Summary</h4>
                        <table>
                            <tr><td>Subtotal:</td><td>$${(invoice.total - invoice.tax - invoice.shippingCost).toFixed(2)}</td></tr>
                            <tr><td>Tax (14%):</td><td>$${invoice.tax}</td></tr>
                            <tr><td>Shipping:</td><td>$${invoice.shippingCost}</td></tr>
                            <tr><td><strong>Total:</strong></td><td><strong>$${invoice.total}</strong></td></tr>
                        </table>
                    </div>
                    <div class="col">
                        <h4>Platform Revenue</h4>
                        <table>
                            <tr><td>Total Order:</td><td>$${invoice.total}</td></tr>
                            <tr><td>Platform Fee (10%):</td><td>$${(invoice.total * 0.1).toFixed(2)}</td></tr>
                            <tr><td>Seller Revenue:</td><td>$${(invoice.total * 0.9).toFixed(2)}</td></tr>
                        </table>
                    </div>
                </div>
                
                <div class="platform-info">
                    <h4>Platform Management Notes</h4>
                    <p><strong>Order Status:</strong> Completed</p>
                    <p><strong>Revenue Generated:</strong> $${(invoice.total * 0.1).toFixed(2)}</p>
                    <p><strong>Seller Payout:</strong> $${(invoice.total * 0.9).toFixed(2)}</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function exportInvoiceData(invoiceId) {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = invoices.find(inv => inv.id === invoiceId);

    if (!invoice) return;

    const sellerInfo = getSellerInfo(invoice);

    const csvData = [
        ['Invoice ID', invoice.id],
        ['Date', invoice.createdAt],
        ['Customer Name', `${invoice.userInfo.firstName} ${invoice.userInfo.lastName}`],
        ['Customer Email', invoice.userInfo.email],
        ['Customer Address', invoice.address],
        ['Customer Phone', invoice.phone],
        ['Shipping Method', invoice.shippingMethod],
        ['Payment Method', invoice.paymentMethod],
        ['Seller', sellerInfo.name],
        ['Subtotal', (invoice.total - invoice.tax - invoice.shippingCost).toFixed(2)],
        ['Tax', invoice.tax],
        ['Shipping Cost', invoice.shippingCost],
        ['Total', invoice.total],
        ['Platform Fee', (invoice.total * 0.1).toFixed(2)],
        ['Seller Revenue', (invoice.total * 0.9).toFixed(2)],
        [''],
        ['Products'],
        ['Product Name', 'Quantity', 'Price', 'Total'],
        ...invoice.items.map(item => [
            item.name,
            item.qty,
            item.price,
            (item.price * item.qty).toFixed(2)
        ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoice.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification("Invoice data exported successfully!", "success");
}

function refreshAdminInvoices() {
    loadAdminInvoices();
    showNotification("Invoices refreshed successfully!", "success");
}

function filterInvoices(filterType) {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    let filteredInvoices = [...invoices];

    switch (filterType) {
        case 'recent':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filteredInvoices = invoices.filter(invoice =>
                new Date(invoice.createdAt) > thirtyDaysAgo
            );
            break;
        case 'high-value':
            filteredInvoices = invoices.filter(invoice => invoice.total > 1000);
            break;
        case 'all':
        default:
            break;
    }

    displayAdminInvoices(filteredInvoices);
    showNotification(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} invoices displayed`, "info");
}
