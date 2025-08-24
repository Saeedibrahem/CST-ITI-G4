//! how to calculate TotalSales/TotoalOrders from products.json, add "sold" field after "stock"
//! how to calculate MonthlySales from products.json, add "monthlySales" field after "sold", [0,0,0,0,0,0,0,0,0,0,0,0]
//! login.js get admin data
// ============================= user section =============================
// ============================= user section =============================
// ============================= user section =============================
// fetch users one tiem
if (!localStorage.getItem("users")) {
  fetch("../../data/users.json")
    .then((res) => res.json())
    .then((users) => {
      const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
      localStorage.setItem("users", encryptedUsers);
    })
    .catch((err) => console.error("Error loading users:", err));
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
if (!localStorage.getItem("products")) {
  fetch("../../data/products.json")
    .then((res) => res.json())
    .then((products) => {
      localStorage.setItem("products", JSON.stringify(products));
    })
    .catch((err) => console.error("Error loading products:", err));
}
// get products
function getProducts() {
  return JSON.parse(localStorage.getItem("products"));
}




