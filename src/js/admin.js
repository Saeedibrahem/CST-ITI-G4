if (!localStorage.getItem("currentUser") || currentUser.role !== "admin") {

    showNotification("You are not authorized to access this page", "danger");
    window.location.href = "../../index.html";
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
    const storageKeys = ['adUsers', 'products', 'admin_orders', 'admin_tickets', 'admin_activities'];
    const dataKeys = ['users', 'products', 'orders', 'tickets', 'activities'];


    dataKeys.forEach((key, index) => {
        if (key === 'users') {
            data[key] = [...users];
        } else if (key === 'products') {
            data[key] = [...products];
        } else {
            data[key] = getItemFromLocalStorage(storageKeys[index]) ?? [];
        }
    });

    saveData();
}

// Create sample data based on type


// Save data to localStorage
function saveData() {
    const storageKeys = ['adUsers', 'products', 'admin_orders', 'admin_tickets', 'admin_activities'];
    const dataKeys = ['users', 'products', 'orders', 'tickets', 'activities'];

    dataKeys.forEach((key, index) => {
        setItemToLocalStorage(storageKeys[index], data[key]);
    });
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
    console.log(userCounts);
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
        ['support', () => loadTickets()]
    ]);

    const handler = sectionHandlers.get(section);
    if (handler) handler();
}

// Update dashboard statistics
function updateDashboard() {
    const elements = {
        totalUsers: data.users.length,
        totalProducts: data.products.length,
        totalOrders: data.orders.length,
        pendingTickets: data.tickets.filter(t => t.status === 'open').length
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Load users table
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    console.log(data.users);
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

    tbody.innerHTML = data.orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.products.join(', ')}</td>
            <td>$${order.total}</td>
            <td><span class="badge bg-${getOrderStatusBadgeColor(order.status)}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewOrder('${order.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="updateOrderStatus('${order.id}')">
                    <i class="bi bi-pencil-fill"></i>
                </button>
            </td>
        </tr>
    `);

    loadActivityList();
}

// Load tickets table
function loadTickets() {
    const tbody = document.getElementById('ticketsTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.tickets.map(ticket => `
        <tr>
            <td>${ticket.id}</td>
            <td>${ticket.customer}</td>
            <td>${ticket.subject}</td>
            <td><span class="badge bg-${getPriorityBadgeColor(ticket.priority)}">${ticket.priority}</span></td>
            <td><span class="badge bg-${getTicketStatusBadgeColor(ticket.status)}">${ticket.status}</span></td>
            <td>${ticket.createdAt}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewTicket('${ticket.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="respondToTicket('${ticket.id}')">
                    <i class="bi bi-reply"></i>
                </button>
            </td>
        </tr>
    `);
}

// Load activity list
function loadActivityList() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

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
                    <p><strong>Seller:</strong> ${product.seller}</p>
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
        modal.show();
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
    const order = data.orders.find(o => o.id === +orderId);
    if (order) {
        showNotification(`Order ${orderId} details: ${order.products.join(', ')}`, 'info');
    }
}

function updateOrderStatus(orderId) {
    const order = data.orders.find(o => o.id === +orderId);
    if (order) {
        const statuses = ['pending', 'processing', 'completed', 'cancelled'];
        const currentIndex = statuses.indexOf(order.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        order.status = nextStatus;
        saveData();
        loadOrders();
        showNotification(`Order ${orderId} status updated to ${nextStatus}`, 'success');
        addActivity('order_status_updated', `Order ${orderId} status: ${nextStatus}`);
    }
}

// Ticket Management Functions
function viewTicket(ticketId) {
    const ticket = data.tickets.find(t => t.id === +ticketId);
    if (ticket) {
        const modal = new bootstrap.Modal(document.getElementById('ticketResponseModal'));
        document.getElementById('ticketDetails').innerHTML = `
            <h6>Ticket Details</h6>
            <p><strong>Customer:</strong> ${ticket.customer}</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>Message:</strong> ${ticket.message}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p><strong>Status:</strong> ${ticket.status}</p>
            <p><strong>Created:</strong> ${ticket.createdAt}</p>
            ${ticket.responses.length > 0 ? `<hr><h6>Previous Responses:</h6><p>${ticket.responses.join('<br>')}</p>` : ''}
        `;
        document.getElementById('ticketStatus').value = ticket.status;
        modal.show();
    }
}

function respondToTicket(ticketId) {
    viewTicket(ticketId);
}

function updateTicket() {
    const ticketId = getCurrentTicketId();
    const response = document.getElementById('adminResponse')?.value;
    const status = document.getElementById('ticketStatus')?.value;

    if (!response?.trim()) {
        showNotification('Please provide a response', 'warning');
        return;
    }

    const ticket = data.tickets.find(t => t.id === +ticketId);
    if (ticket) {
        ticket.responses.push(response);
        ticket.status = status;
        saveData();
        loadTickets();

        const modal = bootstrap.Modal.getInstance(document.getElementById('ticketResponseModal'));
        modal?.hide();

        showNotification('Ticket updated successfully', 'success');
        addActivity('ticket_updated', `Ticket ${ticketId} updated to ${status}`);
    }
}

function getCurrentTicketId() {
    // This is a simplified approach - in a real app, you'd store the current ticket ID
    return 'T001'; // Placeholder
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

    tbody.innerHTML = filteredTickets.map(ticket => `
        <tr>
            <td>${ticket.id}</td>
            <td>${ticket.customer}</td>
            <td>${ticket.subject}</td>
            <td><span class="badge bg-${getPriorityBadgeColor(ticket.priority)}">${ticket.priority}</span></td>
            <td><span class="badge bg-${getTicketStatusBadgeColor(ticket.status)}">${ticket.status}</span></td>
            <td>${ticket.createdAt}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewTicket('${ticket.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="respondToTicket('${ticket.id}')">
                    <i class="bi bi-reply"></i>
                </button>
            </td>
        </tr>
    `).join('');

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