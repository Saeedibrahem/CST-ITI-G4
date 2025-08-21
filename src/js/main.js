// fetch users one tiem
if (!localStorage.getItem("users")) {
  fetch("../../data/users.json")
    .then((res) => res.json())
    .then((users) => {
      const encryptedUsers = CryptoJS.AES.encrypt(
        JSON.stringify(users),
        "secret_key"
      ).toString();
      localStorage.setItem("users", encryptedUsers);
    })
    .catch((err) => console.error("Error loading users:", err));
}

// encrypt func     abdo=>***
// if argument is string enter it, else enter JSON.stringify(data)
function encrypt_string_to_string(data) {
  const encryptedData = CryptoJS.AES.encrypt(data, "secret_key").toString();
  return encryptedData;
}
// decrypt func     ***=>abdo
function decrypt_string_to_string(data) {
  const bytes = CryptoJS.AES.decrypt(data, "secret_key");
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}
