
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const messageBox = document.getElementById('messageBox');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = document.querySelector('.btn-text');
  const btnLoader = document.querySelector('.btn-loader');

  // ===== Form Elements =====
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const passwordInput = document.getElementById('userPass');
  const rememberMeCheckbox = document.getElementById('rememberMe');

  nameInput.addEventListener('blur', () => validateField('name', nameInput.value));
  emailInput.addEventListener('blur', () => validateField('email', emailInput.value));
  passwordInput.addEventListener('blur', () => validateField('password', passwordInput.value));


  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    setLoadingState(true);
    clearMessages();

    try {
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
      };


      const validation = window.authManager.validateForm(formData);
      if (!validation.isValid) {
        displayErrors(validation.errors);
        setLoadingState(false);
        return;
      }

      clearErrors();


      await simulateLogin(formData);


      const userData = {
        ...formData,
        id: generateUserId(),
        loginTime: new Date().toISOString(),
        profile: {
          bio: '',
          skills: '',
          progress: 0,
          preferences: {}
        }
      };

      // Create session
      const rememberMe = rememberMeCheckbox.checked;
      window.authManager.login(userData, rememberMe);

      // Show success message
      showMessage('Login successful! Redirecting...', 'success');

      // Redirect after short delay
      setTimeout(() => {
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      }, 1500);

    } catch (error) {
      showMessage(error.message || 'Login failed. Please try again.', 'error');
      setLoadingState(false);
    }
  });

  // ===== Validation Functions =====
  function validateField(fieldName, value) {
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        isValid = window.authManager.validateName(value);
        errorMessage = isValid ? '' : 'Please enter a valid name (minimum 2 characters, letters only)';
        break;
      case 'email':
        isValid = window.authManager.validateEmail(value);
        errorMessage = isValid ? '' : 'Please enter a valid email address';
        break;
      case 'password':
        isValid = window.authManager.validatePassword(value);
        errorMessage = isValid ? '' : 'Password must be at least 6 characters long';
        break;
    }

    updateFieldValidation(fieldName, isValid, errorMessage);
    return isValid;
  }

  function updateFieldValidation(fieldName, isValid, errorMessage) {
    const input = document.getElementById(`user${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    const errorElement = document.getElementById(`${fieldName}Error`);

    if (input && errorElement) {
      input.classList.remove('valid', 'invalid');
      input.classList.add(isValid ? 'valid' : 'invalid');
      errorElement.textContent = errorMessage;
    }
  }

  function displayErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
      updateFieldValidation(fieldName, false, errors[fieldName]);
    });
  }

  function clearErrors() {
    ['name', 'email', 'password'].forEach(fieldName => {
      const input = document.getElementById(`user${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
      const errorElement = document.getElementById(`${fieldName}Error`);

      if (input) input.classList.remove('valid', 'invalid');
      if (errorElement) errorElement.textContent = '';
    });
  }

  // ===== Message Display =====
  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageBox.style.display = 'none';
    }, 5000);
  }

  function clearMessages() {
    messageBox.style.display = 'none';
    messageBox.className = 'message-box';
  }

  // ===== Loading State =====
  function setLoadingState(loading) {
    loginBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'block';
    btnLoader.style.display = loading ? 'block' : 'none';
  }

  // ===== Simulate Login Process =====
  function simulateLogin(formData) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // In a real application, this would be an API call
        // For demo purposes, we'll always succeed
        resolve(formData);
      }, 1000);
    });
  }

  // ===== Utility Functions =====
  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ===== Check if already logged in =====
  if (window.authManager.isLoggedIn()) {
    const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectUrl;
  }

  // ===== Additional Event Listeners =====

  // Register link functionality (placeholder)
  document.getElementById('registerLink').addEventListener('click', function (e) {
    e.preventDefault();
    showMessage('Registration feature coming soon!', 'error');
  });

  // Forgot password functionality (placeholder)
  document.getElementById('forgotPassword').addEventListener('click', function (e) {
    e.preventDefault();
    showMessage('Password reset feature coming soon!', 'error');
  });

  // Enter key to submit form
  [nameInput, emailInput, passwordInput].forEach(input => {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
      }
    });
  });
});
