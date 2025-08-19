// fetch users
fetch("../../data/users.json")
  .then((res) => res.json())
  .then((users) => {
    localStorage.setItem("users", JSON.stringify(users));
  })
  .catch((err) => console.error("Error loading users:", err));

