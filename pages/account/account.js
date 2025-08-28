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

  if (new_firstName.length == 0) {
    new_firstName = undefined;
  }
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
}
// ====== fill_myOrders_information ======
// ====== fill_myOrders_information ======
// ====== fill_myOrders_information ======

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
