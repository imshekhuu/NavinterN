// login.js
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const userName = document.getElementById("userName").value.trim();
  const userEmail = document.getElementById("userEmail").value.trim();
  const userPass  = document.getElementById("userPass").value.trim();

  if(userName && userEmail && userPass) {
    // Save user details in localStorage
    const user = {
      name: userName,
      email: userEmail,
      password: userPass
    };
    localStorage.setItem("internMatcherUser", JSON.stringify(user));

    // Redirect to main index.html
    window.location.href = "index.html";
  } else {
    alert("Please fill all the fields!");
  }
});
