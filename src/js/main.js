document.addEventListener('DOMContentLoaded', function () {

  // ============================= products section =============================
  // Fetch products and render them
  fetch("../../data/products.json")
    .then(res => res.json())
    .then(products => {
      if (!getItemFromLocalStorage("products")) {
        setItemToLocalStorage("products", products);
      }
      else {
        return;
      }
      // renderProducts(products);
    })
    .catch(err => console.error("Error loading products:", err));

  if (!localStorage.getItem("users")) {
    fetch("../data/users.json")
      .then((res) => res.json())
      .then((users) => {
        const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
        localStorage.setItem("users", encryptedUsers);
      })
      .catch((err) => console.error("Error loading users:", err));
  }
});
// Get Products from Local Storage
const products = getItemFromLocalStorage("products");
// filter products
let filteredProducts = products ? products.filter(p => p.adminReview.status === 'approved') : [];


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
