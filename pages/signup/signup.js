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
  const entered_firstName = document.getElementById("firstName").value;
  const entered_lastName = document.getElementById("lastName").value;
  const entered_email = document.getElementById("email").value;
  const entered_password = document.getElementById("password").value;
  const entered_confirmPassword = document.getElementById("confirmPassword").value;
  const entered_role = document.getElementById("role").value;

  // check-form-validity
  if (my_form.checkValidity()) {
    // Disable button to prevent multiple submissions
    e.target.disabled = true;
    e.target.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Creating account...';
    
    //* get users form localstorage
    const users = JSON.parse(
      decrypt_string_to_string(localStorage.getItem("users"))
    );

    // Check if email already exists
    const existingUser = users.find((user) => user.email === entered_email);
    
    if (existingUser) {
      // Email already exists
      window.showNotification("Email already exists! Please use a different email or sign in", "danger");
      setTimeout(() => {
        e.target.disabled = false;
        e.target.innerHTML = 'Create Account';
      }, 3000);
    } else {
      // Check password confirmation
      if (entered_password === entered_confirmPassword) {
        //* create user
        let user = {
          id: users.length,
          firstName: entered_firstName,
          lastName: entered_lastName,
          email: entered_email,
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
        
        // Show success notification
        window.showNotification("Welcome to MobileXpress! Your account has been created successfully", "success");
        
        // Redirect after showing notification
        setTimeout(() => {
          window.location.href = "../../index.html";
        }, 2000);
        
      } else {
        // Passwords don't match
        window.showNotification("Passwords don't match! Please make sure passwords match", "warning");
        setTimeout(() => {
          e.target.disabled = false;
          e.target.innerHTML = 'Create Account';
        }, 3000);
      }
    }
  } else {
    // Show validation error
    window.showNotification("Please fill all required fields and agree to terms and conditions", "info");
    my_form.classList.add("was-validated");
  }
}

