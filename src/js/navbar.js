// Generate full navbar based on role
const getNavbar = (role = "guest") => {
  // Main Links
  const getMainLinks = () => {
    switch (role.toLowerCase()) {
      case "admin":
        return `
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/products/index.html">Catalog</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/aboutus/aboutus.html">About Us</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-danger" href="./pages/admin.html">Admin Dashboard</a></li>
      `;
      case "seller":
        return `
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/products/index.html">Catalog</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/aboutus/aboutus.html">About Us</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-primary" href="./pages/sellerdashboard/index.html">Seller Dashboard</a></li>
      `;
      case "customer":
        return `
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/products/index.html">Catalog</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/aboutus/aboutus.html">About Us</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/cart/cart.html">cart</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-success" href="./pages/profile/index.html#orders">My Orders</a></li>
      `;
      default: // guest
        return `
        <li class="nav-item"><a class="nav-link fw-semibold text-dark active" href="./index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/products/index.html">Catalog</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/aboutus/aboutus.html">About Us</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold text-dark" href="./pages/cart/cart.html">cart</a></li>
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
            <li><a class="dropdown-item" href="./pages/admin/dashboard.html"><i class="fa-solid fa-gauge me-2"></i>Dashboard</a></li>
            <li><a class="dropdown-item" href="./pages/admin/users.html"><i class="fa-solid fa-users me-2"></i>Manage Users</a></li>
            <li><a class="dropdown-item" href="./pages/admin/products.html"><i class="fa-solid fa-boxes me-2"></i>Manage Products</a></li>
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
            <li><a class="dropdown-item" href="./pages/seller/dashboard.html"><i class="fa-solid fa-chart-line me-2"></i>Dashboard</a></li>
            <li><a class="dropdown-item" href="./pages/seller/products.html"><i class="fa-solid fa-box-open me-2"></i>My Products</a></li>
            <li><a class="dropdown-item" href="./pages/seller/orders.html"><i class="fa-solid fa-truck me-2"></i>Orders</a></li>
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

  // Full Navbar
  return `
  <header class="sticky-top bg-white shadow-sm border-bottom ">
    <nav class="navbar navbar-expand-lg navbar-light py-2 px-lg-5 ">
      <div class="container-fluid">

        <!-- Logo -->
        <a class="navbar-brand fw-bold d-flex align-items-center" href="./index.html">
          <img src="../../assets/home_page_img/logo.png" alt="Logo" height="40" class="me-2">
        </a>

        <!-- Collapsible Nav -->
        <div class="collapse navbar-collapse justify-content-center" id="mainNav">
          <ul class="navbar-nav mx-3 d-flex g-4 ">
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

// This file is now deprecated. Use shared.js instead.
// The new system provides:
// - Dynamic navbar based on user role and current page
// - Automatic active state highlighting
// - Centralized management
// - Better path handling for different page levels

// To use the new system:
// 1. Include shared.js in your HTML
// 2. Call window.sharedUtils.renderNavbar() when page loads

console.log('Navbar.js is deprecated. Please use shared.js instead.');