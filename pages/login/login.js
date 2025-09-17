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
  const entered_email = document.getElementById("email").value;
  const entered_password = document.getElementById("password").value;
  
  // check-form-validity
  if (my_form.checkValidity()) {
    // Disable button to prevent multiple submissions
    e.target.disabled = true;
    e.target.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Logging in...';
    
    //* get users form localstorage
    const users = JSON.parse(
      decrypt_string_to_string(localStorage.getItem("users"))
    );
    const resultArr = users.filter((value) => {
      if (value.email == entered_email && value.password == entered_password) {
        return value;
      }
    });
    
    // check-if-user-exist
    if (resultArr.length > 0) {
      // Show success notification
      window.showNotification("Login Successful! Welcome to MobileXpress", "success");
      
      //* update currentUser in localstorage
      localStorage.setItem(
        "currentUser",
        encrypt_string_to_string(JSON.stringify(resultArr[0]))
      );
      
      // Redirect after showing notification
      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 2000);
      
    } else {
      // Check for admin login
      if (entered_email == "admin@gmail.com" && entered_password == "123") {
        window.showNotification("Admin Login Successful!", "success");
        localStorage.setItem(
          "currentUser",
          encrypt_string_to_string(JSON.stringify({role: 'admin'}))
        );
        setTimeout(() => {
          window.location.href = "../../admin.html";
        }, 2000);
      } else {
        // Show error notification
        window.showNotification("Login Failed! Please check your email and password", "danger");
        
        // Re-enable button after delay
        setTimeout(() => {
          e.target.disabled = false;
          e.target.innerHTML = 'Login';
        }, 3000);
      }
    }
  } else {
    // Show validation error
    window.showNotification("Please fill all required fields", "warning");
    my_form.classList.add("was-validated");
  }
}



