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

  window.location.href = "./";
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
    let currentUser = JSON.parse(
      decrypt_string_to_string(localStorage.getItem("currentUser"))
    );
    return currentUser;
  }
}
// get users
function getUsers() {
  let users = JSON.parse(
    decrypt_string_to_string(localStorage.getItem("users"))
  );
  return users;
}
let currentUser = getCurrentUser();
let users = getUsers();

function redirectToRole() {
  if (currentUser ) {
    if (currentUser.role === "admin") {
      location.href = "../../pages/admin/index.html";
    } else if (currentUser.role === "seller") {
      location.href = "../../pages/seller/index.html";
    } else {
        location.href = "/";
    }
  } 
}

