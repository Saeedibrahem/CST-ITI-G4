// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
  // Check if user is logged in
  if (!localStorage.getItem("currentUser")) {
    window.location.href = "../../index.html";
    return;
  }

  // Get current user data
  currentUser = getCurrentUser();
  if (!currentUser) {
    console.error("Failed to get current user data");
    window.location.href = "../../index.html";
    return;
  }

  // Get users data
  users = getUsers();

  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
    window.sharedUtils.renderNavbar();
  }

  // Initialize DOM element references
  firstName = document.getElementsByClassName("firstName");
  lastName = document.getElementsByClassName("lastName");
  email = document.getElementsByClassName("email");
  phone = document.getElementsByClassName("phone");
  address = document.getElementsByClassName("address");
  city = document.getElementsByClassName("city");
  country = document.getElementsByClassName("country");
  zip = document.getElementsByClassName("zip");
  DOB = document.getElementsByClassName("DOB");
  gender_data = document.getElementsByClassName("gender_data")[0];

  // Verify that all required DOM elements exist
  if (!firstName[0] || !firstName[1] || !lastName[0] || !lastName[1] ||
    !email[0] || !email[1] || !phone[0] || !phone[1] ||
    !address[0] || !address[1] || !city[0] || !city[1] ||
    !country[0] || !country[1] || !zip[0] || !zip[1] ||
    !DOB[0] || !DOB[1] || !gender_data) {
    console.error("Required DOM elements not found");
    return;
  }

  // Initialize profile data after DOM is loaded
  select_option1();
  cancle_btn();
  fill_myOrders_information();

  // fill user name and email
  if (currentUser) {
    document.getElementsByClassName("username")[0].innerHTML = currentUser.firstName;
    document.getElementsByClassName("useremail")[0].innerHTML = currentUser.email;
  }
});

// Global variables

// collect-toast-blocks
var toastElList = [].slice.call(document.querySelectorAll(".toast"));
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl);
});
// ====== option buttons ======
// ====== option buttons ======
// ====== option buttons ======
const optionBtn_1 = document.getElementsByClassName("option1")[0];
const optionBtn_2 = document.getElementsByClassName("option2")[0];
const optionBtn_3 = document.getElementsByClassName("option3")[0];
const card_2 = document.getElementsByClassName("card_2")[0];
const card_3 = document.getElementsByClassName("card_3")[0];
const card_4 = document.getElementsByClassName("card_4")[0];

function select_option1() {
  optionBtn_1.style.backgroundColor = "#befcff";
  optionBtn_2.style.backgroundColor = "white";
  optionBtn_3.style.backgroundColor = "white";
  card_2.style.display = "inline-block";
  card_3.style.display = "none";
  card_4.style.display = "none";
}
function select_option2() {
  optionBtn_2.style.backgroundColor = "#befcff";
  optionBtn_1.style.backgroundColor = "white";
  optionBtn_3.style.backgroundColor = "white";
  card_3.style.display = "inline-block";
  card_2.style.display = "none";
  card_4.style.display = "none";
}
function select_option3() {
  optionBtn_3.style.backgroundColor = "#befcff";
  optionBtn_1.style.backgroundColor = "white";
  optionBtn_2.style.backgroundColor = "white";
  card_4.style.display = "inline-block";
  card_2.style.display = "none";
  card_3.style.display = "none";
}
// select_option1() will be called after DOM loads

// ====== fill_profile_information() ======
// ====== fill_profile_information() ======
// ====== fill_profile_information() ======
// DOM element references - will be populated after DOM loads
let firstName, lastName, email, phone, address, city, country, zip, DOB, gender_data;
function fill_profile_information() {
  // Check if currentUser exists and has the required properties
  if (!currentUser) {
    console.error("No current user found");
    return;
  }

  firstName[0].innerHTML = currentUser.firstName || '';
  lastName[0].innerHTML = currentUser.lastName || '';
  email[0].innerHTML = currentUser.email || '';
  phone[0].innerHTML = currentUser.phone || '';
  address[0].innerHTML = currentUser.address || '';
  city[0].innerHTML = currentUser.city || '';
  country[0].innerHTML = currentUser.country || '';
  zip[0].innerHTML = currentUser.zip || '';
  DOB[0].innerHTML = currentUser.DOB || '';

  firstName[1].value = currentUser.firstName || '';
  lastName[1].value = currentUser.lastName || '';
  email[1].value = currentUser.email || '';
  phone[1].value = currentUser.phone || '';
  address[1].value = currentUser.address || '';
  city[1].value = currentUser.city || '';
  country[1].value = currentUser.country || '';
  zip[1].value = currentUser.zip || '';
  DOB[1].value = currentUser.DOB || '';

  // Safely set gender data
  if (currentUser.gender) {
    gender_data.innerHTML = currentUser.gender;

    // Safely find and check the gender radio button
    const genderRadio = document.querySelector(
      `input[name="gender"][value="${currentUser.gender}"]`
    );

    if (genderRadio) {
      genderRadio.checked = true;
    } else {
      console.warn(`Gender value "${currentUser.gender}" not found in radio buttons`);
    }
  } else {
    gender_data.innerHTML = '';
  }
}

// ====== save_profile_information() ======
// ====== save_profile_information() ======
// ====== save_profile_information() ======
function save_profile_information() {
  const new_firstName = document.getElementsByClassName("firstName")[1].value;
  const new_lastName = document.getElementsByClassName("lastName")[1].value;
  const new_email = document.getElementsByClassName("email")[1].value;
  const new_phone = document.getElementsByClassName("phone")[1].value;
  const new_address = document.getElementsByClassName("address")[1].value;
  const new_city = document.getElementsByClassName("city")[1].value;
  const new_country = document.getElementsByClassName("country")[1].value;
  const new_zip = document.getElementsByClassName("zip")[1].value;
  const new_DOB = document.getElementsByClassName("DOB")[1].value;
  const new_gender = document.querySelector(
    'input[name="gender"]:checked'
  ).value;

  //* create user
  let user = {
    id: currentUser.id,
    firstName: new_firstName,
    lastName: new_lastName,
    email: new_email,
    password: currentUser.password,
    role: currentUser.role,
    phone: new_phone,
    address: new_address,
    city: new_city,
    country: new_country,
    zip: new_zip,
    DOB: new_DOB,
    gender: new_gender,
  };

  //* remove old user
  users = users.filter((item) => item.id != currentUser.id);
  //* update users in localstorage
  users.push(user);
  const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
  localStorage.setItem("users", encryptedUsers);

  // Update currentUser in memory
  currentUser = user;

  // Refresh users data from localStorage
  users = getUsers();

  toastList[0].show();
}


// ====== fill_myOrders_information() ======
// ====== fill_myOrders_information() ======
// ====== fill_myOrders_information() ======
function fill_myOrders_information() {
  let selledProducts = getItemFromLocalStorage("invoices") || [];
  const orders = getItemFromLocalStorage("seller_orders"); // array of seller orders
  const invoices = getItemFromLocalStorage("invoices");    // array of invoices

  if (orders && orders.length > 0) {

    // get only invoices that match seller orders
    const myorders = invoices.filter(inv =>
      orders.some(order => order.id === inv.id)
    );

    selledProducts = myorders;

    // get only seller orders that match invoices
    const myorder = orders.filter(order =>
      invoices.some(inv => inv.id === order.id)
    );
    // console.log("Matched Seller Orders:", myorder);

    myorder.forEach(order => {
      // console.log(order.status);
      myorders.forEach(invoice => {
        let allmyorders = [...selledProducts];
        invoice.status = order.status;
        allmyorders.push(invoice);

        // console.log(invoice.status);
      });
    });

  } else {
    selledProducts = invoices
  }

  // get all sold products (invoices)
  // console.log("All Sold Products:", selledProducts);

  // console.log(selledProducts);
  const orders_form = document.getElementById("orders_form");

  if (!orders_form) {
    console.error("Orders form not found");
    return;
  }

  if (!Array.isArray(selledProducts) || selledProducts.length === 0) {
    orders_form.innerHTML = '<div class="text-center text-muted">No orders found</div>';
    return;
  }

  selledProducts.forEach((item, index) => {
    // console.log(item)
    if (item.customerId && currentUser.id && item.customerId == currentUser.id) {
      orders_form.innerHTML += `
      <div class="row-in-block">
        <div class="sub-info">
        <div class="label">Order Number</div>
        <div class="data">${index + 1}</div>
        </div>
        <div class="sub-info">
        <div class="label">Order Date</div>
        <div class="data">${item.createdAt || 'N/A'}</div>
        </div>
        <div class="sub-info">
        <div class="label">Order State</div>
        <div class="data" 
            style="color: ${item.status === "delivered"
          ? "green"
          : item.status === "Ongoing"
            ? "orange"
            : "black"
        };font-weight:bold;font-size:large">
        ${item.status || 'Unknown'}
        </div>
        </div>
    </div>
    <div class="row-in-block">
        <div class="sub-info">
        <div class="label">Order List (Quantity)</div>
        ${Array.isArray(item.items) ? item.items
          .map(
            (prod) => `<div class="data">${prod.name || 'Unknown Product'} (${prod.qty || 0})</div>`
          )
          .join("") : '<div class="data">No items</div>'}
        </div>
        <div class="sub-info">
        <div class="label">Total Price</div>
        <div class="data">${item.total || 0}$</div>
        </div>
        <div class="sub-info">
        <!-- <div class="label">Order State</div>
        <div class="data">Ongoing</div> -->
        </div>
    </div>
    <div class="sub-info">
        <div class="label">Delivering Date</div>
        <div class="data">${item.shippingDate || 'N/A'}</div>
    </div>
    </div>
    ${index != selledProducts.length - 1
          ? `<div
                style="
                    height: 3px;
                    background: black;
                    border-radius: 3px;
                    margin: 20px 0;
                "
            ></div>`
          : ""
        }
`;
    }
  });
}
// ====== change_password() ======
// ====== change_password() ======
// ====== change_password() ======
function change_password(e) {
  e.preventDefault();
  const oldPassword = currentUser.password;
  const entred_oldPassword =
    document.getElementById("entred_oldPassword").value;
  const new_password = document.getElementById("new_password").value;
  const confirm_new_password = document.getElementById(
    "confirm_new_password"
  ).value;

  if (
    oldPassword == entred_oldPassword &&
    new_password == confirm_new_password
  ) {
    //* create user
    let user = {
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      password: new_password,
      role: currentUser.role,
      phone: currentUser.phone,
      address: currentUser.address,
      city: currentUser.city,
      country: currentUser.country,
      zip: currentUser.zip,
      DOB: currentUser.DOB,
      gender: currentUser.gender,
    };

    //* remove old user
    users = users.filter((item) => item.id != currentUser.id);
    //* update users in localstorage
    users.push(user);
    const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
    localStorage.setItem("users", encryptedUsers);

    // Update currentUser in memory and localStorage
    currentUser = user;
    localStorage.setItem(
      "currentUser",
      encrypt_string_to_string(JSON.stringify(user))
    );

    // Refresh users data from localStorage
    users = getUsers();

    select_option1();
    toastList[1].show();
    document.getElementById("password_form").reset();
    document.getElementById("password_form").classList.remove("was-validated");
  } else {
    document.getElementById("password_form").classList.add("was-validated");
    if (oldPassword != entred_oldPassword) {
      toastList[2].show();
    } else if (new_password != confirm_new_password) {
      toastList[3].show();
    }
  }
}
// ====== buttons ======
// ====== buttons ======
// ====== buttons ======
const data_to_view = document.getElementsByClassName("data_to_view");
const data_to_enter = document.getElementsByClassName("data_to_enter");
function editProfile_btn() {
  for (const item of data_to_enter) {
    item.style.display = "inline-block";
  }
  for (const item of data_to_view) {
    item.style.display = "none";
  }
}
function save_btn(e) {
  e.preventDefault();
  document.getElementById("password_form").classList.add("was-validated");
  save_profile_information();
  fill_profile_information();
  cancle_btn();
}
function cancle_btn() {
  fill_profile_information();
  for (const item of data_to_view) {
    item.style.display = "inline-block";
  }
  for (const item of data_to_enter) {
    item.style.display = "none";
  }
}
// These functions are now called in DOMContentLoaded event
