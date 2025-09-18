// Orders Data Management for Seller Dashboard
class OrdersDataManager {
    constructor() {
        this.orders = [];
        this.sellerOrders = [];
        this.currentUser = null;
    }

    // Initialize orders data
    init(currentUser) {
        this.currentUser = currentUser;
        this.loadOrdersFromStorage();
        this.filterSellerOrders();
    }

    // Load orders from localStorage
    loadOrdersFromStorage() {
        try {
            const ordersData = localStorage.getItem("seller_orders");
            this.orders = ordersData ? JSON.parse(ordersData) : [];
            
            // If no orders exist, generate sample data for demonstration
            if (this.orders.length === 0) {
                this.generateSampleOrders();
            }
        } catch (error) {
            console.error("Error loading orders:", error);
            this.orders = [];
        }
    }

    // Generate sample orders for demonstration
    generateSampleOrders() {
        const sampleOrders = [];
        const currentUser = this.currentUser;
        
        if (!currentUser) return;

        // Get seller's products
        const productsData = localStorage.getItem("products");
        const allProducts = productsData ? JSON.parse(productsData) : [];
        const sellerProducts = allProducts.filter(p => p.sellerId == currentUser.id);

        if (sellerProducts.length === 0) return;

        // Generate orders for the last 30 days
        for (let i = 0; i < 15; i++) {
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
            
            // Randomly select 1-3 products for this order
            const numProducts = Math.floor(Math.random() * 3) + 1;
            const orderProducts = [];
            
            for (let j = 0; j < numProducts; j++) {
                const randomProduct = sellerProducts[Math.floor(Math.random() * sellerProducts.length)];
                if (randomProduct) {
                    orderProducts.push({
                        id: randomProduct.id,
                        name: randomProduct.name,
                        price: randomProduct.price,
                        qty: Math.floor(Math.random() * 3) + 1
                    });
                }
            }

            if (orderProducts.length > 0) {
                const statuses = ["Pending", "Delivered", "Shipped", "Processing"];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                sampleOrders.push({
                    id: `ORDER_${Date.now()}_${i}`,
                    customerName: `Customer ${i + 1}`,
                    email: `customer${i + 1}@example.com`,
                    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
                    address: `${Math.floor(Math.random() * 9999)} Main St, City, State`,
                    date: orderDate.toISOString(),
                    products: orderProducts,
                    total: orderProducts.reduce((sum, p) => sum + (p.price * p.qty), 0),
                    status: randomStatus,
                    createdAt: orderDate.toISOString(),
                    paymentMethod: "Credit Card",
                    shippingMethod: "Standard",
                    notes: "",
                    updatedAt: new Date().toISOString()
                });
            }
        }

        // Save sample orders to localStorage
        localStorage.setItem("seller_orders", JSON.stringify(sampleOrders));
        this.orders = sampleOrders;
        // console.log("Generated sample orders:", sampleOrders);
    }

    // Filter orders for current seller
    filterSellerOrders() {
        if (this.currentUser.role === "admin") {
            this.sellerOrders = this.orders;
        } else {
            // For sellers, filter orders that contain their products
            this.sellerOrders = this.orders.filter(order => {
                return order.products && order.products.some(product => {
                    // Check if this product belongs to current seller
                    return this.isProductBelongsToSeller(product.id);
                });
            });
        }
    }

    // Check if product belongs to current seller
    isProductBelongsToSeller(productId) {
        try {
            const productsData = localStorage.getItem("products");
            const products = productsData ? JSON.parse(productsData) : [];
            const product = products.find(p => p.id == productId);
            return product && product.sellerId == this.currentUser.id;
        } catch (error) {
            console.error("Error checking product ownership:", error);
            return false;
        }
    }

    // Get orders by status
    getOrdersByStatus(status) {
        return this.sellerOrders.filter(order => order.status === status);
    }

    // Get pending orders count
    getPendingOrdersCount() {
        return this.getOrdersByStatus("Pending").length;
    }

    // Get completed orders (Delivered or Shipped)
    getCompletedOrders() {
        return this.sellerOrders.filter(order => 
            order.status === "Delivered" || order.status === "Shipped"
        );
    }

    // Calculate total revenue from completed orders
    calculateTotalRevenue() {
        let totalRevenue = 0;
        const completedOrders = this.getCompletedOrders();

        completedOrders.forEach(order => {
            if (order.products) {
                order.products.forEach(product => {
                    if (this.isProductBelongsToSeller(product.id)) {
                        totalRevenue += (product.price || 0) * (product.qty || 0);
                    }
                });
            }
        });

        return totalRevenue;
    }

    // Calculate total sold units from completed orders
    calculateTotalSoldUnits() {
        let totalUnits = 0;
        const completedOrders = this.getCompletedOrders();

        completedOrders.forEach(order => {
            if (order.products) {
                order.products.forEach(product => {
                    if (this.isProductBelongsToSeller(product.id)) {
                        totalUnits += product.qty || 0;
                    }
                });
            }
        });

        return totalUnits;
    }

    // Get recent orders (last N orders)
    getRecentOrders(limit = 3) {
        return this.sellerOrders
            .sort((a, b) => new Date(b.orderDate || b.createdAt || 0) - new Date(a.orderDate || a.createdAt || 0))
            .slice(0, limit);
    }

    // Get best selling products
    getBestSellingProducts(limit = 3) {
        const productSales = {};
        
        this.sellerOrders.forEach(order => {
            if (order.products) {
                order.products.forEach(product => {
                    if (this.isProductBelongsToSeller(product.id)) {
                        if (!productSales[product.id]) {
                            productSales[product.id] = {
                                id: product.id,
                                name: product.name,
                                totalSold: 0,
                                totalRevenue: 0
                            };
                        }
                        productSales[product.id].totalSold += product.qty || 0;
                        productSales[product.id].totalRevenue += (product.price || 0) * (product.qty || 0);
                    }
                });
            }
        });

        return Object.values(productSales)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, limit);
    }

    // Get sales data for chart (last N days)
    getSalesDataForChart(days = 7) {
        const labels = [];
        const revenue = [];
        const units = [];

        // Generate sample data if no real data exists
        const hasRealData = this.sellerOrders.length > 0;
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            if (hasRealData) {
                // Calculate data for this day from real orders
                const dayStart = new Date(date);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(date);
                dayEnd.setHours(23, 59, 59, 999);

                let dayRevenue = 0;
                let dayUnits = 0;

                this.sellerOrders.forEach(order => {
                    const orderDate = new Date(order.orderDate || order.createdAt || Date.now());
                    if (orderDate >= dayStart && orderDate <= dayEnd) {
                        if (order.products) {
                            order.products.forEach(product => {
                                if (this.isProductBelongsToSeller(product.id)) {
                                    dayRevenue += (product.price || 0) * (product.qty || 0);
                                    dayUnits += product.qty || 0;
                                }
                            });
                        }
                    }
                });

                revenue.push(dayRevenue);
                units.push(dayUnits);
            } else {
                // Generate sample data for demonstration
                const baseRevenue = Math.random() * 500 + 100; // $100-$600
                const baseUnits = Math.floor(Math.random() * 10) + 1; // 1-10 units
                
                // Add some variation based on day of week (weekends have more sales)
                const dayOfWeek = date.getDay();
                const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1.0;
                
                revenue.push(Math.round(baseRevenue * weekendMultiplier));
                units.push(Math.floor(baseUnits * weekendMultiplier));
            }
        }

        return { labels, revenue, units };
    }

    // Get order statistics
    getOrderStatistics() {
        const totalOrders = this.sellerOrders.length;
        const pendingOrders = this.getPendingOrdersCount();
        const completedOrders = this.getCompletedOrders().length;
        const totalRevenue = this.calculateTotalRevenue();
        const totalSoldUnits = this.calculateTotalSoldUnits();

        return {
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue,
            totalSoldUnits
        };
    }

    // Refresh orders data
    refresh() {
        this.loadOrdersFromStorage();
        this.filterSellerOrders();
    }
}

// Export for global access
window.OrdersDataManager = OrdersDataManager;
