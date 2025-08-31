// Shared utilities for navbar and user management across all pages
if (!localStorage.getItem("users")) {
  fetch("../data/users.json")
    .then((res) => res.json())
    .then((users) => {
      const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
      localStorage.setItem("users", encryptedUsers);
    })
    .catch((err) => console.error("Error loading users:", err));
}

function getItemFromLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// Set Item to Local Storage
function setItemToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Remove Item from Local Storage
function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
}

// Clear Local Storage
function clearLocalStorage() {
  localStorage.clear();
}

// mock login
let loggedIn = getCurrentUser() ? true : false;


// if argument is string enter it, else enter JSON.stringify(data)
// to use next 3 methods you have to import cryptojs library
function encrypt_string_to_string(data) {
  const encryptedData = CryptoJS.AES.encrypt(data, "secret_key").toString();
  return encryptedData;
}
// decrypt func     ***=>abdo
// function decrypt_string_to_string(data) {
//     const bytes = CryptoJS.AES.decrypt(data, "secret_key");
//     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//     return decryptedData;
// }
// في shared.js - تحسين معالجة الأخطاء
function decrypt_string_to_string(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, "secret_key");
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("Decryption failed:", error);
    // إرجاع بيانات فارغة بدلاً من الخطأ
    return "[]";
  }
}
// get currentUser
function getCurrentUser() {
  if (localStorage.getItem("currentUser")) {
    let currentUser = JSON.parse(
      decrypt_string_to_string(localStorage.getItem("currentUser"))
    );
    return currentUser;
  }

}
// get users
function getUsers() {
  let users = JSON.parse(
    decrypt_string_to_string(localStorage.getItem("users"))
  );
  return users;
}

let currentUser = getCurrentUser();
let users = getUsers();

// Get cart items count
const getCartItemsCount = () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((total, item) => total + (item.qty || 0), 0);
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
};

// Get user role from localStorage or default to guest
const getUserRole = () => {
  if (currentUser) {
    return currentUser.role;
  } else {
    return 'guest';
  }
};

// Get current page path for active navigation highlighting
const getCurrentPage = () => {
  const path = window.location.pathname;
  if (path.includes('/index.html') || path.endsWith('/')) return 'home';
  if (path.includes('/products/')) return 'products';
  if (path.includes('/aboutus/')) return 'about';
  if (path.includes('/admin')) return 'admin';
  if (path.includes('/sellerdashboard')) return 'seller';
  if (path.includes('/profile')) return 'profile';
  if (path.includes('/cart')) return 'cart';
  if (path.includes('/customer-service')) return 'service';
  return 'home';
};

// Generate navbar HTML based on user role and current page
const generateNavbar = (role = "guest", currentPage = "home") => {
  // Main Links with active state
  const getMainLinks = () => {
    const isActive = (page) => currentPage === page ? 'active' : '';
    const cartCount = getCartItemsCount();

    switch (role.toLowerCase()) {
      case "admin":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="../../pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="../../pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-danger ${isActive('admin')}" href="../../pages/admin.html">Admin Dashboard</a>
          </li>
        `;
      case "seller":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="../../pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="../../pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-primary ${isActive('seller')}" href="../../pages/sellerdashboard/index.html">Seller Dashboard</a>
          </li>
        `;
      case "customer":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="../../pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="../../pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item position-relative">
            <a class="nav-link fw-semibold text-dark ${isActive('cart')}" href="../../pages/cart/cart.html">
              Cart
              ${cartCount > 0 ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7em; transform: translate(-50%, -50%);">${cartCount}</span>` : ''}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('service')}" href="../../pages/customer-service.html">Customer Service</a>
          </li>
        `;
      default: // guest
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="../../pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="../../pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item position-relative">
            <a class="nav-link fw-semibold text-dark ${isActive('cart')}" href="../../pages/cart/cart.html">
              Cart
              ${cartCount > 0 ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7em; transform: translate(-50%, -50%);">${cartCount}</span>` : ''}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('service')}" href="../../pages/customer-service.html">Customer Service</a>
          </li>
        `;
    }
  };

  // Right side (User Menu or Auth Links)
  const getRightSide = () => {
    switch (role.toLowerCase()) {
      case "admin":
        return `
          <div id="userMenu" class="dropdown">
            <button class="btn btn-outline-dark rounded-circle p-2" data-bs-toggle="dropdown">
              <i class="fa-solid fa-user-shield fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header text-danger">Admin Panel</h6></li>
              <li><a class="dropdown-item" href="../../pages/admin.html"><i class="fa-solid fa-gauge me-2"></i>Dashboard</a></li>
              <li><a class="dropdown-item" href="../../pages/admin.html#users"><i class="fa-solid fa-users me-2"></i>Manage Users</a></li>
              <li><a class="dropdown-item" href="../../pages/admin.html#products"><i class="fa-solid fa-boxes me-2"></i>Manage Products</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        `;

      case "seller":
        return `
          <div id="userMenu" class="dropdown">
            <button class="btn btn-outline-dark rounded-circle p-2" data-bs-toggle="dropdown">
              <i class="fa-solid fa-store fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header text-primary">Seller Panel</h6></li>
              <li><a class="dropdown-item" href="../../pages/sellerdashboard/index.html"><i class="fa-solid fa-chart-line me-2"></i>Dashboard</a></li>
              <li><a class="dropdown-item" href="../../pages/sellerdashboard/products.html"><i class="fa-solid fa-box-open me-2"></i>My Products</a></li>
              <li><a class="dropdown-item" href="../../pages/sellerdashboard/orders.html"><i class="fa-solid fa-truck me-2"></i>Orders</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="../../pages/profile/index.html"><i class="fa-solid fa-user-gear me-2"></i>Profile</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        `;

      case "customer":
        return `
          <div id="userMenu" class="dropdown">
            <button class="btn btn-outline-dark rounded-circle p-2" data-bs-toggle="dropdown">
              <i class="fa-solid fa-user fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header text-primary">User Account</h6></li>
              <li><a class="dropdown-item" href="../../pages/profile/index.html"><i class="fa-solid fa-user-gear me-2"></i>Profile</a></li>
              <li><a class="dropdown-item" href="../../pages/profile/index.html#orders"><i class="fa-solid fa-box me-2"></i>Orders</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        `;

      default: // guest
        return `
          <div id="authLinks" class="d-flex gap-2">
            <a href="../../pages/login/index.html" class="login_btn btn btn-outline-dark text-dark btn-sm">
              <i class="fa-solid fa-right-to-bracket me-1"></i> Login
            </a>
            <a href="../../pages/signup/index.html" class="btn btn-primary signup_btn bg-dark text-white btn-outline-dark btn-sm">
              <i class="fa-solid fa-user-plus me-1"></i> Signup
            </a>
          </div>
        `;
    }
  };

  // Full Navbar
  return `
    <header class="sticky-top bg-white shadow-sm border-bottom">
      <nav class="navbar navbar-expand-lg navbar-light py-2 px-lg-5">
        <div class="container-fluid">

          <!-- Logo -->
          <a class="navbar-brand fw-bold d-flex align-items-center" href="../../index.html">
            <img src="../../assets/home_page_img/logo.png" alt="Logo" height="40" class="me-2">
          </a>

          <!-- Collapsible Nav -->
          <div class="collapse navbar-collapse justify-content-center" id="mainNav">
            <ul class="navbar-nav mx-3 d-flex g-4">
              ${getMainLinks()}
            </ul>
          </div>

          <!-- Right Side (Dynamic) -->
          <div class="d-flex align-items-center gap-2 ms-3">
            ${getRightSide()}
          </div>

          <!-- Navbar Toggler -->
          <button class="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </header>
  `;
};

// Generate navbar for home page (different path structure)
const generateHomeNavbar = (role = "guest", currentPage = "home") => {
  // Main Links with active state for home page
  const getMainLinks = () => {
    const isActive = (page) => currentPage === page ? 'active' : '';
    const cartCount = getCartItemsCount();

    switch (role.toLowerCase()) {
      case "admin":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="./index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="./pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="./pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-danger ${isActive('admin')}" href="./pages/admin.html">Admin Dashboard</a>
          </li>
        `;
      case "seller":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="./index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="./pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="./pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-primary ${isActive('seller')}" href="./pages/sellerdashboard/index.html">Seller Dashboard</a>
          </li>
        `;
      case "customer":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="./index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="./pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="./pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item position-relative">
            <a class="nav-link fw-semibold text-dark ${isActive('cart')}" href="./pages/cart/cart.html">
              Cart
              ${cartCount > 0 ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7em; transform: translate(-50%, -50%);">${cartCount}</span>` : ''}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('service')}" href="./pages/customer-service.html">Customer Service</a>
          </li>
        `;
      default: // guest
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="./index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('products')}" href="./pages/products/index.html">products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="./pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item position-relative">
            <a class="nav-link fw-semibold text-dark ${isActive('cart')}" href="./pages/cart/cart.html">
              Cart
              ${cartCount > 0 ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7em; transform: translate(-50%, -50%);">${cartCount}</span>` : ''}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('service')}" href="./pages/customer-service.html">Customer Service</a>
          </li>
        `;
    }
  };

  // Right side for home page
  const getRightSide = () => {
    switch (role.toLowerCase()) {
      case "admin":
        return `
          <div id="userMenu" class="dropdown">
            <button class="btn btn-outline-dark rounded-circle p-2" data-bs-toggle="dropdown">
              <i class="fa-solid fa-user-shield fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header text-danger">Admin Panel</h6></li>
              <li><a class="dropdown-item" href="./pages/admin.html"><i class="fa-solid fa-gauge me-2"></i>Dashboard</a></li>
              <li><a class="dropdown-item" href="./pages/admin.html#users"><i class="fa-solid fa-users me-2"></i>Manage Users</a></li>
              <li><a class="dropdown-item" href="./pages/admin.html#products"><i class="fa-solid fa-boxes me-2"></i>Manage Products</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        `;

      case "seller":
        return `
          <div id="userMenu" class="dropdown">
            <button class="btn btn-outline-dark rounded-circle p-2" data-bs-toggle="dropdown">
              <i class="fa-solid fa-store fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header text-primary">Seller Panel</h6></li>
              <li><a class="dropdown-item" href="./pages/sellerdashboard/index.html"><i class="fa-solid fa-chart-line me-2"></i>Dashboard</a></li>
              <li><a class="dropdown-item" href="./pages/sellerdashboard/products.html"><i class="fa-solid fa-box-open me-2"></i>My Products</a></li>
              <li><a class="dropdown-item" href="./pages/sellerdashboard/orders.html"><i class="fa-solid fa-truck me-2"></i>Orders</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="./pages/profile/index.html"><i class="fa-solid fa-user-gear me-2"></i>Profile</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        `;

      case "customer":
        return `
          <div id="userMenu" class="dropdown">
            <button class="btn btn-outline-dark rounded-circle p-2" data-bs-toggle="dropdown">
              <i class="fa-solid fa-user fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header text-primary">User Account</h6></li>
              <li><a class="dropdown-item" href="./pages/profile/index.html"><i class="fa-solid fa-user-gear me-2"></i>Profile</a></li>
              <li><a class="dropdown-item" href="./pages/profile/index.html#orders"><i class="fa-solid fa-box me-2"></i>Orders</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        `;

      default: // guest
        return `
          <div id="authLinks" class="d-flex gap-2">
            <a href="./pages/login/index.html" class="login_btn btn btn-outline-dark text-dark btn-sm">
              <i class="fa-solid fa-right-to-bracket me-1"></i> Login
            </a>
            <a href="./pages/signup/index.html" class="btn btn-primary signup_btn bg-dark text-white btn-outline-dark btn-sm">
              <i class="fa-solid fa-user-plus me-1"></i> Signup
            </a>
          </div>
        `;
    }
  };

  // Full Navbar for home page
  return `
    <header class="sticky-top bg-white shadow-sm border-bottom">
      <nav class="navbar navbar-expand-lg navbar-light py-2 px-lg-5">
        <div class="container-fluid">

          <!-- Logo -->
          <a class="navbar-brand fw-bold d-flex align-items-center" href="./index.html">
            <img src="./assets/home_page_img/logo.png" alt="Logo" height="40" class="me-2">
          </a>

          <!-- Collapsible Nav -->
          <div class="collapse navbar-collapse justify-content-center" id="mainNav">
            <ul class="navbar-nav mx-3 d-flex g-4">
              ${getMainLinks()}
            </ul>
          </div>

          <!-- Right Side (Dynamic) -->
          <div class="d-flex align-items-center gap-2 ms-3">
            ${getRightSide()}
          </div>

          <!-- Navbar Toggler -->
          <button class="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </header>
  `;
};

// Function to render navbar based on current page location
const renderNavbar = () => {
  const role = getUserRole();
  const currentPage = getCurrentPage();

  // Check if we're on the home page (root level)
  const isHomePage = window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html') &&
    !window.location.pathname.includes('/pages/');

  let navbarHTML;
  if (isHomePage) {
    navbarHTML = generateHomeNavbar(role, currentPage);
  } else {
    navbarHTML = generateNavbar(role, currentPage);
  }

  // Insert navbar at the beginning of body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
};

// Function to update cart counter in navbar
const updateCartCounter = () => {
  const cartCount = getCartItemsCount();
  const cartBadges = document.querySelectorAll('.nav-link[href*="cart"] .badge');
  
  cartBadges.forEach(badge => {
    badge.textContent = cartCount;
    // Hide badge if count is 0
    if (cartCount === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'inline-block';
    }
  });
};

// Logout function
const logout = () => {

  localStorage.removeItem('currentUser');
  window.location.href = '../../index.html';
};

// Export functions for use in other files
window.sharedUtils = {
  getUserRole,
  getCurrentPage,
  generateNavbar,
  generateHomeNavbar,
  renderNavbar,
  getCartItemsCount,
  updateCartCounter,
  logout
};
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


// add to cart
var cart = getItemFromLocalStorage("cart") || [];

function addToCart(product, quantity = 1) {
  try {
    // Input validation
    if (!product || !product.id) {
      showNotification("Invalid product data", "error");
      return false;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      showNotification("Invalid quantity. Please enter a positive number.", "error");
      return false;
    }

    if (!product.stock || product.stock <= 0) {
      showNotification("Product is out of stock", "error");
      return false;
    }

    // Check if product is already in cart
    let existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      // Product already exists in cart
      const newTotalQuantity = existingItem.qty + quantity;
      
      if (newTotalQuantity > product.stock) {
        showNotification(`Cannot add ${quantity} more. Only ${product.stock - existingItem.qty} items available in stock.`, "warning");
        return false;
      }
      
      // Update quantity
      existingItem.qty = newTotalQuantity;
      existingItem.lastUpdated = new Date().toISOString();
      
      showNotification(`Updated quantity to ${newTotalQuantity} for ${product.name}`, "success");
    } else {
      // First time adding to cart
      if (quantity > product.stock) {
        showNotification(`Cannot add ${quantity} items. Only ${product.stock} available in stock.`, "warning");
        return false;
      }
      
      // Add new item to cart
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        qty: quantity,
        stock: product.stock,
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      cart.push(cartItem);
      showNotification(`Added ${product.name} to cart`, "success");
    }

    // Save cart to localStorage
    setItemToLocalStorage("cart", cart);
    
    // Update cart badge if it exists
    updateCartBadge();
    
    // Dispatch custom event for other components to listen to
    const cartUpdateEvent = new CustomEvent('cartUpdated', { 
      detail: { cart, product, quantity } 
    });
    document.dispatchEvent(cartUpdateEvent);
    
    console.log("Cart updated:", cart);
    return true;
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    showNotification("Failed to add product to cart. Please try again.", "error");
    return false;
  }
}

// Helper function to update cart badge
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

// Enhanced function to remove item from cart
function removeFromCart(productId) {
  try {
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length < initialLength) {
      setItemToLocalStorage("cart", cart);
      updateCartBadge();
      
      const cartUpdateEvent = new CustomEvent('cartUpdated', { 
        detail: { cart, removedProductId: productId } 
      });
      document.dispatchEvent(cartUpdateEvent);
      
      showNotification("Product removed from cart", "success");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error removing from cart:", error);
    showNotification("Failed to remove product from cart", "error");
    return false;
  }
}

// Enhanced function to update cart item quantity
function updateCartQuantity(productId, newQuantity) {
  try {
    if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
      showNotification("Invalid quantity. Please enter a positive number.", "error");
      return false;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) {
      showNotification("Product not found in cart", "error");
      return false;
    }
    
    if (newQuantity > cartItem.stock) {
      showNotification(`Cannot set quantity to ${newQuantity}. Only ${cartItem.stock} available in stock.`, "warning");
      return false;
    }
    
    cartItem.qty = newQuantity;
    cartItem.lastUpdated = new Date().toISOString();
    
    setItemToLocalStorage("cart", cart);
    updateCartBadge();
    
    const cartUpdateEvent = new CustomEvent('cartUpdated', { 
      detail: { cart, updatedProductId: productId, newQuantity } 
    });
    document.dispatchEvent(cartUpdateEvent);
    
    showNotification(`Quantity updated to ${newQuantity}`, "success");
    return true;
    
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    showNotification("Failed to update quantity", "error");
    return false;
  }
}

// Function to get cart total
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// Function to get cart item count
function getCartItemCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

// Function to clear cart
function clearCart() {
  try {
    cart = [];
    setItemToLocalStorage("cart", cart);
    updateCartBadge();
    
    const cartUpdateEvent = new CustomEvent('cartUpdated', { 
      detail: { cart, cleared: true } 
    });
    document.dispatchEvent(cartUpdateEvent);
    
    showNotification("Cart cleared successfully", "success");
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    showNotification("Failed to clear cart", "error");
    return false;
  }
}

// Function to check if product is in cart
function isProductInCart(productId) {
  return cart.some(item => item.id === productId);
}

// Function to get cart item by product ID
function getCartItem(productId) {
  return cart.find(item => item.id === productId);
}

