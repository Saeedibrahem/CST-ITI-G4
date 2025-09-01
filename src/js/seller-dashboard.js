// Seller Dashboard Dynamic Data Management
class SellerDashboard {
    constructor() {
        this.currentUser = null;
        this.productsManager = new ProductsDataManager();
        this.ordersManager = new OrdersDataManager();
        this.chart = null;
    }

    // Initialize dashboard
    init() {
        this.currentUser = this.getCurrentUser();
        if (!this.currentUser) {
            console.warn("No user logged in");
            window.location.href = '../../pages/login/index.html';
            return;
        }

        if (this.currentUser.role !== "seller" && this.currentUser.role !== "admin") {
            console.warn("User does not have seller or admin role");
            window.location.href = '../../index.html';
            return;
        }

        console.log("Initializing dashboard for user:", this.currentUser);
        
        this.updateUserInNav();
        this.productsManager.init(this.currentUser);
        this.ordersManager.init(this.currentUser);
        this.calculateStatistics();
        this.renderRecentProducts();
        this.renderOrdersData();
        this.initializeSalesChart();
        this.setupEventListeners();
    }

    // Update user name in navigation
    updateUserInNav() {
        const navUser = document.getElementById("navUser");
        if (navUser && this.currentUser.firstName) {
            navUser.innerHTML = this.currentUser.firstName;
        }
    }

    // Calculate and display all statistics
    calculateStatistics() {
        this.calculateTotalProducts();
        this.calculateTotalOrders();
        this.calculateRevenueAndSoldUnits();
    }

    // Calculate total products
    calculateTotalProducts() {
        const totalProducts = this.productsManager.getTotalProductsCount();
        const element = document.getElementById("totalProduct");
        if (element) {
            element.innerHTML = totalProducts;
        }
    }

    // Calculate total orders and pending orders
    calculateTotalOrders() {
        const orderStats = this.ordersManager.getOrderStatistics();
        const element = document.getElementById("totalOrders");
        if (element) {
            element.innerHTML = orderStats.totalOrders;
        }

        const pendingElement = document.getElementById("pendingOrders");
        if (pendingElement) {
            pendingElement.innerHTML = orderStats.pendingOrders;
        }
    }

    // Calculate revenue and sold units
    calculateRevenueAndSoldUnits() {
        const orderStats = this.ordersManager.getOrderStatistics();
        console.log("Order statistics:", orderStats);

        const soldElement = document.getElementById("totalSold");
        if (soldElement) {
            soldElement.innerHTML = orderStats.totalSoldUnits;
        }

        const revenueElement = document.getElementById("totalRevenue");
        if (revenueElement) {
            revenueElement.innerHTML = `$${orderStats.totalRevenue.toFixed(2)}`;
        }
    }

    // Render recent products table
    renderRecentProducts() {
        const tableBody = document.getElementById("recentProductsTable");
        if (!tableBody) return;

        tableBody.innerHTML = "";

        const recentProducts = this.productsManager.getRecentProducts(5);

        if (recentProducts.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No products found</td></tr>';
            return;
        }

        recentProducts.forEach((product, index) => {
            const row = document.createElement("tr");
            const status = product.adminReview ? product.adminReview.status : "unknown";
            let statusBadge = "";

            switch (status) {
                case "approved":
                    statusBadge = '<span class="badge bg-success">Approved</span>';
                    break;
                case "pending":
                    statusBadge = '<span class="badge bg-warning text-dark">Pending</span>';
                    break;
                case "rejected":
                    statusBadge = '<span class="badge bg-danger">Rejected</span>';
                    break;
                default:
                    statusBadge = '<span class="badge bg-secondary">Unknown</span>';
            }

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${product.images && product.images[0] ? product.images[0] : '../../assets/img/loging.png'}" 
                             class="rounded me-2" style="width:40px;height:40px;object-fit:cover;" alt="Product">
                        <span>${product.name || 'Unnamed Product'}</span>
                    </div>
                </td>
                <td>${product.category || 'N/A'}</td>
                <td>$${(product.price || 0).toFixed(2)}</td>
                <td>${product.stock || 0}</td>
                <td>${statusBadge}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Render orders data
    renderOrdersData() {
        this.renderRecentOrders();
        this.renderBestSellingProducts();
    }

    // Render recent orders
    renderRecentOrders() {
        const recentContent = document.getElementById("recentOrdersContent");
        if (!recentContent) return;

        const recentOrders = this.ordersManager.getRecentOrders(3);

        if (recentOrders.length === 0) {
            recentContent.innerHTML = "No recent orders";
            return;
        }

        let ordersHTML = "";
        recentOrders.forEach(order => {
            const orderDate = new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString();
            const totalAmount = order.products ?
                order.products.reduce((sum, product) => sum + (product.price * product.qty), 0) : 0;

            ordersHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <small class="text-muted">Order #${order.id || 'N/A'}</small><br>
                        <small>$${totalAmount.toFixed(2)}</small>
                    </div>
                    <span class="badge bg-${this.getStatusColor(order.status)}">${order.status || 'Unknown'}</span>
                </div>
            `;
        });

        recentContent.innerHTML = ordersHTML;
    }

    // Render best selling products
    renderBestSellingProducts() {
        const bestContent = document.getElementById("bestSellingContent");
        if (!bestContent) return;

        const bestSellers = this.ordersManager.getBestSellingProducts(3);

        if (bestSellers.length === 0) {
            bestContent.innerHTML = "No best selling yet";
            return;
        }

        let bestHTML = "";
        bestSellers.forEach((product, index) => {
            bestHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <small class="fw-bold">${index + 1}. ${product.name}</small><br>
                        <small class="text-muted">${product.totalSold} units sold</small>
                    </div>
                    <small class="text-success">$${product.totalRevenue.toFixed(2)}</small>
                </div>
            `;
        });

        bestContent.innerHTML = bestHTML;
    }

    // Get status color for badges
    getStatusColor(status) {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'success';
            case 'shipped':
                return 'primary';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    // Initialize sales chart
    initializeSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) {
            console.warn("Canvas element 'salesChart' not found");
            return;
        }

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Also destroy any existing charts with the same canvas
        const existingCharts = Chart.getChart(ctx);
        if (existingCharts) {
            existingCharts.destroy();
        }

        // Generate chart data from actual orders
        const chartData = this.ordersManager.getSalesDataForChart(7);
        console.log("Chart data generated:", chartData);

        // Check if we have any data to display
        const hasData = chartData.revenue.some(value => value > 0) || chartData.units.some(value => value > 0);
        
        if (!hasData) {
            console.log("No sales data available for chart, showing empty chart");
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Sales Revenue ($)',
                    data: chartData.revenue,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y'
                }, {
                    label: 'Units Sold',
                    data: chartData.units,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Sales Analytics - Last 7 Days'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Revenue ($)'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Units Sold'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });

        console.log("Chart initialized successfully");
    }

    // Setup event listeners
    setupEventListeners() {
        // Refresh data when tab becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });

        // Refresh data every 30 seconds
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    // Refresh all data
    refreshData() {
        this.productsManager.refresh();
        this.ordersManager.refresh();
        this.calculateStatistics();
        this.renderRecentProducts();
        this.renderOrdersData();
        
        // Add a small delay before reinitializing chart to prevent conflicts
        setTimeout(() => {
            this.initializeSalesChart();
        }, 100);
    }

    // Helper function to get current user
    getCurrentUser() {
        if (localStorage.getItem("currentUser")) {
            try {
                const encryptedUser = localStorage.getItem("currentUser");
                const decryptedUser = this.decrypt_string_to_string(encryptedUser);
                return JSON.parse(decryptedUser);
            } catch (error) {
                console.error("Error getting current user:", error);
                return null;
            }
        }
        return null;
    }

    // Helper function to decrypt data
    decrypt_string_to_string(data) {
        try {
            const bytes = CryptoJS.AES.decrypt(data, "secret_key");
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        } catch (error) {
            console.error("Decryption failed:", error);
            return "{}";
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded, initializing dashboard...");
    const dashboard = new SellerDashboard();
    dashboard.init();
});

// Export for global access
window.SellerDashboard = SellerDashboard;
