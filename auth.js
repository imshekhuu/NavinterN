
class AuthManager {
  constructor() {
    this.SESSION_KEY = 'navintern_session';
    this.USER_KEY = 'navintern_user';
    this.SESSION_TIMEOUT = 24 * 60 * 60 * 1000; 
    this.REMEMBER_ME_TIMEOUT = 30 * 24 * 60 * 60 * 1000; 
  }

  createSession(userData, rememberMe = false) {
    const sessionData = {
      user: userData,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      rememberMe: rememberMe,
      sessionId: this.generateSessionId()
    };

    const timeout = rememberMe ? this.REMEMBER_ME_TIMEOUT : this.SESSION_TIMEOUT;
    sessionData.expiryTime = Date.now() + timeout;

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    
    this.updateLastActivity();
    return sessionData;
  }

  getSession() {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData);
      

      if (Date.now() > session.expiryTime) {
        this.logout();
        return null;
      }

      this.updateLastActivity();
      return session;
    } catch (error) {
      console.error('Error parsing session data:', error);
      this.logout();
      return null;
    }
  }

  updateLastActivity() {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        session.lastActivity = Date.now();
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      } catch (error) {
        console.error('Error updating last activity:', error);
      }
    }
  }

  generateSessionId() {
    return 'navintern_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  isLoggedIn() {
    const session = this.getSession();
    return session !== null;
  }

  // ===== Authentication Actions =====
  login(userData, rememberMe = false) {
    // Validate user data
    if (!this.validateUserData(userData)) {
      throw new Error('Invalid user data provided');
    }

    // Create session
    const session = this.createSession(userData, rememberMe);
    
    // Dispatch login event
    this.dispatchAuthEvent('login', session.user);
    
    return session;
  }

  logout() {
    const user = this.getCurrentUser();
    
    // Clear session data
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Dispatch logout event
    this.dispatchAuthEvent('logout', user);
    
    return true;
  }

  // ===== Validation =====
  validateUserData(userData) {
    return userData && 
           userData.name && 
           userData.email && 
           userData.password &&
           typeof userData.name === 'string' &&
           typeof userData.email === 'string' &&
           typeof userData.password === 'string' &&
           userData.name.trim().length > 0 &&
           userData.email.trim().length > 0 &&
           userData.password.trim().length > 0;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    // Minimum 6 characters
    return password && password.length >= 6;
  }

  validateName(name) {
    // Minimum 2 characters, only letters and spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name.trim());
  }

  // ===== Form Validation =====
  validateForm(formData) {
    const errors = {};

    // Validate name
    if (!formData.name || !this.validateName(formData.name)) {
      errors.name = 'Please enter a valid name (minimum 2 characters, letters only)';
    }

    // Validate email
    if (!formData.email || !this.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password || !this.validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  // ===== Event System =====
  dispatchAuthEvent(eventType, userData = null) {
    const event = new CustomEvent('authChange', {
      detail: {
        type: eventType,
        user: userData,
        isLoggedIn: eventType === 'login'
      }
    });
    document.dispatchEvent(event);
  }

  // ===== Session Monitoring =====
  startSessionMonitoring() {
    // Check session validity every 5 minutes
    setInterval(() => {
      const session = this.getSession();
      if (!session) {
        // Session expired, redirect to login if on protected page
        if (this.isOnProtectedPage()) {
          this.redirectToLogin();
        }
      }
    }, 5 * 60 * 1000);

    // Update last activity on user interaction
    const events = ['click', 'keypress', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateLastActivity();
      }, { passive: true });
    });
  }

  isOnProtectedPage() {
    const currentPage = window.location.pathname;
    const protectedPages = ['/profile.html', '/intern.html'];
    return protectedPages.some(page => currentPage.includes(page));
  }

  redirectToLogin() {
    // Store current page for redirect after login
    localStorage.setItem('redirectAfterLogin', window.location.href);
    window.location.href = 'login.html';
  }

  // ===== Utility Methods =====
  getSessionInfo() {
    const session = this.getSession();
    if (!session) return null;

    return {
      user: session.user,
      loginTime: new Date(session.loginTime).toLocaleString(),
      lastActivity: new Date(session.lastActivity).toLocaleString(),
      expiryTime: new Date(session.expiryTime).toLocaleString(),
      rememberMe: session.rememberMe,
      sessionId: session.sessionId
    };
  }

  extendSession() {
    const session = this.getSession();
    if (session) {
      session.expiryTime = Date.now() + (session.rememberMe ? this.REMEMBER_ME_TIMEOUT : this.SESSION_TIMEOUT);
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  // ===== Security Features =====
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }

  hashPassword(password) {
    // Simple hash for demo purposes - in production, use proper hashing
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
}

// ===== Global Auth Manager Instance =====
window.authManager = new AuthManager();

// ===== Auto-initialize session monitoring =====
document.addEventListener('DOMContentLoaded', () => {
  window.authManager.startSessionMonitoring();
});

// ===== Export for module systems =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
}
