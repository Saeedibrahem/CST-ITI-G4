// if user loggedin redirect to home page
if (localStorage.getItem("currentUser")) {
  //TODO: window.location.href = "../../index.html";
}
// confirmForm-func
function confirmForm(e) {
  e.preventDefault();
  // collect-form-data
  const my_form = document.getElementsByTagName("form")[0];
  const etnered_email = document.getElementById("email").value;
  const entered_password = document.getElementById("password").value;
  // collect-toast-blocks
  var toastElList = [].slice.call(document.querySelectorAll(".toast"));
  var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  // check-form-validity
  if (my_form.checkValidity()) {
    //* get users form localstorage
    const users = JSON.parse(
      decrypt_string_to_string(localStorage.getItem("users"))
    );
    const resultArr = users.filter((value) => {
      if (value.email == etnered_email && value.password == entered_password) {
        return value;
      }
    });
    console.log(users);
    console.log(resultArr);
    // check-if-user-exist
    if (resultArr.length > 0) {
      e.target.disabled = true;
      toastList[0].show();
      //* update currentUser in localstorage
      localStorage.setItem(
        "currentUser",
        encrypt_string_to_string(JSON.stringify(resultArr[0]))
      );
      // redirect-to-home-page
      window.location.href = "../../index.html";
    } else {
      e.target.disabled = true;
      setTimeout(() => {
        e.target.disabled = false;
      }, 2000);
      toastList[1].show();
    }
  } else {
    my_form.classList.add("was-validated");
  }
}
