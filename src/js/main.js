// ============================= products section =============================
// ============================= products section =============================
// Fetch products and render them
fetch("../data/products.json")
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

//! how to calculate TotalSales/TotoalOrders from products.json, add "sold" field after "stock"
//! how to calculate MonthlySales from products.json, add "monthlySales" field after "sold", [0,0,0,0,0,0,0,0,0,0,0,0]
//! login.js get admin data
// ============================= user section =============================
// ============================= user section =============================
// ============================= user section =============================
// fetch users one tiem
if (!localStorage.getItem("users")) {
  fetch("../data/users.json")
    .then((res) => res.json())
    .then((users) => {
      const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
      localStorage.setItem("users", encryptedUsers);
    })
    .catch((err) => console.error("Error loading users:", err));
}
// mock login
let loggedIn = getCurrentUser() ? true : false;

window.addEventListener("DOMContentLoaded", () => {
  const userMenu = document.getElementById("userMenu");
  const authLinks = document.getElementById("authLinks");

  if (loggedIn) {
    userMenu.classList.remove("d-none");
    authLinks.classList.add("d-none");
  } else {
    userMenu.classList.add("d-none");
    authLinks.classList.remove("d-none");
  }
});

function logout() {
  loggedIn = false;
  removeItemFromLocalStorage("currentUser");
  location.reload();
}
// encrypt func     abdo=>***
// if argument is string enter it, else enter JSON.stringify(data)
// to use next 3 methods you have to import cryptojs library
function encrypt_string_to_string(data) {
  const encryptedData = CryptoJS.AES.encrypt(data, "secret_key").toString();
  return encryptedData;
}
// decrypt func     ***=>abdo
function decrypt_string_to_string(data) {
  const bytes = CryptoJS.AES.decrypt(data, "secret_key");
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}
// get currentUser
function getCurrentUser() {
  if (localStorage.getItem("currentUser")) {
    const currentUser = JSON.parse(
      decrypt_string_to_string(localStorage.getItem("currentUser"))
    );
    return currentUser;
  }
}
// get users
function getUsers() {
  const users = JSON.parse(
    decrypt_string_to_string(localStorage.getItem("users"))
  );
  return users;
}
// ============================= product section =============================
// ============================= product section =============================
// ============================= product section =============================
// Fetch products one time
// if (!localStorage.getItem("products")) {
//   fetch("../../data/products.json")
//     .then((res) => res.json())
//     .then((products) => {
//       localStorage.setItem("products", JSON.stringify(products));
//     })
//     .catch((err) => console.error("Error loading products:", err));
// }
// // get products
// function getProducts() {
//   return JSON.parse(localStorage.getItem("products"));
// }
