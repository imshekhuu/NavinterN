// ===== Check Login =====
const user = JSON.parse(localStorage.getItem("internMatcherUser"));

if (!user || localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html"; // Redirect if not logged in
}

// ===== Navbar Profile & Logout =====
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("internMatcherUser");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
});

// ===== Fill Profile Info =====
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const userBio = document.getElementById("userBio");
const userSkills = document.getElementById("userSkills");
const userProgress = document.getElementById("userProgress");

const displayBio = document.getElementById("displayBio");
const displaySkills = document.getElementById("displaySkills");
const displayProgress = document.getElementById("displayProgress");

// Load saved data
profileName.textContent = user.name;
profileEmail.textContent = user.email;

if (user.bio) userBio.value = user.bio;
if (user.skills) userSkills.value = user.skills;
if (user.progress) userProgress.value = user.progress;

displayBio.textContent = userBio.value;
displaySkills.textContent = userSkills.value;
displayProgress.textContent = userProgress.value;

// ===== Save Profile Data =====
document.getElementById("saveProfile").addEventListener("click", () => {
  user.bio = userBio.value;
  user.skills = userSkills.value;
  user.progress = userProgress.value;

  localStorage.setItem("internMatcherUser", JSON.stringify(user));

  // Update preview
  displayBio.textContent = user.bio;
  displaySkills.textContent = user.skills;
  displayProgress.textContent = user.progress;

  alert("Profile saved successfully!");
});
