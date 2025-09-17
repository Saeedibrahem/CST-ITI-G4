// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
    window.sharedUtils.renderNavbar();
  }

  initSwipers();
  displaySaleProducts(filteredProducts);
  displayAllProducts(filteredProducts);
});



function displaySaleProducts(products) {
  const swiperWrapper = document.querySelector(".saleSwiper .swiper-wrapper");

  swiperWrapper.innerHTML = "";

  products.filter(p => p.old_price).forEach(product => {

    const discount = Math.round(((product.old_price - product.price) / product.old_price) * 100);

    swiperWrapper.innerHTML += `
  <div class="swiper-slide">
    <div class="card product-card h-100 shadow-sm border-0">

      <!-- Product Image with Sale Badge -->
      <div class="img-box position-relative">
      
      <a href="../../pages/products/product.html?id=${product.id}">
      <img 
      src="${product.images[0] || '../../assets/img/placeholder.png'}" 
      class=" z-0 card-img-top main-img z-0" 
      alt="${product.name}">
      ${product.images[1]
        ? `<img src="${product.images[1]}" class="hover-img position-absolute top-0 start-0 w-100 h-100 z-0" alt="${product.name} Hover">`
        : ""
      }
      </a>
      ${discount
        ? `<div class="sale-badge_icon position-absolute z-3 top-0 start-0 bg-danger text-white px-2 py-1 small rounded-end">
               -${discount}%
             </div>`
        : ""
      }
      </div>

      <!-- Card Body -->
      <div class="card-body text-center d-flex flex-column">
        <a href="../../pages/products/product.html?id=${product.id}" class="text-decoration-none">
          <h6 class="product-title fw-bold text-dark">${product.name}</h6>
        </a>

        <!-- Price -->
        <div class="product-price d-flex justify-content-center align-items-center mb-3">
          <h5 class="mb-0 text-success fw-bold">EGP ${product.price}</h5>
          ${product.old_price
        ? `<del class="ms-2 text-muted  small">${product.old_price}</del>`
        : ""
      }
        </div>

<!-- Buttons -->
<div class="mt-auto btn-group-custom">
  <button 
    class="btn btn-sm btn-dark add-to-cart-btn w-100" 
    onclick="addToCartFromHome(${JSON.stringify(product).replace(/"/g, '&quot;')})"
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
`;
  })
}
function displayAllProducts(products) {
  const wrapper = document.querySelector(".allProductsSwiper .swiper-wrapper");
  wrapper.innerHTML = "";

  products.forEach(product => {
    wrapper.innerHTML += `
    <div class="swiper-slide">
      <div class="card product-card h-100 shadow-sm border-0">

        <!-- Product Image -->
        <div class="img-box position-relative">
          <a href="../../pages/products/product.html?id=${product.id}">
            <img 
              src="${product.images[0] || '../../assets/img/placeholder.png'}" 
              class="card-img-top main-img" 
              alt="${product.name}">
            ${product.images[1]
        ? `<img src="${product.images[1]}" class="hover-img position-absolute top-0 start-0 w-100 h-100" alt="${product.name} Hover">`
        : ""
      }
          </a>
        </div>

        <!-- Card Body -->
        <div class="card-body text-center d-flex flex-column">
          <a href="../../pages/products/product.html?id=${product.id}" class="text-decoration-none">
            <h6 class="product-title fw-bold text-dark">${product.name}</h6>
          </a>

          <!-- Price -->
          <div class="product-price d-flex justify-content-center align-items-center mb-3">
            <h6 class="mb-0 text-success fw-bold">EGP ${product.price}</h6>
            ${product.old_price
        ? `<del class="ms-2 text-muted small">${product.old_price}</del>`
        : ""
      }
          </div>

          <!-- Buttons -->
          <div class="mt-auto btn-group-custom">
            <button 
              class="btn btn-sm btn-dark add-to-cart-btn w-100" 
              onclick="addToCartFromHome(${JSON.stringify(product).replace(/"/g, '&quot;')})"
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
}

// Helper function to add product to cart from home page
function addToCartFromHome(productData) {
  if (typeof productData === 'string') {
    try {
      productData = JSON.parse(productData);
    } catch (error) {
      console.error('Error parsing product data:', error);
      showNotification("Invalid product data", "error");
      return;
    }
  }
  
  if (window.addToCart) {
    window.addToCart(productData, 1);
  } else {
    console.error('addToCart function not found');
    showNotification("Cart functionality not available", "error");
  }
}


//   document.querySelectorAll(".view-product-btn").forEach(btn => {
//   btn.addEventListener("click", e => {
//     const productId = e.target.dataset.id;
//     window.location.href = `product-details.html?id=${productId}`;
//   });
// });


//  Swipers Init 
function initSwipers() {
  // === Sale Swiper ===
  new Swiper(".saleSwiper", {
    loop: true,
    autoHeight: true, 

    spaceBetween: 20,
    navigation: {
      nextEl: ".sale-products .swiper-button-next",
      prevEl: ".sale-products .swiper-button-prev",
    },
    pagination: {
      el: ".sale-products .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 }, 
      576: { slidesPerView: 2, spaceBetween: 15 },  
      768: { slidesPerView: 3, spaceBetween: 20 }, 
      1200: { slidesPerView: 4, spaceBetween: 20 }, 
    },
  });

  // All Products Swiper 
  new Swiper(".allProductsSwiper", {
    loop: true,
    autoHeight: true,
    spaceBetween: 20,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".allProductsSwiper .swiper-button-next",
      prevEl: ".allProductsSwiper .swiper-button-prev",
    },
    pagination: {
      el: ".allProductsSwiper .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },   
      576: { slidesPerView: 2, spaceBetween: 15 }, 
      768: { slidesPerView: 3, spaceBetween: 20 },  
      1200: { slidesPerView: 4, spaceBetween: 20 },  
    },
  });
}



//  hero-sec section swiper
var swiper = new Swiper(".mySwiper", {
  loop: true,
  autoHeight: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  effect: "slide",
  speed: 800,
});


