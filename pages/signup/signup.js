// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
      window.sharedUtils.renderNavbar();
  }
});// if user loggedin redirect to home page
if (localStorage.getItem("currentUser")) {
  window.location.href = "../../index.html";
}
// confirmForm-func
function confirmForm(e) {
  e.preventDefault();
  // collect-form-data
  const my_form = document.getElementsByTagName("form")[0];
  const etnered_firstName = document.getElementById("firstName").value;
  const entered_lastName = document.getElementById("lastName").value;
  const etnered_email = document.getElementById("email").value;
  const entered_password = document.getElementById("password").value;
  const entered_confirmPassword =
    document.getElementById("confirmPassword").value;
  const entered_role = document.getElementById("role").value;
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

    const result = users.filter((value) => {
      if (value.email == etnered_email && value.password == entered_password) {
        return value;
      }
    });
    // check existance
    if (result.length == 0) {
      // check confirmPassword
      if (entered_password == entered_confirmPassword) {
        //* create user
        let user = {
          id: users.length,
          firstName: etnered_firstName,
          lastName: entered_lastName,
          email: etnered_email,
          password: entered_password,
          role: entered_role,
        };
        //* update users in localstorage
        users.push(user);
        const encryptedUsers = encrypt_string_to_string(JSON.stringify(users));
        localStorage.setItem("users", encryptedUsers);

        //* update currentUser in localstorage
        localStorage.setItem(
          "currentUser",
          encrypt_string_to_string(JSON.stringify(user))
        );
        // redirect-to-home-page
        window.location.href = "../../index.html";
      } else {
        e.target.disabled = true;
        setTimeout(() => {
          e.target.disabled = false;
        }, 2000);
        toastList[2].show();
      }
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
