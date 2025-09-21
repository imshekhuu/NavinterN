// ===== Authentication Guard =====
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in using the new auth system
  if (!window.authManager.isLoggedIn()) {
    // Store current page for redirect after login
    localStorage.setItem('redirectAfterLogin', 'profile.html');
    window.location.href = "login.html";
    return;
  }
  
  // Initialize profile page
  initializeProfilePage();
});

function initializeProfilePage() {
  const user = window.authManager.getCurrentUser();
  if (!user) return;

  // Initialize floating particles
  initParticles();

  // ===== Navbar Profile & Logout =====
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        window.authManager.logout();
        window.location.href = "login.html";
      }
    });
  }

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
  if (profileName) profileName.textContent = user.name;
  if (profileEmail) profileEmail.textContent = user.email;

  // Load profile data from user object
  if (user.profile) {
    if (user.profile.bio && userBio) userBio.value = user.profile.bio;
    if (user.profile.skills && userSkills) userSkills.value = user.profile.skills;
    if (user.profile.progress && userProgress) userProgress.value = user.profile.progress;
  }

  // Update display
  if (displayBio) displayBio.textContent = userBio ? userBio.value : '';
  if (displaySkills) displaySkills.textContent = userSkills ? userSkills.value : '';
  if (displayProgress) displayProgress.textContent = userProgress ? userProgress.value : '';

  // ===== Save Profile Data =====
  const saveProfileBtn = document.getElementById("saveProfile");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      // Update user profile data
      if (!user.profile) {
        user.profile = {};
      }
      
      user.profile.bio = userBio ? userBio.value : '';
      user.profile.skills = userSkills ? userSkills.value : '';
      user.profile.progress = userProgress ? userProgress.value : '';

      // Update session data
      const session = window.authManager.getSession();
      if (session) {
        session.user = user;
        localStorage.setItem('navintern_session', JSON.stringify(session));
      }

      // Update preview
      if (displayBio) displayBio.textContent = user.profile.bio;
      if (displaySkills) displaySkills.textContent = user.profile.skills;
      if (displayProgress) displayProgress.textContent = user.profile.progress;

      // Show success message
      showSuccessMessage("Profile saved successfully!");
    });
  }
}

function showSuccessMessage(message) {
  // Create a temporary success message
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(successDiv);
  
  // Remove after 3 seconds
  setTimeout(() => {
    successDiv.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 300);
  }, 3000);
}

// ===== Floating Particles Animation =====
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

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

  function initParticleArray() {
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

  initParticleArray();
  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticleArray();
  });
}
