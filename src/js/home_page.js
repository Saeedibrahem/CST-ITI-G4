



// async function initProducts() {
//     const res = await fetch("./data/products.json");
//     const products = await res.json();

//     localStorage.setItem("products", JSON.stringify(products));

// products = getItemFromLocalStorage("products");

// }
displaySaleProducts(products);
displayAllProducts(products);
initSwipers();

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
        ${discount
        ? `<div class="sale-badge_icon position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small rounded-end">
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
        <p class="text-muted small mb-2">${product.description}</p>

        <!-- Price -->
        <div class="product-price d-flex justify-content-center align-items-center mb-3">
          <h5 class="mb-0 text-success fw-bold">EGP ${product.price}</h5>
          ${product.old_price
        ? `<del class="ms-2 text-muted small">EGP ${product.old_price}</del>`
        : ""
      }
        </div>

        <!-- Buttons -->
        <div class="mt-auto d-flex justify-content-center gap-2">
          <button 
            class="btn btn-sm btn-dark add-to-cart-btn px-3" 
            data-id="${product.id}">
            <i class="fa fa-shopping-cart me-1"></i> Add to Cart
          </button>
          <a 
            href="../../pages/products/product.html?id=${product.id}" 
            class="btn btn-sm btn-outline-secondary px-4 py-2">
            View Product
          </a>
        </div>
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
        ? `<img src="${product.images[1]}" class="hover-img position-absolute top-0 start-0 w-100 h-100" alt="${product.name}">`
        : ""
      }
          </a>
        </div>

        <!-- Card Body -->
        <div class="card-body text-center d-flex flex-column">
          <h6 class="product-title fw-bold">${product.name}</h6>
          <p class="text-muted small mb-2">${product.description}</p>

          <!-- Price -->
          <div class="product-price d-flex justify-content-center align-items-center mb-3">
            <h5 class="mb-0 text-success fw-bold">EGP ${product.price}</h5>
            ${product.old_price
        ? `<del class="ms-2 text-muted small">EGP ${product.old_price}</del>`
        : ""
      }
          </div>

          <!-- Buttons -->
          <div class="mt-auto d-flex justify-content-center gap-2">
            <button 
              class="btn btn-sm btn-dark add-to-cart-btn px-3" 
              data-id="${product.id}">
              <i class="fa fa-shopping-cart me-1"></i> Add to Cart
            </button>
            <a 
              href="../../pages/products/product.html?id=${product.id}" 
              class="btn btn-sm btn-outline-secondary px-3">
              View Product
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  });
}


//   document.querySelectorAll(".view-product-btn").forEach(btn => {
//   btn.addEventListener("click", e => {
//     const productId = e.target.dataset.id;
//     window.location.href = `product-details.html?id=${productId}`;
//   });
// });


//  Swipers Init 
function initSwipers() {
  new Swiper(".saleSwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      992: { slidesPerView: 4 },
    }
  });

  new Swiper(".allProductsSwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
    },
  });
}



//  hero section swiper
var swiper = new Swiper(".mySwiper", {
  loop: true,
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

