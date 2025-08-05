// DOM Elements
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const loginFormElement = document.getElementById('loginFormElement');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');

// Demo credentials
const validCredentials = {
    'admin@example.com': 'password123',
    'user@demo.com': 'demo123',
    'test@test.com': 'test123'
};

// Login form submission
loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    setTimeout(() => {
        if (validateCredentials(email, password)) {
            const user = getUserFromEmail(email);
            showDashboard(user);
        } else {
            showError('Invalid email or password. Try: admin@example.com / password123');
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }, 1500);
});

// Logout
logoutBtn.addEventListener('click', function() {
    showLogin();
});

// Validate credentials
function validateCredentials(email, password) {
    return validCredentials[email] && validCredentials[email] === password;
}

// Get user info
function getUserFromEmail(email) {
    const users = {
        'admin@example.com': { name: 'Admin User', initials: 'AU' },
        'user@demo.com': { name: 'Demo User', initials: 'DU' },
        'test@test.com': { name: 'Test User', initials: 'TU' }
    };
    return users[email] || { name: 'User', initials: 'U' };
}

// Show dashboard
function showDashboard(user) {
    loginForm.classList.add('slide-out');
    
    setTimeout(() => {
        loginForm.style.display = 'none';
        dashboard.style.display = 'block';
        dashboard.classList.add('fade-in');
        
        userName.textContent = user.name;
        userAvatar.textContent = user.initials;
        
        loginFormElement.reset();
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }, 300);
}

// Show login
function showLogin() {
    dashboard.style.display = 'none';
    loginForm.style.display = 'block';
    loginForm.classList.remove('slide-out');
    loginForm.classList.add('fade-in');
}

// Show error message
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fee;
        color: #c33;
        padding: 12px;
        border-radius: 8px;
        margin-top: 15px;
        border: 1px solid #fcc;
        text-align: center;
        font-size: 0.9em;
    `;
    errorDiv.textContent = message;
    
    loginFormElement.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Animate dashboard numbers
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(finalValue.replace(/[,$%]/g, ''));
        
        if (isNumber) {
            const increment = Math.ceil(parseInt(finalValue.replace(/[,$%]/g, '')) / 50);
            let current = 0;
            const target = parseInt(finalValue.replace(/[,$%]/g, ''));
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (finalValue.includes('$')) {
                    stat.textContent = '$' + current.toLocaleString();
                } else if (finalValue.includes('%')) {
                    stat.textContent = (current / 10).toFixed(1) + '%';
                } else {
                    stat.textContent = current.toLocaleString();
                }
            }, 50);
        }
    });
}

// Real-time clock (future use)
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    emailInput.focus();
    
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    setTimeout(() => {
        animateNumbers();
    }, 2000);
});

setInterval(updateTime, 1000);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (loginForm.style.display !== 'none') {
            emailInput.focus();
        }
    }
    
    if (e.key === 'Escape' && dashboard.style.display !== 'none') {
        logoutBtn.click();
    }
});
