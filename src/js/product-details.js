// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
      window.sharedUtils.renderNavbar();
  }
});const params = new URLSearchParams(window.location.search);
const productId = params.get("id");


if (productId) {
  const storedProducts = localStorage.getItem("products");

  if (storedProducts) {
    const products = JSON.parse(storedProducts);
    const product = products.find((p) => p.id == productId);

    if (product) {
      displayProductDetails(product);
    } else {
      document.getElementById("product-details").innerHTML = `
        <div class="col-12 text-center">
          <h2>Product not found!</h2>
          <a href="../../index.html" class="btn btn-outline-dark mt-3">⬅ Back to Home</a>
        </div>
      `;
    }
  }
}

function displayProductDetails(product) {
  const container = document.querySelector(".container");
  container.innerHTML = `
  <div class="product-card_details  d-flex ">
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
        <button id="addToCart" class="btn bg-black text-white"  >Add to Cart</button>
        <a href="../../index.html" class="btn back-home">Back to Home</a>
        <a href="../../pages/products/index.html" class="btn back-home">Back to product catalog</a>
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

  //  changing img 
  const mainImage = document.getElementById("main-image");
  const thumbs = document.querySelectorAll(".gallery-thumb");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      thumbs.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  //   counter 
  const quantityInput = document.getElementById("quantity");
  document.getElementById("increase").addEventListener("click", () => {
    if (quantityInput.value < product.stock) {
      if (quantityInput.value < product.stock){
              quantityInput.value = parseInt(quantityInput.value) + 1;
      }
      
    }
  });

  document.getElementById("decrease").addEventListener("click", () => {
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  });


  // add to cart 
  document.getElementById("addToCart").addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(product, quantity);
  });

}



// review  and descript
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => btn.addEventListener('click', () => {
  const tabId = btn.dataset.tab; // getAttribute('data-tab') 

  tabBtns.forEach(b => b.classList.toggle('active', b === btn));

  tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
}));






// add to cart

// var cart = JSON.parse(localStorage.getItem("cart")) || [];







