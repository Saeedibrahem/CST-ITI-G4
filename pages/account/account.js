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
select_option1();

// ====== fill_profile_information() ======
// ====== fill_profile_information() ======
// ====== fill_profile_information() ======
let currentUser = getCurrentUser();
let users = getUsers();
const firstName = document.getElementsByClassName("firstName");
const lastName = document.getElementsByClassName("lastName");
const email = document.getElementsByClassName("email");
const phone = document.getElementsByClassName("phone");
const address = document.getElementsByClassName("address");
const city = document.getElementsByClassName("city");
const country = document.getElementsByClassName("country");
const zip = document.getElementsByClassName("zip");
const DOB = document.getElementsByClassName("DOB");
const gender_data = document.getElementsByClassName("gender_data")[0];
function fill_profile_information() {
  currentUser = getCurrentUser();
  users = getUsers();
  firstName[0].innerHTML = currentUser.firstName;
  lastName[0].innerHTML = currentUser.lastName;
  email[0].innerHTML = currentUser.email;
  phone[0].innerHTML = currentUser.phone;
  address[0].innerHTML = currentUser.address;
  city[0].innerHTML = currentUser.city;
  country[0].innerHTML = currentUser.country;
  zip[0].innerHTML = currentUser.zip;
  DOB[0].innerHTML = currentUser.DOB;

  firstName[1].value = currentUser.firstName;
  lastName[1].value = currentUser.lastName;
  email[1].value = currentUser.email;
  phone[1].value = currentUser.phone;
  address[1].value = currentUser.address;
  city[1].value = currentUser.city;
  country[1].value = currentUser.country;
  zip[1].value = currentUser.zip;
  DOB[1].value = currentUser.DOB;
  gender_data.innerHTML = currentUser.gender;
  document.querySelector(
    `input[name="gender"][value="${currentUser.gender}"]`
  ).checked = true;
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
  //* update currentUser in localstorage
  localStorage.setItem(
    "currentUser",
    encrypt_string_to_string(JSON.stringify(user))
  );

  toastList[0].show();
}
// ====== fill_myOrders_information() ======
// ====== fill_myOrders_information() ======
// ====== fill_myOrders_information() ======
function fill_myOrders_information() {
  const selledProducts = [
    {
      id_of_product: 0,
      id_of_customer_bought_that_product: 0,
      order_status: "delivered",
      quantity_sold: 5,
      buy_item_at: "14-8-2025",
      totalPrice: 5000,
      listOfItems: [
        {
          name: "iPhone 13 Pro Max",
          quantity: 2,
        },
        {
          name: "infinix 7",
          quantity: 1,
        },
      ],
    },
    {
      id_of_product: 0,
      id_of_customer_bought_that_product: 0,
      order_status: "Ongoing",
      quantity_sold: 3,
      buy_item_at: "14-10-2025",
      totalPrice: 3000,
      listOfItems: [
        {
          name: "Realme c9",
          quantity: 2,
        },
        {
          name: "oppo b7",
          quantity: 4,
        },
      ],
    },
  ];
  const orders_form = document.getElementById("orders_form");
  selledProducts.map((item, index) => {
    if (item.id_of_customer_bought_that_product == currentUser.id) {
      orders_form.innerHTML += `
      <div class="row-in-block">
        <div class="sub-info">
        <div class="label">Order Number</div>
        <div class="data">${index}</div>
        </div>
        <div class="sub-info">
        <div class="label">Order Date</div>
        <div class="data">${item.buy_item_at}</div>
        </div>
        <div class="sub-info">
        <div class="label">Order State</div>
        <div class="data" 
            style="color: ${
              item.order_status === "delivered"
                ? "green"
                : item.order_status === "Ongoing"
                ? "orange"
                : "black"
            };font-weight:bold;font-size:large">
        ${item.order_status}
        </div>
        </div>
    </div>
    <div class="row-in-block">
        <div class="sub-info">
        <div class="label">Order List (Quantity)</div>
        ${item.listOfItems
          .map(
            (prod) => `<div class="data">${prod.name} (${prod.quantity})</div>`
          )
          .join("")}
        </div>
        <div class="sub-info">
        <div class="label">Total Price</div>
        <div class="data">${item.totalPrice}$</div>
        </div>
        <div class="sub-info">
        <!-- <div class="label">Order State</div>
        <div class="data">Ongoing</div> -->
        </div>
    </div>
    <div class="sub-info">
        <div class="label">Delivering Date</div>
        <div class="data">${item.buy_item_at}</div>
    </div>
    </div>
    ${
      index != selledProducts.length - 1
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
    //* update currentUser in localstorage
    localStorage.setItem(
      "currentUser",
      encrypt_string_to_string(JSON.stringify(user))
    );

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
cancle_btn();
fill_myOrders_information();
// fill user name and email
document.getElementsByClassName("username")[0].innerHTML =
  currentUser.firstName;
document.getElementsByClassName("useremail")[0].innerHTML = currentUser.email;
