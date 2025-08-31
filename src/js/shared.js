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
  if (path.includes('/products/')) return 'catalog';
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

    switch (role.toLowerCase()) {
      case "admin":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="../../pages/products/index.html">Catalog</a>
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
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="../../pages/products/index.html">Catalog</a>
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
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="../../pages/products/index.html">Catalog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="../../pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-success ${isActive('profile')}" href="../../pages/profile/index.html#orders">My Orders</a>
          </li>
        `;
      default: // guest
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="../../pages/products/index.html">Catalog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="../../pages/aboutus/aboutus.html">About Us</a>
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

    switch (role.toLowerCase()) {
      case "admin":
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="./index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="./pages/products/index.html">Catalog</a>
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
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="./pages/products/index.html">Catalog</a>
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
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="./pages/products/index.html">Catalog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="./pages/aboutus/aboutus.html">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-success ${isActive('profile')}" href="./pages/profile/index.html#orders">My Orders</a>
          </li>
        `;
      default: // guest
        return `
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="./index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('catalog')}" href="./pages/products/index.html">Catalog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-semibold text-dark ${isActive('about')}" href="./pages/aboutus/aboutus.html">About Us</a>
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
  logout
};
