// Products Data Management for Seller Dashboard
class ProductsDataManager {
    constructor() {
        this.products = [];
        this.sellerProducts = [];
        this.currentUser = null;
    }

    // Initialize products data
    init(currentUser) {
        this.currentUser = currentUser;
        this.loadProductsFromStorage();
        this.filterSellerProducts();
    }

    // Load products from localStorage
    loadProductsFromStorage() {
        try {
            const productsData = localStorage.getItem("products");
            this.products = productsData ? JSON.parse(productsData) : [];
        } catch (error) {
            console.error("Error loading products:", error);
            this.products = [];
        }
    }

    // Filter products for current seller
    filterSellerProducts() {
        if (this.currentUser.role === "admin") {
            this.sellerProducts = this.products;
        } else {
            this.sellerProducts = this.products.filter(product => 
                product.sellerId == this.currentUser.id
            );
        }
    }

    // Get total products count
    getTotalProductsCount() {
        return this.sellerProducts.length;
    }

    // Get products by status
    getProductsByStatus(status) {
        return this.sellerProducts.filter(product => {
            const productStatus = product.adminReview ? product.adminReview.status : "unknown";
            return productStatus === status;
        });
    }

    // Get approved products count
    getApprovedProductsCount() {
        return this.getProductsByStatus("approved").length;
    }

    // Get pending products count
    getPendingProductsCount() {
        return this.getProductsByStatus("pending").length;
    }

    // Get rejected products count
    getRejectedProductsCount() {
        return this.getProductsByStatus("rejected").length;
    }

    // Get recent products (last N products)
    getRecentProducts(limit = 5) {
        return this.sellerProducts
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, limit);
    }

    // Get products with low stock (less than threshold)
    getLowStockProducts(threshold = 5) {
        return this.sellerProducts.filter(product => 
            (product.stock || 0) < threshold
        );
    }

    // Get products by category
    getProductsByCategory(category) {
        return this.sellerProducts.filter(product => 
            product.category === category
        );
    }

    // Get product categories
    getProductCategories() {
        const categories = new Set();
        this.sellerProducts.forEach(product => {
            if (product.category) {
                categories.add(product.category);
            }
        });
        return Array.from(categories);
    }

    // Get products statistics
    getProductsStatistics() {
        const totalProducts = this.getTotalProductsCount();
        const approvedProducts = this.getApprovedProductsCount();
        const pendingProducts = this.getPendingProductsCount();
        const rejectedProducts = this.getRejectedProductsCount();
        const lowStockProducts = this.getLowStockProducts().length;

        return {
            totalProducts,
            approvedProducts,
            pendingProducts,
            rejectedProducts,
            lowStockProducts
        };
    }

    // Get product by ID
    getProductById(productId) {
        return this.sellerProducts.find(product => product.id == productId);
    }

    // Search products by name
    searchProductsByName(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.sellerProducts.filter(product => 
            product.name && product.name.toLowerCase().includes(term)
        );
    }

    // Get products with highest rating
    getTopRatedProducts(limit = 5) {
        return this.sellerProducts
            .filter(product => product.rating)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
    }

    // Get products with highest price
    getHighestPricedProducts(limit = 5) {
        return this.sellerProducts
            .filter(product => product.price)
            .sort((a, b) => (b.price || 0) - (a.price || 0))
            .slice(0, limit);
    }

    // Get products with lowest price
    getLowestPricedProducts(limit = 5) {
        return this.sellerProducts
            .filter(product => product.price)
            .sort((a, b) => (a.price || 0) - (b.price || 0))
            .slice(0, limit);
    }

    // Get products on sale (with discount)
    getProductsOnSale() {
        return this.sellerProducts.filter(product => 
            product.salePercentage && product.salePercentage > 0
        );
    }

    // Calculate total inventory value
    calculateTotalInventoryValue() {
        return this.sellerProducts.reduce((total, product) => {
            return total + ((product.price || 0) * (product.stock || 0));
        }, 0);
    }

    // Get products by brand
    getProductsByBrand(brand) {
        return this.sellerProducts.filter(product => 
            product.brand === brand
        );
    }

    // Get product brands
    getProductBrands() {
        const brands = new Set();
        this.sellerProducts.forEach(product => {
            if (product.brand) {
                brands.add(product.brand);
            }
        });
        return Array.from(brands);
    }

    // Get products by color
    getProductsByColor(color) {
        return this.sellerProducts.filter(product => 
            product.color === color
        );
    }

    // Get product colors
    getProductColors() {
        const colors = new Set();
        this.sellerProducts.forEach(product => {
            if (product.color) {
                colors.add(product.color);
            }
        });
        return Array.from(colors);
    }

    // Get products by OS
    getProductsByOS(os) {
        return this.sellerProducts.filter(product => 
            product.os === os
        );
    }

    // Get product OS types
    getProductOSTypes() {
        const osTypes = new Set();
        this.sellerProducts.forEach(product => {
            if (product.os) {
                osTypes.add(product.os);
            }
        });
        return Array.from(osTypes);
    }

    // Refresh products data
    refresh() {
        this.loadProductsFromStorage();
        this.filterSellerProducts();
    }

    // Add new product
    addProduct(product) {
        this.products.push(product);
        this.saveProductsToStorage();
        this.filterSellerProducts();
    }

    // Update product
    updateProduct(productId, updatedProduct) {
        const index = this.products.findIndex(p => p.id == productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveProductsToStorage();
            this.filterSellerProducts();
        }
    }

    // Delete product
    deleteProduct(productId) {
        this.products = this.products.filter(p => p.id != productId);
        this.saveProductsToStorage();
        this.filterSellerProducts();
    }

    // Save products to localStorage
    saveProductsToStorage() {
        try {
            localStorage.setItem("products", JSON.stringify(this.products));
        } catch (error) {
            console.error("Error saving products:", error);
        }
    }
}

// Export for global access
window.ProductsDataManager = ProductsDataManager;
