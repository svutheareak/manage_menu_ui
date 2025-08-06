// Application State
let currentTheme = 'default';
let sidebarCollapsed = false;
let currentPage = 'dashboard';

const backdrop = document.getElementById('backdrop');

// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const pageTitle = document.getElementById('pageTitle');
const navLinks = document.querySelectorAll('.nav-link');
const pageSection = document.querySelectorAll('.page-section');
const themeOptions = document.querySelectorAll('.theme-option');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    loadSavedTheme();
    updateActiveNavigation();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Mobile menu open/close
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('show');
    });

    // Hide when clicking backdrop
    backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('show');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
            // close menu after navigation on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                backdrop.classList.remove('show');
            }
        });
    });

    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            changeTheme(theme);
        });
    });

    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target) &&
            !backdrop.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            backdrop.classList.remove('show');
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
            backdrop.classList.remove('show');
            mainContent.classList.remove('expanded');
        }
    });
}


// Navigation
function navigateToPage(page) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });

    pageSection.forEach(section => {
        section.classList.remove('active');
        if (section.id === page) {
            section.classList.add('active');
        }
    });

    const pageTitles = {
        'dashboard': 'Dashboard',
        'menus': 'Menu Items',
        'categories': 'Categories',
        'orders': 'Orders',
        'customers': 'Customers',
        'analytics': 'Analytics',
        'profile': 'Profile',
        'settings': 'Settings',
        'qr-decode' : 'QrDecode'
    };
    pageTitle.textContent = pageTitles[page] || 'Dashboard';
    currentPage = page;

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
    }
}

function updateActiveNavigation() {
    navigateToPage(currentPage);
}

// Sidebar
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarToggle.innerHTML = '<span>›</span>';
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        sidebarToggle.innerHTML = '<span>‹</span>';
    }
}

function toggleMobileSidebar() {
    sidebar.classList.toggle('mobile-open');
}

// Theme
function changeTheme(theme) {
    document.body.classList.remove('theme-purple', 'theme-green', 'theme-orange', 'theme-dark');

    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }

    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        }
    });

    currentTheme = theme;
    localStorage.setItem('menuSystemTheme', theme);
    showNotification('Theme changed successfully!', 'success');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('menuSystemTheme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
}

// Notifications
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Utilities
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

// Demo Functions
function addMenuItem() {
    showNotification('Add menu item functionality would be implemented here', 'info');
}

function editMenuItem(id) {
    showNotification(`Edit menu item ${id} functionality would be implemented here`, 'info');
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        showNotification(`Menu item ${id} deleted successfully`, 'success');
    }
}

// Global Click Handlers for Demo
document.addEventListener('click', function (e) {
    if (e.target.textContent.includes('Add New Item') || e.target.textContent.includes('Add Category')) {
        e.preventDefault();
        showNotification('Add functionality would open a modal or form here', 'info');
    }
    if (e.target.textContent === 'Edit') {
        e.preventDefault();
        showNotification('Edit functionality would open an edit form', 'info');
    }
    if (e.target.textContent === 'Delete') {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this item?')) {
            showNotification('Item deleted successfully', 'success');
        }
    }
    if (e.target.textContent.includes('Save')) {
        e.preventDefault();
        showNotification('Settings saved successfully!', 'success');
    }
});

// Auto-update dashboard stats
function updateDashboardStats() {
    const statsElements = document.querySelectorAll('.card-value');
    statsElements.forEach(stat => {
        if (stat.textContent.includes('$')) {
            const currentValue = parseInt(stat.textContent.replace(/[$,]/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 100);
            stat.textContent = formatCurrency(newValue);
        }
    });
}

setInterval(() => {
    if (currentPage === 'dashboard') {
        updateDashboardStats();
    }
}, 30000);

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const pages = ['dashboard', 'menus', 'categories', 'orders', 'customers', 'analytics', 'profile', 'settings', 'qr-decode'];
        const pageIndex = parseInt(e.key) - 1;
        if (pages[pageIndex]) {
            navigateToPage(pages[pageIndex]);
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showNotification('Settings saved successfully!', 'success');
    }
});

//QR Code
function parseEMV(qrString) {
    let result = {};
    let i = 0;

    while (i < qrString.length) {
        let id = qrString.substr(i, 2);
        let len = parseInt(qrString.substr(i + 2, 2), 10);
        let data = qrString.substr(i + 4, len);

        // Nested parsing for Merchant Account Information (ID 30)
        if (id === "30" || id === "26" || id === "51") {
            data = parseEMV(data); // Recursive parse
        }

        result[id] = {
            id,
            name: emvTagNames[id] || "Unknown",
            len,
            data
        };

        i += 4 + len;
    }
    return result;
}

// Known EMV Tag names (add more if needed)
const emvTagNames = {
    "00": "Payload Format Indicator",
    "01": "Point of Initiation Method",
    "26": "Merchant Account Information",
    "30": "Merchant Account Information",
    "52": "Merchant Category Code",
    "53": "Transaction Currency",
    "58": "Country Code",
    "59": "Merchant Name",
    "60": "Merchant City",
    "63": "CRC",
    "99": "Unreserved Templates"
};

document.getElementById('decodeQrBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('qrFileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a QR code image first.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            // Show preview image
            const previewImg = document.getElementById('qrPreviewImage');
            previewImg.src = event.target.result;
            previewImg.style.display = "block";

            // Decode QR
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                document.getElementById('qrDecodedOutput').textContent = code.data;

                try {
                    const parsed = parseEMV(code.data);
                    document.getElementById('qrEmvOutput').textContent =
                        JSON.stringify(parsed, null, 2);
                } catch (err) {
                    document.getElementById('qrEmvOutput').textContent = "Parsing failed: " + err;
                }
            } else {
                document.getElementById('qrDecodedOutput').textContent = "No QR code found";
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
});
