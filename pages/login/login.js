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
    // get-users-from-localstorage
    const users = JSON.parse(localStorage.getItem("users"));
    let current_user_index;
    const result = users.filter((value, index) => {
      if (value.email == etnered_email && value.password == entered_password) {
        current_user_index = index;
        return value;
      }
    });
    // check-if-user-exist
    if (result.length > 0) {
      e.target.disabled = true;
      toastList[0].show();
      // save-current-user-index
      localStorage.setItem(
        "current_user_index",
        JSON.stringify(current_user_index)
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
