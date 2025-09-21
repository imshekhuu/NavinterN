// ===== Navbar Scroll Effect =====
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.style.background = window.scrollY > 50 ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)";
});

// ===== Smooth Scroll =====
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    if (link.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      document.querySelector(link.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== Glow Buttons =====
document.querySelectorAll(".btn, .login-btn").forEach(btn => {
  btn.addEventListener("mouseenter", () => (btn.style.boxShadow = "0 0 20px gold"));
  btn.addEventListener("mouseleave", () => (btn.style.boxShadow = "none"));
});

// ===== GSAP Animations =====
function animateOnScroll(selector, props) {
  gsap.utils.toArray(selector).forEach(el => {
    gsap.set(el, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", ...props });
      }
    });
  });
}

animateOnScroll(".project-card", { stagger: 0.2 });
animateOnScroll(".engineer-card", { stagger: 0.2 });
animateOnScroll(".timeline-list li", { stagger: 0.15 });
animateOnScroll(".quote-box", { stagger: 0.2 });

gsap.from(".content h1", { y: -50, opacity: 0, duration: 1, ease: "back.out(1.7)" });
gsap.from(".content p", { y: 30, opacity: 0, duration: 1, delay: 0.5 });
gsap.from(".btn", { scale: 0, opacity: 0, duration: 0.8, delay: 1 });

// ===== Parallax Video =====
const bgVideo = document.getElementById("bg-video");
window.addEventListener("scroll", () => {
  let y = window.scrollY;
  bgVideo.style.transform = `scale(${1 + y * 0.0005})`;
});

// ===== Floating Golden Particles =====
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.speedY = (Math.random() - 0.5) * 1.2;
    this.color = "rgba(255, 215, 0, 0.8)";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let particlesArray = [];

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 70; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// ===== Dark/Light Mode Toggle =====
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  if (body.classList.contains("light")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "light");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
});
// ====== Hamburger Menu Toggle ======
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
     overlay.classList.toggle("show");
    // Toggle icon
    hamburger.textContent = navLinks.classList.contains("show") ? "✖" : "☰";
  });

  // Close menu if overlay is clicked
  overlay.addEventListener("click", () => {
    navLinks.classList.remove("show");
    overlay.classList.remove("show");
    hamburger.textContent = "☰";
  });
}

// ===== Enhanced Authentication System Integration =====
window.addEventListener("DOMContentLoaded", () => {
  initializeAuthSystem();
  setupNavigationHandlers();
});

function initializeAuthSystem() {
  // Check authentication status and update UI
  const user = window.authManager.getCurrentUser();
  const navLoginLi = document.getElementById("navLoginLi");
  const navProfileLi = document.getElementById("navProfileLi");
  const navLogoutLi = document.getElementById("navLogoutLi");

  if (user) {
    // User is logged in - show profile navigation
    updateLoggedInUI(user);
  } else {
    // User is not logged in - show login button
    updateLoggedOutUI();
  }

  // Listen for authentication changes
  document.addEventListener('authChange', (event) => {
    if (event.detail.type === 'login') {
      updateLoggedInUI(event.detail.user);
    } else if (event.detail.type === 'logout') {
      updateLoggedOutUI();
    }
  });
}

function updateLoggedInUI(user) {
  const navLoginLi = document.getElementById("navLoginLi");
  const navProfileLi = document.getElementById("navProfileLi");
  const navLogoutLi = document.getElementById("navLogoutLi");

  // Hide login button
  navLoginLi.style.display = "none";
  
  // Show profile and logout buttons
  navProfileLi.style.display = "block";
  navLogoutLi.style.display = "block";

  // Update profile button text
  const profileBtn = navProfileLi.querySelector('a');
  if (profileBtn) {
    profileBtn.textContent = `👤 ${user.name}`;
  }

  // Add logout functionality
  const logoutBtn = document.getElementById("navLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function updateLoggedOutUI() {
  const navLoginLi = document.getElementById("navLoginLi");
  const navProfileLi = document.getElementById("navProfileLi");
  const navLogoutLi = document.getElementById("navLogoutLi");

  // Show login button
  navLoginLi.style.display = "block";
  
  // Hide profile and logout buttons
  navProfileLi.style.display = "none";
  navLogoutLi.style.display = "none";

  // Add login functionality
  const loginBtn = document.getElementById("navLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    window.authManager.logout();
    window.location.reload();
  }
}

function setupNavigationHandlers() {
  // Handle profile navigation
  const profileLink = document.querySelector('a[href="./profile.html"]');
  if (profileLink) {
    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.authManager.isLoggedIn()) {
        window.location.href = 'profile.html';
      } else {
        // Store intended destination and redirect to login
        localStorage.setItem('redirectAfterLogin', 'profile.html');
        window.location.href = 'login.html';
      }
    });
  }

  // Handle internship navigation
  const internLink = document.querySelector('a[href="intern.html"]');
  if (internLink) {
    internLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.authManager.isLoggedIn()) {
        window.location.href = 'intern.html';
      } else {
        // Store intended destination and redirect to login
        localStorage.setItem('redirectAfterLogin', 'intern.html');
        window.location.href = 'login.html';
      }
    });
  }
}
function showProfileNav(userName) {
    // Replace login button with Profile and Logout buttons
    navLoginLi.innerHTML = `
        <button class="login-btn" id="profileBtn">Hi, ${userName}</button>
        <button class="login-btn" id="logoutBtn">Logout</button>
    `;

    // Profile button redirects to profile.html
    document.getElementById('profileBtn').addEventListener('click', () => {
        window.location.href = "profile.html";
    });

    // Logout clears login and reloads page
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userName');
        navLoginLi.innerHTML = `<button class="login-btn" id="navLoginBtn">Login</button>`;
        location.reload();
    });
}

// Check if user is already logged in
const storedUser = localStorage.getItem('userName');
if (storedUser) {
    showProfileNav(storedUser);
}

// Login button click redirect to login page
document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'navLoginBtn') {
        window.location.href = "login.html";
    }
});
const navLoginLi = document.getElementById("navLoginLi");
const navProfileLi = document.getElementById("navProfileLi");
const navLogoutLi = document.getElementById("navLogoutLi");
const navLoginBtn = document.getElementById("navLoginBtn");
const navLogoutBtn = document.getElementById("navLogoutBtn");

// Check if user is logged in
function updateNavbar() {
  const username = localStorage.getItem("username");
  if (username) {
    navLoginLi.style.display = "none";
    navProfileLi.style.display = "block";
    navLogoutLi.style.display = "block";
  } else {
    navLoginLi.style.display = "block";
    navProfileLi.style.display = "none";
    navLogoutLi.style.display = "none";
  }
}

// On page load
updateNavbar();

// Login button redirects to login page
navLoginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

// Logout button
navLogoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  updateNavbar();
});


