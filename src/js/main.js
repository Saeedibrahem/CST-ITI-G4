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

// Get Products from Local Storage
const products = getItemFromLocalStorage("products");
// filter products
let filteredProducts = products.filter(p => p.adminReview.status === 'approved');


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
// let loggedIn = getCurrentUser() ? true : false;


// function logout() {
//   loggedIn = false;
//   removeItemFromLocalStorage("currentUser");
//   window.location.href = "./";
// }
// encrypt func     abdo=>***
// if argument is string enter it, else enter JSON.stringify(data)
// to use next 3 methods you have to import cryptojs library
// function encrypt_string_to_string(data) {
//   const encryptedData = CryptoJS.AES.encrypt(data, "secret_key").toString();
//   return encryptedData;
// }
// // decrypt func     ***=>abdo
// function decrypt_string_to_string(data) {
//   const bytes = CryptoJS.AES.decrypt(data, "secret_key");
//   const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//   return decryptedData;
// }
// // get currentUser
// function getCurrentUser() {
//   if (localStorage.getItem("currentUser")) {
//     const currentUser = JSON.parse(
//       decrypt_string_to_string(localStorage.getItem("currentUser"))
//     );
//     return currentUser;
//   }
// }
// // get users
// function getUsers() {
//   const users = JSON.parse(
//     decrypt_string_to_string(localStorage.getItem("users"))
//   );
//   return users;
// }











