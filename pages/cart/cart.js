// Cart functionality with integration to shared utilities
var cart = JSON.parse(localStorage.getItem("cart")) || [];
let discountApplied = false;
let discountAmount = 0;
let bonusApplied = false;
let bonusAmount = 0;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Render navbar using shared utilities
    if (window.sharedUtils && window.sharedUtils.renderNavbar) {
        window.sharedUtils.renderNavbar();
    }
    
    // Initialize cart
    renderCart();
    updateCartBadge();
    updateNavbarCartCounter();
});

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    updateNavbarCartCounter();
}

function updateCartBadge() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.qty, 0);
    }
}

// Update navbar cart counter
function updateNavbarCartCounter() {
    if (window.sharedUtils && window.sharedUtils.updateCartCounter) {
        window.sharedUtils.updateCartCounter();
    }
}

// Clear entire cart
function clearCart() {
    cart = [];
    discountApplied = false;
    discountAmount = 0;
    bonusApplied = false;
    bonusAmount = 0;
    saveCart();
    renderCart();
    showAlert("Cart cleared successfully", "success");
}

function renderCart() {
    let cartItems = document.getElementById("cart-items");
    let emptyCart = document.getElementById("empty-cart");
    let checkoutBtn = document.getElementById("checkout-btn");
    let clearCartBtn = document.getElementById("clear-cart-btn");
    
    if (!cartItems) return;
    
    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        // Show empty cart message
        if (emptyCart) emptyCart.classList.remove("d-none");
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        // Update navbar counter when cart is empty
        updateNavbarCartCounter();
        return;
    }
    
    // Hide empty cart message and show buttons
    if (emptyCart) emptyCart.classList.add("d-none");
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (clearCartBtn) clearCartBtn.style.display = 'block';
    
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        
        // Get the first image from the images array or use a default
        const itemImage = item.images && item.images.length > 0 ? item.images[0] : item.image || '../../assets/img/products/default.png';
        
        cartItems.innerHTML += `
            <div class="list-group-item d-flex align-items-center cart-item">
                <img src="${itemImage}" class="me-3" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-1 text-muted">$${item.price.toLocaleString()} x ${item.qty}</p>
                    <span class="badge mb-2 ${item.qty <= item.stock ? 'bg-success' : 'bg-danger'} stockspan">
                        ${item.qty <= item.stock ? `Available: ${item.stock} pieces` : 'Out of stock'}
                    </span>
                    <div class="d-flex align-items-center flex-wrap gap-2">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="updateQty(${index}, -1)" ${item.qty <= 1 ? 'disabled' : ''}>
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span class="btn btn-outline-dark disabled">${item.qty}</span>
                            <button class="btn btn-outline-secondary" onclick="updateQty(${index}, 1)" ${item.qty >= item.stock ? 'disabled' : ''}>
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        
                        <!-- Delete button with confirmation -->
                        <div class="delete-wrap d-inline-block" id="deleteWrap-${index}">
                            <button class="delete-btn btn btn-sm btn-outline-danger">
                                <i class="fa-solid fa-trash me-1"></i>Delete
                            </button>
                            <div class="x-mark">✕</div>
                            <div class="bubble"></div>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <strong class="fs-5">$${(item.price * item.qty).toLocaleString()}</strong>
                </div>
            </div>`;
    });

    // Calculate totals
    let tax = Math.round(subtotal * 0.14); // 14% tax
    let shipping = subtotal > 0 ? 60 : 0;
    let total = subtotal + tax + shipping - discountAmount - bonusAmount;

    // Update summary display
    updateSummaryDisplay(subtotal, tax, shipping, total);
    
    // Save cart and initialize delete buttons
    saveCart();
    cart.forEach((item, index) => {
        initDeleteButton(index);
    });
}

function updateSummaryDisplay(subtotal, tax, shipping, total) {
    const elements = {
        subtotal: document.getElementById("subtotal"),
        tax: document.getElementById("tax"),
        shipping: document.getElementById("shipping"),
        total: document.getElementById("total")
    };

    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toLocaleString()}`;
    if (elements.tax) elements.tax.textContent = `$${tax.toLocaleString()}`;
    if (elements.shipping) elements.shipping.textContent = `$${shipping.toLocaleString()}`;
    if (elements.total) elements.total.textContent = `$${total.toLocaleString()}`;
}

function updateQty(index, change) {
    if (index < 0 || index >= cart.length) return;
    
    let newQty = cart[index].qty + change;
    
    if (newQty < 1) {
        showAlert("Quantity cannot be less than 1", "warning");
        return;
    }
    
    if (newQty > cart[index].stock) {
        showAlert(`Only ${cart[index].stock} items available in stock`, "warning");
        return;
    }
    
    cart[index].qty = newQty;
    saveCart();
    renderCart();
}

function removeItem(index) {
    if (index < 0 || index >= cart.length) return;
    
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    showAlert(`"${itemName}" removed from cart`, "success");
}

function initDeleteButton(index) {
    const wrap = document.getElementById("deleteWrap-" + index);
    if (!wrap) return;
    
    const btn = wrap.querySelector(".delete-btn");
    const x = wrap.querySelector(".x-mark");
    let confirmMode = false;
    let deleteTimeout = null;

    btn.addEventListener("click", () => {
        if (!confirmMode) {
            wrap.classList.add("active");
            confirmMode = true;
            deleteTimeout = setTimeout(() => {
                wrap.classList.remove("active");
                confirmMode = false;
            }, 5000);
        } else {
            removeItem(index);
        }
    });

    x.addEventListener("click", () => {
        wrap.classList.remove("active");
        confirmMode = false;
        if (deleteTimeout) {
            clearTimeout(deleteTimeout);
            deleteTimeout = null;
        }
    });
}

// Discount and bonus functions
function applyDiscount() {
    const codeInput = document.getElementById("code");
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        showAlert("Please enter a discount code", "warning");
        return;
    }
    
    // Simple discount logic - can be enhanced
    if (code === "SAVE10" || code === "WELCOME") {
        discountAmount = 10;
        discountApplied = true;
        showAlert("Discount code applied! $10 off", "success");
        codeInput.value = "";
        renderCart(); // Recalculate totals
    } else {
        showAlert("Invalid discount code", "danger");
    }
}

function applyBonus() {
    const bonusInput = document.getElementById("bonus");
    const bonus = bonusInput.value.trim();
    
    if (!bonus) {
        showAlert("Please enter a bonus card number", "warning");
        return;
    }
    
    // Simple bonus logic - can be enhanced
    if (bonus.length >= 8) {
        bonusAmount = 5;
        bonusApplied = true;
        showAlert("Bonus card applied! $5 off", "success");
        bonusInput.value = "";
        renderCart(); // Recalculate totals
    } else {
        showAlert("Invalid bonus card number", "danger");
    }
}

// Checkout function
function showCheckout() {
    // Check if user is logged in
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    
    if (!currentUser) {
        showAlert("Please login to proceed with checkout", "warning");
        setTimeout(() => {
            window.location.href = "../../pages/login/index.html";
        }, 2000);
        return;
    }
    
    if (cart.length === 0) {
        showAlert("Your cart is empty!", "warning");
        return;
    }
    
    // Validate stock availability
    const outOfStockItems = cart.filter(item => item.qty > item.stock);
    if (outOfStockItems.length > 0) {
        showAlert("Some items in your cart are out of stock. Please update quantities.", "warning");
        return;
    }
    
    // Prepare cart info for checkout
    const cartInfo = {
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.images && item.images.length > 0 ? item.images[0] : item.image,
            sellerId: item.sellerId,
            stock: item.stock
        })),
        userId: currentUser.id,
        address: "",
        phone: "",
        shippingMethod: "Standard",
        shippingCost: 0,
        shippingDate: "",
        tax: Math.round(cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.14),
        discountAmount: discountAmount,
        bonusAmount: bonusAmount,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        total: 0
    };
    
    // Save cart info and redirect to checkout
    localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
    window.location.href = "./ceckout.html";
}

// Alert function
function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('notification') || createNotificationContainer();
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    
    alertPlaceholder.appendChild(wrapper);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (wrapper.parentNode) {
            wrapper.remove();
        }
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification';
    container.className = 'position-fixed top-0 end-0 p-5';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

// Export functions for global access
window.cartFunctions = {
    updateQty,
    removeItem,
    applyDiscount,
    applyBonus,
    showCheckout,
    clearCart
};