// Fetch products and render them
fetch("./data/products.json")
  .then(res => res.json())
  .then(products => {
    setItemToLocalStorage("products", products);
    // renderProducts(products);
  })
  .catch(err => console.error("Error loading products:", err));

// Get Products from Local Storage
const products = getItemFromLocalStorage("products");

// function renderProducts(products) {
//   if (!products) return;

//   const productList = document.getElementById("product-list");
//   productList.innerHTML = "";

//   products.forEach(product => {
//     const productCard = document.createElement("div");
//     productCard.className = "col-md-4";
//     productCard.innerHTML = `
//       <div class="card h-100">
//         <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
//         <div class="card-body">
//           <h5 class="card-title">${product.name}</h5>
//           <p class="card-text text-truncate">${product.description}</p>
//           <h6 class="text-success">$${product.price}</h6>
//           <button class="btn btn-primary btn-sm mt-2" 
//             data-id="${product.id}" 
//             data-bs-toggle="modal" 
//             data-bs-target="#productModal">
//             View Details
//           </button>
//         </div>
//       </div>
//     `;

//     productList.appendChild(productCard);
//   });
// }

// Handle modal content
// document.addEventListener('DOMContentLoaded', function() {
//   document.addEventListener("click", function(e) {
//     if (e.target.matches("[data-bs-target='#productModal']")) {
//       const id = e.target.getAttribute("data-id");
//       const products = getItemFromLocalStorage("products");
//       if (!products) return;

//       const product = products.find(p => p.id == id);
//       if (!product) return;

//       document.getElementById("modalProductName").textContent = product.name;
//       document.getElementById("modalProductImage").src = product.images[0];
//       document.getElementById("modalProductDescription").textContent = product.description;
//       document.getElementById("modalProductPrice").textContent = product.price;

//       const specsList = document.getElementById("modalProductSpecs");
//       specsList.innerHTML = ""; // clear old specs
//       for (const [key, value] of Object.entries(product.specifications)) {
//         const li = document.createElement("li");
//         li.className = "list-group-item";
//         li.textContent = `${key}: ${value}`;
//         specsList.appendChild(li);
//       }
//     }
//   });
// });

// Local Storage Functions
// Get Item from Local Storage
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
