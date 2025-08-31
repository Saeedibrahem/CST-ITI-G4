// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
    window.sharedUtils.renderNavbar();
  }
}); 
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener("DOMContentLoaded", () => {
  initProducts();
  initEventListeners();
});


async function initProducts() {
  if (!getItemFromLocalStorage("products")) {
    const res = await fetch("../../data/products.json");
    const products = await res.json();
    // filter products
    filteredProducts = products.filter(p => p.adminReview.status === 'approved');
    allProducts = filteredProducts;
    localStorage.setItem("allProducts", JSON.stringify(products));
  }
  else {
    filteredProducts = getItemFromLocalStorage("products").filter(p => p.adminReview.status === 'approved');
    allProducts = getItemFromLocalStorage("products");
  }

  displayAllProducts(filteredProducts);
}

// display products

function displayAllProducts(products, page = 1) {
  const wrapper = document.getElementById("productsWrapper");
  const pagination = document.querySelector(".pagination");
  const notFoundMessage = document.getElementById("notFoundMessage");

  wrapper.innerHTML = "";
  pagination.innerHTML = "";

  // Show not found message if no products
  if (products.length === 0) {
    notFoundMessage.classList.remove("d-none");
    return;
  } else {
    notFoundMessage.classList.add("d-none");
  }

  // pages start and end
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);

  paginatedProducts.forEach(product => {
    const discount = product.old_price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

    wrapper.innerHTML += `
<div class="col-md-6 col-lg-4">
  <div class="card product-card h-100 shadow-sm border-0">
    <div class="img-box position-relative">
      ${discount
        ? `<div class="sale-badge_icon position-absolute z-3 top-0 start-0 bg-danger text-white px-2 py-1 small rounded-end">
            -${discount}%
          </div>`
        : ""
      }
      <a href="../../pages/products/product.html?id=${product.id}">
        <img 
          src="${product.images[0] || '../../assets/img/placeholder.png'}" 
          class="card-img-top main-img" 
          alt="${product.name}">
        ${product.images[1]
        ? `<img src="${product.images[1]}" class="hover-img position-absolute top-0 start-0 w-100 h-100" alt="${product.name}">`
        : ""
      }
      </a>
    </div>

    <div class="card-body text-center d-flex flex-column">
      <a href="../../pages/products/product.html?id=${product.id}" class="text-decoration-none">
        <h6 class="product-title fw-bold text-dark">${product.name}</h6>
      </a>
      <p class="text-muted small mb-2">${product.description || ""}</p>

      <div class="product-price d-flex justify-content-center align-items-center mb-3">
        <h6 class="mb-0 text-success fw-bold">EGP ${product.price}</h6>
        ${product.old_price
        ? `<del class="ms-2 text-muted small">${product.old_price}</del>`
        : ""
      }
      </div>

      <div class="mt-auto btn-group-custom">
        <button 
        onclick="addToCart(${product.id})"
          class="btn btn-sm btn-dark add-to-cart-btn w-100" 
          data-id="${product.id}">
          <i class="fa fa-shopping-cart me-1"></i> Add to Cart
        </button>
        <a 
          href="../../pages/products/product.html?id=${product.id}" 
          class="btn btn-sm btn-outline-secondary w-100">
          View Product
        </a>
      </div>
    </div>
  </div>
</div>

          `;
  });

  // pagees pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
            <button class="btn btn-sm ${i === page ? "btn-dark" : "btn-outline-dark"} mx-1" data-page="${i}">
              ${i}
            </button>
          `;
    }

    //  event listeners 
    document.querySelectorAll(".pagination button").forEach(btn => {
      btn.addEventListener("click", e => {
        currentPage = parseInt(e.target.dataset.page);
        displayAllProducts(products, currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}


function initEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const brandSelect = document.getElementById("brandSelect");
  const priceSort = document.getElementById("priceSort");
  const osRadios = document.querySelectorAll("input[name='os']");
  const ramSelect = document.getElementById("ramSelect");
  const storageSelect = document.getElementById("storageSelect");
  const applyBtn = document.getElementById("applyFilters");
  const resetBtn = document.getElementById("resetFilters");

  // filters
  [brandSelect, priceSort, ramSelect, storageSelect].forEach(element => {
    element.addEventListener("change", applyFilters);
  });

  // opr sys filter
  osRadios.forEach(radio => {
    radio.addEventListener("change", applyFilters);
  });

  applyBtn.addEventListener("click", applyFilters);

  resetBtn.addEventListener("click", resetFilters);
}

function applyFilters() {
  let filtered = [...allProducts];

  // name serch
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchValue) ||
      (p.description && p.description.toLowerCase().includes(searchValue))
    );
  }

  // brand
  const brandValue = document.getElementById("brandSelect").value;
  if (brandValue) {
    filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === brandValue.toLowerCase());
  }

  // price
  const sortValue = document.getElementById("priceSort").value;
  if (sortValue === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // os
  const osValue = document.querySelector("input[name='os']:checked")?.value;
  if (osValue) {
    filtered = filtered.filter(p => p.os && p.os.toLowerCase() === osValue.toLowerCase());
  }

  // ram
  const ramValue = document.getElementById("ramSelect").value;
  if (ramValue) {
    filtered = filtered.filter(p =>
      p.specifications?.RAM && p.specifications.RAM.toLowerCase() === ramValue.toLowerCase()
    );
  }

  //  Storage
  const storageValue = document.getElementById("storageSelect").value;
  if (storageValue) {
    filtered = filtered.filter(p =>
      p.specifications?.Storage && p.specifications.Storage.toLowerCase() === storageValue.toLowerCase()
    );
  }

  currentPage = 1;
  displayAllProducts(filtered, currentPage);
}
// rest filter btn
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("brandSelect").value = "";
  document.getElementById("priceSort").value = "";
  document.getElementById("ramSelect").value = "";
  document.getElementById("storageSelect").value = "";

  const osRadios = document.querySelectorAll("input[name='os']");
  osRadios.forEach(radio => radio.checked = false);

  currentPage = 1;
  displayAllProducts(allProducts, currentPage);
}




















