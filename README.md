# CST-ITI-G4





<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile Phones Store</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet">

  <!-- Bootstrap + FontAwesome -->
  <link rel="stylesheet" href="./assets/lib/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">

  <!-- Custom CSS -->
  <link rel="stylesheet" href="./src/css/global.css">
  <link rel="stylesheet" href="./src/css/product_catalog.css">
</head>

<body>
<header>
  <nav class="top_nav nav_cont">
    <!-- logo -->
    <a class="logo" href="home_page.html">
      <img src="./assets/home_page_img/logo.png" alt="logo">
    </a>

    <!-- search bar -->
    <form action="" class="search">
      <input type="search" class="search" placeholder="Search for product...">
      <button type="submit">Search</button>
    </form>

    <!-- cart -->
    <div class="cart_header">
      <div class="icon_cart" onclick="open_cart()">
        <i class="fa-solid fa-cart-shopping"></i>
        <span class="count_item">0</span>
      </div>
      <div class="total_price">
        <p>My Cart</p>
      </div>
    </div>
  </nav>

  <!-- bottom nav -->
<div class="bottom_nav">
  <div class="links _cont">
<i onclick="open_menu()" class="fa-solid fa-bars open_menu"></i>
    <ul id="menu">
      <span class="bg_overlay " onclick="close_menu()">

      </span>


      <img src="./assets/home_page_img/iphone-seeklogo.png" class="logo_menu" alt="">


        <i class="fa-solid fa-xmark close_menu" onclick="close_menu()" style="color: #000000;"></i>
        <li class="active"><a href="#">Home</a></li>
        <li><a href="./product_catalog.html">Catalog</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>

      <!-- login / signup -->
      <div class="login_sign_up">
        <a href="#">Login <i class="fa-solid fa-right-to-bracket"></i></a>
        <a href="#">Signup<i class="fa-solid fa-user-plus"></i></a>
      </div>
    </div>
  </div>
</header>




























  <!-- Top Section -->
  <div class="top_page">
    <div class="catalog_container text-center py-5">
      <h1>product catalog</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
        Repellendus tempore vel iusto inventore similique ex ipsam assumenda!
        Reprehenderit, laboriosam laborum!
      </p>
    </div>
  </div>

  <!-- Main Layout -->
<!-- Main Layout -->
<div class="all_products container my-5">
  <div class="row">

    <!-- Sidebar / Filter -->
    <div class="filter col-lg-3 col-md-4 col-12 mb-4  p-3">
      <h5 class="mb-3">Filter Products</h5>

      <!-- Search Bar -->
      <div class="mb-4">
        <input type="text" class="form-control" placeholder="Search products...">
      </div>

      <!-- النوع -->
      <div class="mb-4">
        <label class="form-label fw-bold">brand</label>
        <select class="form-select">
          <option value="">All</option>
          <option value="samsung">Samsung</option>
          <option value="samsung">iphone</option>
          <option value="apple">oppo</option>
          <option value="apple">oneplus</option>
          <option value="apple">pixel</option>
          <option value="apple">realme</option>
          <option value="apple">honor</option>
          <option value="xiaomi">Xiaomi</option>
          <option value="huawei">Huawei</option>
          <option value="huawei">infinix</option>
        </select>
      </div>

      <!-- السعر -->
<div class="mb-4">
  <label class="form-label fw-bold">Sort by Price</label>
  <select id="priceSort" class="form-select">
    <option value="">Select</option>
    <option value="lowToHigh">Low to High</option>
    <option value="highToLow">High to Low</option>
  </select>
</div>




<div class="mb-4">
  <label class="form-label fw-bold">RAM</label>
  <select id="ramSelect" class="form-select">
    <option value="">Select</option>
    <option value="4GB">4GB</option>
    <option value="8GB">8GB</option>
    <option value="12GB">12GB</option>
    <option value="16GB">16GB</option>
  </select>
</div>

<div class="mb-4">
  <label class="form-label fw-bold">Storage</label>
  <select id="storageSelect" class="form-select">
    <option value="">Select</option>
    <option value="64GB">64GB</option>
    <option value="128GB">128GB</option>
    <option value="256GB">256GB</option>
    <option value="512GB">512GB</option>
    <option value="1TB">1TB</option>
  </select>
</div>




      <!-- نظام التشغيل -->
      <div class="mb-4">
        <label class="form-label fw-bold">Operating System</label>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="os" id="android" value="android">
          <label class="form-check-label" for="android">Android</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="os" id="ios" value="ios">
          <label class="form-check-label" for="ios">iOS</label>
        </div>
      </div>

<!-- 🔹 RAM -->
<div class="mb-3">
  <label for="ramSelect" class="form-label">RAM</label>
  <select id="ramSelect" class="form-select">
    <option value="">All</option>
    <option value="4GB">4GB</option>
    <option value="8GB">8GB</option>
    <option value="16GB">16GB</option>
  </select>
</div>

<!-- 🔹 Storage -->
<div class="mb-3">
  <label for="storageSelect" class="form-label">Storage</label>
  <select id="storageSelect" class="form-select">
    <option value="">All</option>
    <option value="128GB">128GB</option>
    <option value="256GB">256GB</option>
    <option value="512GB">512GB</option>
  </select>
</div>





  <div class="d-grid">
    <button id="applyFilters" class="btn btn-dark">Apply Filters</button>
  </div>
    </div>

    <!-- Products Container -->
    <div class="all_products_container col-lg-9 col-md-8 col-12">
      <div class="row g-4 wrapper">

      </div>
      <div class="pagination d-flex justify-content-center mt-4"></div>

    </div>
  </div>
</div>

  <!-- JS -->
  <script defer src="./assets/lib/js/bootstrap.bundle.min.js"></script>
  <script defer src="./src/js/shared.js"></script>
  <script defer src="./src/js/main.js"></script>
  <script defer src="./src/js/product_catalog.js"></script>
</body>

</html>
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener("DOMContentLoaded", () => {
  initProducts();
  initFilters();
});

async function initProducts() {
  const res = await fetch("./data/products.json");
  const products = await res.json();

  allProducts = products;
  localStorage.setItem("products", JSON.stringify(products));

  displayAllProducts(products);
}

function displayAllProducts(products, page = 1) {
  const wrapper = document.querySelector(".wrapper");
  const pagination = document.querySelector(".pagination"); 

  wrapper.innerHTML = "";
  pagination.innerHTML = "";

  //  حساب بداية ونهاية الصفحة
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);

  //  عرض المنتجات
  paginatedProducts.forEach(product => {
    const discount = product.old_price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

    wrapper.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card product-card h-100 shadow-sm border-0">
          <div class="img-box position-relative">
            ${discount ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${discount}%</span>` : ""}
            <a href="../../product-details.html?id=${product.id}">
              <img src="${product.images[0] || './assets/img/placeholder.png'}" 
                   class="card-img-top main-img" alt="${product.name}">
              ${product.images[1] 
                ? `<img src="${product.images[1]}" class="hover-img position-absolute top-0 start-0 w-100 h-100" alt="${product.name}">` 
                : ""}
            </a>
          </div>
          <div class="card-body text-center d-flex flex-column">
            <h6 class="product-title fw-bold">${product.name}</h6>
            <p class="text-muted small mb-2">${product.description}</p>
            <div class="product-price d-flex justify-content-center align-items-center mb-3">
              <h5 class="mb-0 text-success fw-bold">${product.price}</h5>
              <del class="ms-2 text-muted small">EGP ${product.old_price || ""}</del>
            </div>
            <div class="mt-auto d-flex justify-content-center gap-2">
              <button class="btn btn-sm btn-dark add-to-cart-btn px-3" data-id="${product.id}">
                <i class="fa fa-shopping-cart me-1"></i> Add to Cart
              </button>
              <a href="../../product-details.html?id=${product.id}" class="btn btn-sm btn-outline-secondary px-3">
                View Product
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <button class="btn btn-sm ${i === page ? "btn-dark" : "btn-outline-dark"} mx-1" data-page="${i}">
          ${i}
        </button>
      `;
    }
    
    // click events
    document.querySelectorAll(".pagination button").forEach(btn => {
      btn.addEventListener("click", e => {
        currentPage = parseInt(e.target.dataset.page);
        displayAllProducts(products, currentPage);
      });
    });
  }
}

  function initFilters() {
    const searchInput = document.querySelector(".filter input[type='text']");
    const typeSelect = document.querySelector(".filter select");
  const priceSort = document.getElementById("priceSort"); 
    const colorCircles = document.querySelectorAll(".filter .color-circle");
    const opreatingsystem = document.querySelectorAll(".filter input[name='os']");
    const applyBtn = document.getElementById("applyFilters");
  const ramSelect = document.getElementById("ramSelect");
  const storageSelect = document.getElementById("storageSelect");


applyBtn.addEventListener("click", () => {
  let filtered = [...allProducts];

  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
  }

  const typeValue = typeSelect.value;
  if (typeValue) {
    filtered = filtered.filter(p => p.type && p.type.toLowerCase() === typeValue.toLowerCase());
  }

  //  price
  const sortValue = priceSort.value;
  if (sortValue === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }


  const osValue = [...opreatingsystem].find(r => r.checked)?.value;
  if (osValue) {
    filtered = filtered.filter(p => p.os && p.os.toLowerCase() === osValue.toLowerCase());
  }

  //ram
  const ramValue = ramSelect.value;
  if (ramValue) {
    filtered = filtered.filter(p => 
      p.specifications?.RAM && p.specifications.RAM.toLowerCase() === ramValue.toLowerCase()
    );
  }

  // storage
  const storageValue = storageSelect.value;
  if (storageValue) {
    filtered = filtered.filter(p => 
      p.specifications?.Storage && p.specifications.Storage.toLowerCase() === storageValue.toLowerCase()
    );
  }

  currentPage = 1;
  displayAllProducts(filtered, currentPage);
});
  }


























  
















































  const params = new URLSearchParams(window.location.search);
const productId = params.get("id");


if (productId) {
  const storedProducts = localStorage.getItem("products") ;

  if (storedProducts) {
    const products = JSON.parse(storedProducts);
    const product = products.find((p) => p.id == productId);

    if (product) {
      displayProductDetails(product);
    } else {
      document.getElementById("product-details").innerHTML = `
        <div class="col-12 text-center">
          <h2>Product not found!</h2>
          <a href="index.html" class="btn btn-outline-dark mt-3">⬅ Back to Home</a>
        </div>
      `;
    }
  }
}

function displayProductDetails(product) {
  const container = document.querySelector(".container");
  container.innerHTML = `
  <div class="product-card_details my-5 d-flex ">
    <!-- Left Side: Product Image -->
<div class="product-image order-100">
  <img src="${product.images[0]}" id="main-image" class="main-img">
      
  <!-- Thumbnails -->
  <div class="product-gallery">
    ${product.images.map((img, index) => `
      <img src="${img}" 
           alt="thumb-${index}" 
           class="gallery-thumb ${index === 0 ? 'active' : ''}">
    `).join('')}
  </div>
</div>

    <!-- Right Side: Product Info -->
    <div class="product-info">
      <h2 class="product-name">${product.name}</h2>
      <p class="product-category">Category: ${product.category}</p>

      <div class="price-box">
        ${product.old_price ? `<del>EGP${product.old_price}</del>` : ""}
        <h2 class="new-price">$${product.price}</h2>
      </div>

      <p class="description text-start">Description: ${product.description}</p>
      <p class="stock">Stock: <strong>${product.stock}</strong> available</p>
      <p class="rating">Rating: ⭐${product.rating} / 5</p>

      <!-- Quantity Selector -->
      <div class="quantity-box d-flex align-items-center mb-3">
        <button class="btn btn-sm btn-outline-dark" id="decrease">-</button>
        <input type="number" id="quantity" value="1" min="1" 
               max="${product.stock}" 
               class="form-control text-center mx-2" 
               style="width:70px;">
        <button class="btn btn-sm btn-outline-dark" id="increase">+</button>
      </div>

      <div class="actions">
        <button class="btn bg-black text-white">Add to Cart</button>
        <a href="home_page.html" class="btn back-home">Back to Home</a>
        <a href="product_catalog.html" class="btn back-home">Back to product catalog</a>
      </div>



      
    </div>
    
  </div>
  
  `;

  // --- changing img ---
  const mainImage = document.getElementById("main-image");
  const thumbs = document.querySelectorAll(".gallery-thumb");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      thumbs.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  // --- Quantity Counter ---
  const quantityInput = document.getElementById("quantity");
  document.getElementById("increase").addEventListener("click", () => {
    if (quantityInput.value < product.stock) {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    }
  });

  document.getElementById("decrease").addEventListener("click", () => {
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  });
}







// review  and


const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => btn.addEventListener('click', () => {
  const tabId = btn.dataset.tab; // getAttribute('data-tab') 

  tabBtns.forEach(b => b.classList.toggle('active', b === btn));

  tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
}));
































































const params = new URLSearchParams(window.location.search);
const productId = params.get("id");


if (productId) {
  const storedProducts = localStorage.getItem("products") ;

  if (storedProducts) {
    const products = JSON.parse(storedProducts);
    const product = products.find((p) => p.id == productId);

    if (product) {
      displayProductDetails(product);
    } else {
      document.getElementById("product-details").innerHTML = `
        <div class="col-12 text-center">
          <h2>Product not found!</h2>
          <a href="index.html" class="btn btn-outline-dark mt-3">⬅ Back to Home</a>
        </div>
      `;
    }
  }
}

function displayProductDetails(product) {
  const container = document.querySelector(".container");
  container.innerHTML = `
  <div class="product-card my-5 d-flex">
    <!-- Left Side: Product Image -->
    <div class="product-image order-1">
      <img src="${product.images[0]}" alt="iPhone 13 Pro Max" id="main-image">
      
    </div>

    <!-- Right Side: Product Info -->
    <div class="product-info">
      <h2 class="product-name">${product.name}</h2>

      <p class="product-category">Category:${product.category}</p>

      <div class="price-box">
                ${product.old_price ? `<del>EGP${product.old_price}</del>` : ""}
        <h2 class="new-price">$${product.price}</h2>
      </div>

      <p class="description" text>
description : ${product.description}
      </p>

      <p class="stock">Stock: <strong>${product.stock}</strong> available</p>

      <p class="rating">Rating: ⭐${product.rating} / 5</p>

      <div class="actions">
        <button class="btn bg-black text-white">Add to Cart</button>
        <a href="home_page.html" class="btn back-home">Back to Home</a>
        <a href="product_catalog.html" class="btn back-home">Back to product catalog</a>
      </div>
    </div>
  </div>
  
  <!-- Product Details Tabs -->
  <div class="product-tabs">
    <div class="tabs-header">
      <button class="tab-btn active" data-tab="specifications">Specifications</button>
      <button class="tab-btn" data-tab="description">Description</button>
      <button class="tab-btn" data-tab="reviews">Reviews</button>
    </div>
    
    <div class="tab-content active" id="specifications">
      <table class="specs-table">
        <tr>
          <td>Display</td>
          <td>${product.specifications.Display}</td>
        </tr>
        <tr>
          <td>Processor</td>
          <td>${product.specifications.Processor}</td>
        </tr>
        <tr>
          <td>Storage</td>
          <td>${product.specifications.Storage}</td>
        </tr>
        <tr>
          <td>Camera</td>
          <td>${product.specifications.Camera}</td>
        </tr>
        <tr>
          <td>Battery</td>
          <td>${product.specifications.Battery}</td>
        </tr>
        <tr>
          <td>RAM</td>
          <td>${product.specifications.RAM}</td>
        </tr>
      </table>
    </div>
    
    <div class="tab-content" id="description">
      <p>${product.description}.</p>
    </div>
    
    <div class="tab-content" id="reviews">
      <div class="review">
      <div class="review">
        <div class="review-header">
          <span class="reviewer"><i class="fa-solid fa-user"></i> ${product.userComments[0].username} <br></span>
          <span class="review-rating">Rating : ${product.userComments[0].rating}⭐️</span>
        </div>
        <p class="review-text">${product.userComments[0].comment} </p>
      </div>
      
  </div>



  
  `;
}

















const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => btn.addEventListener('click', () => {
  const tabId = btn.dataset.tab; // نفس getAttribute('data-tab') لكن أبسط

  // إزالة active من كل الأزرار وإضافة للزر الحالي
  tabBtns.forEach(b => b.classList.toggle('active', b === btn));

  // إظهار المحتوى المناسب وإخفاء الباقي
  tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
}));
