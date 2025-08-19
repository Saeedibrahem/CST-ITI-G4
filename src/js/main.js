async function loadUsers() {
  try {
    const response = await fetch("../../data/users.json");
    if (!response.ok) {
      throw new Error("Failed to load users.json");
    }
    const data = await response.json();
    // Save users into localStorage
    console.log(data);
    localStorage.setItem("users", JSON.stringify(data));
  } catch (err) {
    console.log("Error loading users:", err);
  }
}
// call-loadUsers-func
loadUsers();
