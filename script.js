/* ==========================================================================
   VoltGlide Application Logic & State Management
   ========================================================================== */

// --- Global Application State ---
let state = {
    theme: 'dark', // 'dark' | 'light'
    direction: 'ltr', // 'ltr' | 'rtl'
    currentUser: null, // null | { role, username, email, avatar, id }
    cart: [],
    appointments: [],
    queries: [],
    parts: []
};

// --- Seed Data Templates ---
const DEFAULT_USER = {
    role: 'user',
    username: 'Marcus Vance',
    email: 'rider@voltglide.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    id: 'VG-90210'
};

const DEFAULT_ADMIN = {
    role: 'admin',
    username: 'Sergei Volkov',
    email: 'sergei@voltglide.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
    id: 'VG-ADMIN01'
};

const INITIAL_APPOINTMENTS = [
    {
        id: 'VG-5820',
        userEmail: 'rider@voltglide.com',
        userName: 'Marcus Vance',
        scooter: 'Xiaomi Pro 2',
        service: 'Tire / Solid Conversion',
        date: '2026-06-16',
        time: '02:00 PM',
        tech: 'Rachel Miller',
        status: 3, // 1: Received, 2: Diagnosing, 3: In Repair, 4: Quality Check, 5: Ready
        notes: 'Solid tire conversion on both wheels. Squeaky rear brake check.',
        desc: 'Our technician is currently mounting the puncture-proof solid tires using the hydraulic press. Expected completion: Today at 4:30 PM.'
    }
];

const INITIAL_QUERIES = [
    {
        id: 'DIAG-101',
        userEmail: 'rider@voltglide.com',
        userName: 'Marcus Vance',
        scooter: 'Xiaomi Pro 2',
        query: 'My dashboard is flashing red Error Code 14 when I press throttle. Will not accelerate.',
        replies: [
            'Sergei Volkov (Lead Tech): Error 14 indicates throttle sensor hall fault, usually a disconnected pin inside the handlebar. We can replace the throttle lever unit in 30 minutes. Estimated cost: $45.'
        ]
    }
];

const INITIAL_PARTS = [
    { id: 'P1', name: 'Solid Honeycomb Puncture-Proof 8.5" Tire', category: 'tires', price: 25.00, stock: 15, img: './e8.webp', desc: 'Heavy duty honeycomb shock absorption tire.' },
    { id: 'P2', name: 'High Capacity 36V 10.4Ah Battery Pack', category: 'battery', price: 145.00, stock: 4, img: './e12.jpg', desc: 'OEM battery pack with smart BMS protection board.' },
    { id: 'P3', name: 'Smart Dashboard Controller Assembly', category: 'electronics', price: 45.00, stock: 8, img: './e10.jpg', desc: 'Pre-calibrated control board for Xiaomi Pro 2/Max.' },
    { id: 'P4', name: 'Semi-Metallic Brake Caliper & Pads Set', category: 'brakes', price: 19.00, stock: 22, img: './e9.webp', desc: 'Dual-piston calipers offering maximum stopping control.' },
    { id: 'P5', name: '350W Brushless Front Hub Motor Assembly', category: 'motor', price: 95.00, stock: 2, img: './e11.jpg', desc: 'Silent brushless front wheel motor with hall wiring.' },
    { id: 'P6', name: 'Toughened Thick Inner Tube (8.5" x 2")', category: 'tires', price: 12.00, stock: 50, img: './e2.webp', desc: 'Thick butyl rubber tube with high puncture protection.' }
];

const DIAGNOSTIC_DATABASE = {
    battery: [
        {
            title: "Rapid Capacity Drain & Sudden Power Shutdowns",
            cause: "Corroded solder joints on nickel strips or cell imbalance within the lithium battery pack, causing BMS protection shutdown.",
            diy: "Check individual cell group voltages with a multimeter. Re-solder loose balance wires only if you are trained in lithium safety.",
            cost: "$120.00 - $180.00",
            duration: "2-3 Hours",
            severity: "hard",
            img: "./e5.jpg"
        },
        {
            title: "Scooter Charges to 100% Instantly But Dies Under Load",
            cause: "High internal cell resistance or a completely dead parallel group, triggering BMS cutoff during motor throttle current draw.",
            diy: "Visual check on cell terminals for corrosion. Battery group spot welding replacement is required.",
            cost: "$150.00",
            duration: "3 Hours",
            severity: "hard",
            img: "./e12.jpg"
        }
    ],
    motor: [
        {
            title: "Loud Grinding Noise & Resistance When Rolling",
            cause: "Damaged hub motor bearings due to water ingress or physical debris accumulation.",
            diy: "Clean axle shaft. Spin wheel manually; if scraping persists, internal hub bearings must be pressed out and replaced.",
            cost: "$75.00",
            duration: "1.5 Hours",
            severity: "medium",
            img: "./e11.jpg"
        },
        {
            title: "Motor Jerks, Vibrates, or Shudders on Acceleration",
            cause: "Blown hall sensor chip inside the hub stator housing, causing controller timing misalignment.",
            diy: "Verify hall wiring connection harness. Replacing hall chips requires soldering on the internal hub board.",
            cost: "$95.00",
            duration: "2 Hours",
            severity: "medium",
            img: "./e5.jpg"
        }
    ],
    brakes: [
        {
            title: "Spongy Brake Lever & Extended Stopping Distance",
            cause: "Air bubbles trapped in hydraulic fluid lines or worn brake caliper piston seals.",
            diy: "Perform hydraulic brake bleed using standard mineral oil bleed kit. Tighten caliper adjustment bolts.",
            cost: "$45.00 - $55.00",
            duration: "1 Hour",
            severity: "medium",
            img: "./e6.png"
        },
        {
            title: "Scrape noise or Squealing Under Braking",
            cause: "Brake pad friction material worn down to the metal backing, scoring the rotor.",
            diy: "Inspect brake pad thickness. Unscrew caliper, remove pads, insert brand new organic pads and re-align caliper.",
            cost: "$35.00",
            duration: "30 Mins",
            severity: "easy",
            img: "./e9.webp"
        }
    ],
    electronics: [
        {
            title: "Error Code 14 Flashing on Dashboard",
            cause: "Throttle lever magnet displacement or faulty hall sensor wiring.",
            diy: "Check if throttle lever springs back cleanly. Adjust alignment; replace throttle throttle housing if faulty.",
            cost: "$45.00",
            duration: "45 Mins",
            severity: "easy",
            img: "./e10.jpg"
        },
        {
            title: "Scooter Shuts Down on Hills / Warm Motherboard",
            cause: "Thermal overload protection triggered by blown MOSFET transistors on the main controller board.",
            diy: "Allow scooter to cool down for 20 mins. Controller replacement is needed if MOSFETs are physically burnt.",
            cost: "$110.00",
            duration: "2 Hours",
            severity: "hard",
            img: "./e7.webp"
        }
    ],
    body: [
        {
            title: "Frequent Flat Punctures on Commutes",
            cause: "Pinch flats from low tire pressure or glass/wires piercing thin standard inner tubes.",
            diy: "Check tire pressure weekly (maintain 45-50 PSI). Replace standard tube with a thick solid tire upgrade for zero punctures.",
            cost: "$50.00 - $65.00",
            duration: "1 Hour",
            severity: "easy",
            img: "./e8.webp"
        },
        {
            title: "Stem Wobble or Clicking from Folding Mechanism",
            cause: "Loose folding latch hinge bolts or worn vibration dampening pads.",
            diy: "Tighten folding hinge lock bolts with Allen keys. Insert a rubber stem vibration spacer into hinge pivot.",
            cost: "$30.00",
            duration: "30 Mins",
            severity: "easy",
            img: "./e3.webp"
        }
    ]
};

const DIY_VIDEOS = [
    { title: "Standard Front Flat Tire Tube Replacement", duration: "12 mins", difficulty: "Easy", icon: "fa-solid fa-play", img: "./e4.jpg" },
    { title: "Solid Honeycomb Puncture-Proof Tire Upgrade Installation", duration: "18 mins", difficulty: "Medium", icon: "fa-solid fa-wrench", img: "./e8.webp" },
    { title: "How to Align Disc Brake Calipers and Stop Squeaking", duration: "8 mins", difficulty: "Easy", icon: "fa-solid fa-screwdriver", img: "./e6.png" },
    { title: "Xiaomi M365 Dashboard Controller Flashing Guide", duration: "15 mins", difficulty: "Medium", icon: "fa-solid fa-microchip", img: "./e10.jpg" },
    { title: "Safe Lithium-ion Battery BMS Solder Repair", duration: "25 mins", difficulty: "Hard", icon: "fa-solid fa-triangle-exclamation", img: "./e5.jpg" },
    { title: "Folding Mechanism Adjustment and Stem Tightening", duration: "6 mins", difficulty: "Easy", icon: "fa-solid fa-sliders", img: "./e3.webp" }
];

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initializeData();
    setupEventListeners();
    
    // Detect current page and run page-specific logic
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    if (page === 'user-dashboard.html') {
        if (!state.currentUser) {
            state.currentUser = { ...DEFAULT_USER };
        }
        updateUserInterfaceUI();
        renderUserDashboard();
    } else if (page === 'admin-dashboard.html') {
        if (!state.currentUser) {
            state.currentUser = { ...DEFAULT_ADMIN };
        }
        updateUserInterfaceUI();
        renderAdminDashboard();
    } else if (page === 'profile.html') {
        if (!state.currentUser) {
            state.currentUser = { ...DEFAULT_USER };
        }
        renderProfilePage();
    } else {
        // Public pages (index, home2, about, services, contact, login, register, etc.)
        loginAsDefaultUser();
        renderAllDynamicContent();
    }
});

// --- Local Storage Management ---
function initializeData() {
    if (!localStorage.getItem('vg_appointments')) {
        localStorage.setItem('vg_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem('vg_queries')) {
        localStorage.setItem('vg_queries', JSON.stringify(INITIAL_QUERIES));
    }
    if (!localStorage.getItem('vg_parts')) {
        localStorage.setItem('vg_parts', JSON.stringify(INITIAL_PARTS));
    }
    
    state.appointments = JSON.parse(localStorage.getItem('vg_appointments'));
    state.queries = JSON.parse(localStorage.getItem('vg_queries'));
    state.parts = JSON.parse(localStorage.getItem('vg_parts'));
    state.cart = JSON.parse(localStorage.getItem('vg_cart')) || [];
}

function loadSettings() {
    const savedTheme = localStorage.getItem('vg_theme') || 'dark';
    const savedDir = localStorage.getItem('vg_direction') || 'ltr';
    
    setTheme(savedTheme);
    setDirection(savedDir);
}

// --- Theme Settings ---
function setTheme(themeName) {
    state.theme = themeName;
    localStorage.setItem('vg_theme', themeName);
    
    if (themeName === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme} theme`);
}

// --- Direction Settings (LTR/RTL) ---
function setDirection(dir) {
    state.direction = dir;
    localStorage.setItem('vg_direction', dir);
    
    document.documentElement.setAttribute('dir', dir);
    
    // Update all button circle texts
    const rtlBtnCircles = document.querySelectorAll('.rtl-circle');
    rtlBtnCircles.forEach(circle => {
        circle.textContent = dir.toUpperCase();
    });
}

function toggleDirection() {
    const nextDir = state.direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(nextDir);
    showToast(`Direction updated to ${nextDir.toUpperCase()}`);
}

// --- Navigation Router ---
// Page URL map for multi-page navigation
const PAGE_MAP = {
    'home1': 'index.html',
    'home2': 'home2.html',
    'about': 'about.html',
    'services': 'services.html',
    'contact': 'contact.html',
    'user-dashboard': 'user-dashboard.html',
    'admin-dashboard': 'admin-dashboard.html',
    'login': 'login.html',
    'forgot-password': 'forgot-password.html',
    'register': 'register.html',
    'profile': 'profile.html'
};

function navigateTo(viewId) {
    const targetPage = PAGE_MAP[viewId];
    if (targetPage) {
        window.location.href = targetPage;
    } else {
        console.warn('Unknown viewId:', viewId);
    }
}

function updateNavHighlight(viewId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Detect mapping
    if (viewId === 'home1' || viewId === 'home2') {
        navItems[0].classList.add('active'); // Home item
    } else if (viewId === 'about') {
        navItems[1].classList.add('active');
    } else if (viewId === 'services') {
        navItems[2].classList.add('active');
    } else if (viewId === 'contact') {
        navItems[3].classList.add('active');
    } else if (viewId === 'user-dashboard' || viewId === 'admin-dashboard') {
        navItems[4].classList.add('active'); // Dashboard item
    }
}

// --- Authentication Simulation ---
function checkAuthentication(requiredRole) {
    if (!state.currentUser) {
        showToast("Access Denied. Please Login first.", "error");
        navigateTo('login');
        return false;
    }
    if (requiredRole && state.currentUser.role !== requiredRole) {
        showToast(`Role mismatch. Redirecting to login portal.`, "error");
        navigateTo('login');
        return false;
    }
    return true;
}

function loginAsDefaultUser() {
    state.currentUser = { ...DEFAULT_USER };
    updateUserInterfaceUI();
}

function switchLoginRole(role) {
    const btnUser = document.getElementById('btn-select-user');
    const btnAdmin = document.getElementById('btn-select-admin');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (!btnUser || !btnAdmin || !emailInput || !passwordInput) return;

    btnUser.classList.remove('active');
    btnAdmin.classList.remove('active');

    if (role === 'user') {
        btnUser.classList.add('active');
        emailInput.value = DEFAULT_USER.email;
        passwordInput.value = 'rider123';
    } else {
        btnAdmin.classList.add('active');
        emailInput.value = DEFAULT_ADMIN.email;
        passwordInput.value = 'admin123';
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();

    if (email === 'admin@voltglide.com' || email === 'sergei@voltglide.com') {
        state.currentUser = { ...DEFAULT_ADMIN, email: email };
        localStorage.setItem('vg_current_user', JSON.stringify(state.currentUser));
        showToast("Logged in as Sergei (Administrator)");
        setTimeout(() => { window.location.href = 'admin-dashboard.html'; }, 800);
    } else {
        state.currentUser = { ...DEFAULT_USER, email: email };
        localStorage.setItem('vg_current_user', JSON.stringify(state.currentUser));
        showToast("Logged in as Marcus (Customer)");
        setTimeout(() => { window.location.href = 'user-dashboard.html'; }, 800);
    }

    updateUserInterfaceUI();
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (password !== confirm) {
        showToast("Passwords do not match.", "error");
        return;
    }

    // Success registration simulation
    showToast("Registration successful! Account created.");

    // Reset register form
    document.getElementById('register-form-submit').reset();

    // Navigate to Login Page
    setTimeout(() => { window.location.href = 'login.html'; }, 800);
}

function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) {
        showToast("Please enter your email address.", "error");
        return;
    }
    showToast(`Reset instructions sent to ${email}.`);
    document.getElementById('forgot-password-form').reset();
    setTimeout(() => { window.location.href = 'login.html'; }, 800);
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const nameInput = document.getElementById('profile-name-input').value.trim();
    const emailInput = document.getElementById('profile-email-input').value.trim();
    const passwordInput = document.getElementById('profile-password-input').value;

    if (!nameInput || !emailInput) {
        showToast("Name and email are required.", "error");
        return;
    }

    state.currentUser.username = nameInput;
    state.currentUser.email = emailInput;

    if (passwordInput) {
        showToast("Password updated successfully.");
    }

    showToast("Profile saved successfully.");
    renderProfilePage();
}

function renderProfilePage() {
    if (!state.currentUser) {
        state.currentUser = { ...DEFAULT_USER };
    }
    const name = state.currentUser.username;
    const email = state.currentUser.email;
    const avatar = state.currentUser.avatar;
    const id = state.currentUser.id || 'VG-90210';

    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileId = document.getElementById('profile-id');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileNameInput = document.getElementById('profile-name-input');
    const profileEmailInput = document.getElementById('profile-email-input');

    if (profileName) profileName.textContent = name;
    if (profileEmail) profileEmail.textContent = email;
    if (profileId) profileId.textContent = `User ID: ${id}`;
    if (profileAvatar) profileAvatar.src = avatar;
    if (profileNameInput) profileNameInput.value = name;
    if (profileEmailInput) profileEmailInput.value = email;
    if (document.getElementById('profile-password-input')) {
        document.getElementById('profile-password-input').value = '';
    }
}

function logoutUser() {
    state.currentUser = null;
    localStorage.removeItem('vg_current_user');
    updateUserInterfaceUI();
    showToast("Logged out successfully");
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
}

function updateUserInterfaceUI() {
    const loginBtn = document.getElementById('login-nav-btn');
    const userMenu = document.getElementById('user-profile-menu');

    if (loginBtn) {
        loginBtn.classList.remove('hidden');
    }
    if (userMenu) {
        userMenu.classList.add('hidden');
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('open');
}

// Close profile dropdown when clicking outside
window.addEventListener('click', (e) => {
    const trigger = document.getElementById('profileTrigger');
    const dropdown = document.getElementById('profileDropdown');
    if (trigger && dropdown && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

// --- Dynamic Content Renderers ---

function renderAllDynamicContent() {
    // 1. Troubleshoot / Diagnostics Guide on Home 1
    filterDiagnostics('battery', document.querySelector('.symptom-tab'));

    // 2. Parts Catalog Preview on Home 1
    renderPartsPreview();

    // 3. DIY Videos
    renderDiyVideos();

    // 4. Eco Green Impact default calculation
    updateGreenImpact();
}

// Diagnostics Finder Filters
function filterDiagnostics(category, tabElement) {
    // Toggle tab active class
    const tabs = document.querySelectorAll('.symptom-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (tabElement) tabElement.classList.add('active');

    const container = document.getElementById('diagnostic-results-panel');
    if (!container) return;

    const data = DIAGNOSTIC_DATABASE[category] || [];
    container.innerHTML = '';

    data.forEach(item => {
        const itemHTML = `
            <div class="diagnostic-item">
                <div class="diag-media" style="background-image: url('${item.img}')"></div>
                <div class="diag-info">
                    <div>
                        <div class="diag-header">
                            <span class="severity-badge ${item.severity}">${item.severity.toUpperCase()}</span>
                        </div>
                        <h3 class="diag-title">${item.title}</h3>
                        <p class="diag-desc"><strong>Common Cause:</strong> ${item.cause}</p>
                        <p class="diag-desc"><strong>DIY Solution:</strong> ${item.diy}</p>
                    </div>
                    <div>
                        <div class="diag-meta-grid">
                            <div>
                                <span class="text-dim font-xs">Estimated Cost:</span>
                                <div class="meta-value text-green">${item.cost}</div>
                            </div>
                            <div>
                                <span class="text-dim font-xs">Estimated Repair Time:</span>
                                <div class="meta-value">${item.duration}</div>
                            </div>
                        </div>
                        <div class="diag-actions">
                            <button class="btn btn-primary" onclick="openBookingWithService('${item.title}')">Book Technician</button>
                            <button class="btn btn-secondary" onclick="scrollToElement('home1-video-grid')">Watch DIY Guide</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });
}

// Parts Catalog rendering
function renderPartsPreview() {
    const previewContainer = document.getElementById('parts-preview-container');
    if (!previewContainer) return;

    previewContainer.innerHTML = '';
    
    // Slice first 3 parts for preview
    const previewParts = state.parts.slice(0, 3);
    
    previewParts.forEach(part => {
        const cardHTML = `
            <div class="part-card">
                <div class="part-image">
                    <img src="${part.img}" alt="${part.name}">
                    <span class="part-tag">${part.category.toUpperCase()}</span>
                </div>
                <div class="part-details">
                    <div>
                        <h3 class="part-title">${part.name}</h3>
                        <p class="text-dim font-sm">${part.desc}</p>
                    </div>
                    <div>
                        <div class="part-price-row">
                            <span class="part-price">$${part.price.toFixed(2)}</span>
                            <button class="btn btn-sm btn-primary" onclick="addToCart('${part.id}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        previewContainer.innerHTML += cardHTML;
    });
}

function renderDiyVideos() {
    const homeGrid = document.getElementById('home1-video-grid');
    const dashGrid = document.getElementById('dashboard-video-grid');

    const generateVideoHTML = (vid) => `
        <div class="video-card">
            <div class="video-thumbnail" style="background-image: url('${vid.img}')">
                <button class="video-play-btn" onclick="playMockVideo('${vid.title}')"><i class="fa-solid fa-play"></i></button>
                <span class="video-duration">${vid.duration}</span>
            </div>
            <div class="video-info">
                <span class="badge-pill secondary font-xs">${vid.difficulty}</span>
                <h4 class="video-title">${vid.title}</h4>
            </div>
        </div>
    `;

    if (homeGrid) {
        homeGrid.innerHTML = '';
        DIY_VIDEOS.slice(0, 3).forEach(v => {
            homeGrid.innerHTML += generateVideoHTML(v);
        });
    }

    if (dashGrid) {
        dashGrid.innerHTML = '';
        DIY_VIDEOS.forEach(v => {
            dashGrid.innerHTML += generateVideoHTML(v);
        });
    }
}

function playMockVideo(title) {
    showToast(`Launching Video tutorial: ${title}`);
}

// --- Home 2 Cost Estimator System ---
function calculateEstimate() {
    const services = document.querySelectorAll('.est-service');
    let total = 0;
    
    services.forEach(svc => {
        if (svc.checked) {
            total += parseFloat(svc.value);
        }
    });

    const isWaterproof = document.getElementById('est-waterproof').checked;
    if (isWaterproof) {
        total += parseFloat(document.getElementById('est-waterproof').value);
    }

    const totalDisplay = document.getElementById('estimator-total');
    
    // Small numeric scaling animation
    totalDisplay.style.transform = 'scale(1.15)';
    totalDisplay.textContent = `$${total.toFixed(2)}`;
    
    setTimeout(() => {
        totalDisplay.style.transform = 'scale(1)';
    }, 150);
}

function bookEstimatedService() {
    const services = document.querySelectorAll('.est-service');
    let selectedServices = [];
    services.forEach(svc => {
        if (svc.checked) {
            // Find label text
            const labelText = svc.parentElement.textContent.replace('$', '').replace(/[0-9]/g, '').trim();
            selectedServices.push(labelText);
        }
    });

    const serviceName = selectedServices.length > 0 ? selectedServices.join(" & ") : "General Mechanical Diagnosis";
    openBookingWithService(serviceName);
}

// --- E-Scooter Health Score Calculator ---
function calculateHealthScore() {
    const mileage = parseInt(document.getElementById('health-mileage').value);
    const battery = parseInt(document.getElementById('health-battery').value);
    const riding = parseInt(document.getElementById('health-riding').value);

    // Compute average score
    const score = Math.round((mileage + battery + riding) / 3);

    const resultBox = document.getElementById('health-result-box');
    const scoreNum = document.getElementById('health-score-num');
    const statusTitle = document.getElementById('health-status-title');
    const statusDesc = document.getElementById('health-status-desc');

    resultBox.classList.remove('hidden');
    scoreNum.textContent = `${score}%`;

    // Configure status labels based on score
    if (score >= 80) {
        statusTitle.textContent = "Excellent Condition";
        statusTitle.className = "text-green";
        statusDesc.textContent = "Your battery cells are healthy. Keep tires at 50 PSI to maximize range.";
    } else if (score >= 55) {
        statusTitle.textContent = "Moderate Wear Alert";
        statusTitle.className = "text-amber";
        statusDesc.textContent = "Battery capacity has dropped ~15%. Suggest mechanical check on brakes and folding stem.";
    } else {
        statusTitle.textContent = "Critical Maintenance Required";
        statusTitle.className = "text-red";
        statusDesc.textContent = "Severe range loss risk. Motherboard MOSFET check and BMS cell balance required immediately.";
    }

    showToast(`Calculated Health Rating: ${score}%`);
}

// --- Services Table Search ---
function searchPriceTable() {
    const input = document.getElementById('price-search-input');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('pricing-table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        let match = false;
        const tds = tr[i].getElementsByTagName('td');
        
        // Loop columns 0 and 1
        for (let j = 0; j < 2; j++) {
            if (tds[j]) {
                const textValue = tds[j].textContent || tds[j].innerText;
                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    match = true;
                }
            }
        }

        if (match) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

// --- Contact Form Submission ---
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    showToast(`Thank you, ${name}! Your diagnostic inquiry is submitted.`);
    document.getElementById('contact-form').reset();
}

// --- USER DASHBOARD STATE & ACTIONS ---
function renderUserDashboard() {
    // Set username text
    const dashUsername = document.getElementById('dash-username');
    if (dashUsername) dashUsername.textContent = state.currentUser.username;
    
    const welcomeUsername = document.getElementById('welcome-username');
    if (welcomeUsername) welcomeUsername.textContent = state.currentUser.username;
    
    const dashAvatar = document.getElementById('dash-avatar');
    if (dashAvatar) dashAvatar.src = state.currentUser.avatar;

    // Load dynamic lists
    renderDashboardOverview();
    renderDashboardShop();
    renderDashboardDiagnostics();
    renderDashboardHistory();
}

function switchDashboardTab(tabId, tabElement) {
    const tabs = document.querySelectorAll('.dash-tab-content');
    tabs.forEach(t => t.classList.add('hidden'));

    const activeTab = document.getElementById(`dash-tab-${tabId}`);
    if (activeTab) activeTab.classList.remove('hidden');

    const links = document.querySelectorAll('.dashboard-sidebar .sidebar-link');
    links.forEach(l => l.classList.remove('active'));
    
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Update breadcrumb label
    const label = document.getElementById('dash-current-tab-label');
    if (label) {
        let cleanLabel = tabId.charAt(0).toUpperCase() + tabId.slice(1);
        if (tabId === 'diy') cleanLabel = 'DIY Videos & Diagnostics';
        if (tabId === 'book') cleanLabel = 'Book Appointment';
        if (tabId === 'shop') cleanLabel = 'Parts Catalog Shop';
        label.textContent = cleanLabel;
    }
}

function renderDashboardOverview() {
    // 1. Stats Counter
    const userEmail = state.currentUser.email;
    const activeJobs = state.appointments.filter(a => a.userEmail === userEmail && a.status < 5);
    
    document.getElementById('user-stats-active').textContent = activeJobs.length;
    document.getElementById('user-stats-cart').textContent = state.cart.length;

    // Load active appointment stepper details
    const repairBox = document.querySelector('.repair-status-box');
    const activeAppointment = state.appointments.find(a => a.userEmail === userEmail && a.status < 5);

    if (activeAppointment) {
        repairBox.classList.remove('hidden');
        document.getElementById('repair-ticket-id').textContent = `Ticket #${activeAppointment.id}`;
        document.getElementById('repair-scooter-name').textContent = `Vehicle: ${activeAppointment.scooter} - ${activeAppointment.service}`;
        
        // Re-generate progress stepper
        const stepper = document.getElementById('repair-stepper');
        stepper.innerHTML = '';

        const stages = [
            { label: 'Received', icon: 'fa-check' },
            { label: 'Diagnosing', icon: 'fa-magnifying-glass' },
            { label: 'In Repair', icon: 'fa-wrench' },
            { label: 'Quality Check', icon: 'fa-vial' },
            { label: 'Ready', icon: 'fa-house-circle-check' }
        ];

        stages.forEach((stage, idx) => {
            const stageNum = idx + 1;
            let statusClass = '';
            let iconClass = `fa-solid ${stage.icon}`;

            if (activeAppointment.status > stageNum) {
                statusClass = 'completed';
                iconClass = 'fa-solid fa-check';
            } else if (activeAppointment.status === stageNum) {
                statusClass = 'active';
                // keep current stage icon
            }

            const stageHTML = `
                <div class="step-point ${statusClass}">
                    <div class="step-dot"><i class="${iconClass}"></i></div>
                    <span>${stage.label}</span>
                </div>
            `;
            stepper.innerHTML += stageHTML;
        });

        // Set status text
        document.getElementById('repair-status-desc-text').innerHTML = `
            <strong>Status Detail:</strong> ${activeAppointment.desc}
        `;
    } else {
        // Hide stepper if no active appointments
        repairBox.classList.add('hidden');
    }
}

// User Appointment Booking
function handleDashBooking(event) {
    event.preventDefault();
    const model = document.getElementById('book-scooter-model').value;
    const service = document.getElementById('book-service-type').value;
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;
    const tech = document.getElementById('book-technician').value;
    const notes = document.getElementById('book-notes').value;

    createNewAppointment(model, service, date, time, tech, notes);
    
    // Reset form & redirect
    document.getElementById('dash-booking-form').reset();
    switchDashboardTab('overview', document.querySelector('.sidebar-link'));
}

function createNewAppointment(model, service, date, time, tech, notes) {
    const ticketId = 'VG-' + Math.floor(1000 + Math.random() * 9000);
    const newJob = {
        id: ticketId,
        userEmail: state.currentUser.email,
        userName: state.currentUser.username,
        scooter: model,
        service: service,
        date: date,
        time: time,
        tech: tech,
        status: 1, // Default 'Received'
        notes: notes,
        desc: 'Appointment logged in database. Awaiting vehicle drop-off at 102 Cyber Drive.'
    };

    state.appointments.push(newJob);
    localStorage.setItem('vg_appointments', JSON.stringify(state.appointments));
    
    showToast(`Appointment reserved! Ticket: ${ticketId}`);
    renderDashboardOverview();
}

// User Dashboard Shop Tab
function renderDashboardShop() {
    const shopGrid = document.getElementById('shop-parts-grid');
    if (!shopGrid) return;

    shopGrid.innerHTML = '';
    state.parts.forEach(part => {
        let stockLabel = `<span class="stock-indicator in-stock">IN STOCK (${part.stock})</span>`;
        if (part.stock === 0) {
            stockLabel = `<span class="stock-indicator out-of-stock">OUT OF STOCK</span>`;
        } else if (part.stock <= 5) {
            stockLabel = `<span class="stock-indicator low-stock">LOW STOCK (${part.stock})</span>`;
        }

        const partHTML = `
            <div class="part-card" data-category="${part.category}">
                <div class="part-image">
                    <img src="${part.img}" alt="${part.name}">
                    <span class="part-tag">${part.category.toUpperCase()}</span>
                </div>
                <div class="part-details">
                    <div>
                        <div class="margin-bottom-sm">${stockLabel}</div>
                        <h3 class="part-title">${part.name}</h3>
                        <p class="text-dim font-sm">${part.desc}</p>
                    </div>
                    <div>
                        <div class="part-price-row">
                            <span class="part-price">$${part.price.toFixed(2)}</span>
                            <button class="btn btn-sm btn-primary" ${part.stock === 0 ? 'disabled' : ''} onclick="addToCart('${part.id}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        shopGrid.innerHTML += partHTML;
    });

    document.getElementById('cart-item-count').textContent = state.cart.length;
}

function filterShop(category, tabElement) {
    // Toggle tab active
    const tabs = document.querySelectorAll('.shop-filter-bar .filter-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (tabElement) tabElement.classList.add('active');

    const cards = document.querySelectorAll('#shop-parts-grid .part-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Shopping Cart system
function addToCart(partId) {
    const part = state.parts.find(p => p.id === partId);
    if (!part) return;

    if (part.stock === 0) {
        showToast("Part is currently out of stock.", "error");
        return;
    }

    state.cart.push(part);
    localStorage.setItem('vg_cart', JSON.stringify(state.cart));
    
    // Update UI counters
    document.getElementById('cart-item-count').textContent = state.cart.length;
    
    const userCartCounter = document.getElementById('user-stats-cart');
    if (userCartCounter) userCartCounter.textContent = state.cart.length;

    showToast(`Added ${part.name} to cart.`);
}

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('open');
    if (modal.classList.contains('open')) {
        renderCartItems();
    }
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('cart-total-price');
    if (!list) return;

    list.innerHTML = '';
    let total = 0;

    if (state.cart.length === 0) {
        list.innerHTML = '<div class="empty-placeholder">Your cart is empty. Browse parts in our catalog!</div>';
        totalDisplay.textContent = '$0.00';
        return;
    }

    state.cart.forEach((item, idx) => {
        total += item.price;
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${idx})">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
            </div>
        `;
        list.innerHTML += itemHTML;
    });

    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    localStorage.setItem('vg_cart', JSON.stringify(state.cart));
    
    document.getElementById('cart-item-count').textContent = state.cart.length;
    const userCartCounter = document.getElementById('user-stats-cart');
    if (userCartCounter) userCartCounter.textContent = state.cart.length;

    renderCartItems();
}

function checkoutCart() {
    if (state.cart.length === 0) return;

    // Deduct stock simulation
    state.cart.forEach(cartItem => {
        const dbItem = state.parts.find(p => p.id === cartItem.id);
        if (dbItem && dbItem.stock > 0) {
            dbItem.stock--;
        }
    });

    localStorage.setItem('vg_parts', JSON.stringify(state.parts));

    // Register simulated purchase as a custom history item
    const ticketId = 'VG-SHOP-' + Math.floor(1000 + Math.random() * 9000);
    const partsPurchased = state.cart.map(item => item.name).join(", ");
    const totalPrice = state.cart.reduce((sum, item) => sum + item.price, 0);

    const historyItem = {
        id: ticketId,
        userEmail: state.currentUser.email,
        userName: state.currentUser.username,
        scooter: "N/A (Direct Parts Purchase)",
        service: `Parts Purchased: ${partsPurchased}`,
        date: new Date().toISOString().split('T')[0],
        time: "N/A",
        tech: "Self-Checkout System",
        status: 5, // Completed
        notes: "Transaction completed successfully. Parts shipped to customer address.",
        desc: "Order processed and dispatched."
    };

    state.appointments.push(historyItem);
    localStorage.setItem('vg_appointments', JSON.stringify(state.appointments));

    // Clear cart
    state.cart = [];
    localStorage.setItem('vg_cart', JSON.stringify([]));

    showToast("Checkout completed. View details in service history!");
    toggleCartModal();
    renderUserDashboard();
}

// User Dashboard Diagnostics Tab
function handleDiagnosticsSubmit(event) {
    event.preventDefault();
    const model = document.getElementById('diag-scooter').value;
    const queryText = document.getElementById('diag-query').value;

    const queryId = 'DIAG-' + Math.floor(100 + Math.random() * 900);
    const newQuery = {
        id: queryId,
        userEmail: state.currentUser.email,
        userName: state.currentUser.username,
        scooter: model,
        query: queryText,
        replies: []
    };

    state.queries.push(newQuery);
    localStorage.setItem('vg_queries', JSON.stringify(state.queries));

    showToast(`Query logged! ID: ${queryId}`);
    document.getElementById('dash-diagnostics-form').reset();
    renderDashboardDiagnostics();
}

function renderDashboardDiagnostics() {
    const list = document.getElementById('diagnostics-response-list');
    if (!list) return;

    list.innerHTML = '';
    const userEmail = state.currentUser.email;
    const userQueries = state.queries.filter(q => q.userEmail === userEmail);

    if (userQueries.length === 0) {
        list.innerHTML = '<div class="empty-placeholder">No questions submitted yet. Ask our technician above!</div>';
        return;
    }

    userQueries.forEach(q => {
        let repliesHTML = '';
        if (q.replies.length === 0) {
            repliesHTML = '<p class="text-dim font-xs"><em>Awaiting response from technician...</em></p>';
        } else {
            q.replies.forEach(rep => {
                repliesHTML += `
                    <div class="chat-bubble admin-reply margin-top-sm">
                        <span class="bubble-meta">Admin Response</span>
                        <p>${rep}</p>
                    </div>
                `;
            });
        }

        const queryHTML = `
            <div class="query-block margin-bottom-md" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div class="chat-bubble">
                    <span class="bubble-meta">You (${q.scooter})</span>
                    <p><strong>Query:</strong> ${q.query}</p>
                </div>
                <div class="replies-container">
                    ${repliesHTML}
                </div>
            </div>
        `;
        list.innerHTML += queryHTML;
    });
}

function runMatrixDiagnostic() {
    const select = document.getElementById('matrix-symptom');
    const box = document.getElementById('matrix-output-box');
    const severity = document.getElementById('matrix-severity');
    const cause = document.getElementById('matrix-cause');
    const recommendation = document.getElementById('matrix-recommendation');
    const cost = document.getElementById('matrix-cost');

    if (select.value === "") {
        box.classList.add('hidden');
        return;
    }

    box.classList.remove('hidden');

    const issues = {
        'no-power': { severity: 'hard', cause: 'Blown BMS fuse or disconnected main wire key harness.', rec: 'Inspect controller key cable plug; test battery output voltage.', cost: '$120.00' },
        'low-range': { severity: 'medium', cause: 'Cell group degradation causing premature BMS voltage cuts.', rec: 'Cell balancing calibration required; avoid storing at 100% continuously.', cost: '$140.00' },
        'brake-squeak': { severity: 'easy', cause: 'Contaminated brake pad surfaces or warped brake rotor.', rec: 'Clean rotor with isopropyl alcohol; adjust caliper screws to align.', cost: '$35.00' },
        'shaking': { severity: 'easy', cause: 'Loose hinge clamp latch or worn folding stem bushing shim.', rec: 'Insert dampening rubber shim; tighten clamp axle hinge bolt.', cost: '$30.00' },
        'error-14': { severity: 'easy', cause: 'Hall sensor fault inside throttle thumb assembly.', rec: 'Verify controller cable pin connection; replace throttle assembly.', cost: '$45.00' }
    };

    const choice = issues[select.value];
    severity.textContent = choice.severity.toUpperCase();
    severity.className = `matrix-severity badge-pill ${choice.severity === 'hard' ? 'red' : choice.severity === 'medium' ? 'amber' : 'green'}`;
    
    cause.textContent = choice.cause;
    recommendation.textContent = choice.rec;
    cost.textContent = choice.cost;
}

// User Dashboard Service History Tab
function renderDashboardHistory() {
    const container = document.getElementById('history-list-container');
    if (!container) return;

    container.innerHTML = '';
    const userEmail = state.currentUser.email;
    
    // Sort so most recent is first
    const userHistory = state.appointments.filter(a => a.userEmail === userEmail).reverse();

    if (userHistory.length === 0) {
        container.innerHTML = '<div class="empty-placeholder">No service or purchase records found in history.</div>';
        return;
    }

    userHistory.forEach(item => {
        let statusBadge = '';
        if (item.status === 5) {
            statusBadge = '<span class="stock-indicator in-stock"><i class="fa-solid fa-circle-check"></i> Completed</span>';
        } else {
            statusBadge = '<span class="stock-indicator low-stock"><i class="fa-solid fa-spinner fa-spin"></i> In Progress</span>';
        }

        const itemHTML = `
            <div class="history-item-card">
                <div class="history-header">
                    <div class="history-title-area">
                        <h3>${item.service}</h3>
                        <div class="history-meta-row margin-top-sm">
                            <span><i class="fa-solid fa-calendar"></i> Date: ${item.date}</span>
                            <span><i class="fa-solid fa-ticket"></i> Job ID: ${item.id}</span>
                            <span><i class="fa-solid fa-user-check"></i> Tech: ${item.tech}</span>
                        </div>
                    </div>
                    <div>
                        <div class="history-price">$120.00</div>
                        <div class="margin-top-sm text-center">${statusBadge}</div>
                    </div>
                </div>
                <div class="status-detail-desc">
                    <p><strong>Mechanic Notes:</strong> ${item.notes || 'Routine diagnostic and validation checklist completed.'}</p>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });
}

// --- ADMINISTRATOR DASHBOARD ---
function renderAdminDashboard() {
    renderAdminAppointments();
    renderAdminInventory();
    renderAdminQueries();
}

function switchAdminTab(tabId, tabElement) {
    const tabs = document.querySelectorAll('.admin-tab-content');
    tabs.forEach(t => t.classList.add('hidden'));

    const activeTab = document.getElementById(`admin-tab-${tabId}`);
    if (activeTab) activeTab.classList.remove('hidden');

    const links = document.querySelectorAll('.admin-sidebar .sidebar-link');
    links.forEach(l => l.classList.remove('active'));
    
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Update breadcrumb label
    const label = document.getElementById('admin-current-tab-label');
    if (label) {
        let cleanLabel = tabId.charAt(0).toUpperCase() + tabId.slice(1);
        if (tabId === 'appointments') cleanLabel = 'Manage Bookings';
        if (tabId === 'inventory') cleanLabel = 'Parts Inventory';
        if (tabId === 'queries') cleanLabel = 'Diagnostic Queries';
        if (tabId === 'analytics') cleanLabel = 'Shop Analytics';
        label.textContent = cleanLabel;
    }
}

function renderAdminAppointments() {
    const tbody = document.getElementById('admin-appointments-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    // Reverse list for recent first
    const sortedJobs = [...state.appointments].reverse();

    sortedJobs.forEach(job => {
        const rowHTML = `
            <tr>
                <td><strong>#${job.id}</strong></td>
                <td>
                    <div>${job.userName}</div>
                    <div class="text-dim font-xs">${job.userEmail}</div>
                </td>
                <td>${job.scooter}</td>
                <td>${job.service}</td>
                <td>${job.tech}</td>
                <td>
                    <span class="stock-indicator ${job.status === 5 ? 'in-stock' : 'low-stock'}">
                        ${job.status === 5 ? 'Completed' : 'In Progress'}
                    </span>
                </td>
                <td>
                    <select onchange="updateAppointmentStatus('${job.id}', this.value)">
                        <option value="1" ${job.status === 1 ? 'selected' : ''}>Received</option>
                        <option value="2" ${job.status === 2 ? 'selected' : ''}>Diagnosing</option>
                        <option value="3" ${job.status === 3 ? 'selected' : ''}>In Repair</option>
                        <option value="4" ${job.status === 4 ? 'selected' : ''}>Quality Check</option>
                        <option value="5" ${job.status === 5 ? 'selected' : ''}>Ready for Pick Up</option>
                    </select>
                </td>
            </tr>
        `;
        tbody.innerHTML += rowHTML;
    });
}

function updateAppointmentStatus(appointmentId, newStatus) {
    const job = state.appointments.find(a => a.id === appointmentId);
    if (!job) return;

    job.status = parseInt(newStatus);
    
    const statusDescriptions = {
        1: 'Vehicle logged at intake desk. Diagnostic battery load test and error scanning initiated.',
        2: 'Computerized diagnostic system attached. Solder inspection on BMS logic boards and motor hall calibration running.',
        3: 'Specialist is soldering board points or fitting high pressure solid tires inside electrostatic bay.',
        4: 'Reassembly completed. Safety dyno tests running. Calibrating brake pads friction coefficient.',
        5: 'Safety testing passed. Battery cells balanced. Ready for collection. Pick up bay code: VG-RELEASE.'
    };

    job.desc = statusDescriptions[job.status] || 'Mechanic processing update.';

    localStorage.setItem('vg_appointments', JSON.stringify(state.appointments));
    showToast(`Updated Job #${appointmentId} status.`);
    renderAdminAppointments();
}

function renderAdminInventory() {
    const tbody = document.getElementById('admin-inventory-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.parts.forEach(part => {
        let stockClass = 'in-stock';
        let stockText = 'In Stock';

        if (part.stock === 0) {
            stockClass = 'out-of-stock';
            stockText = 'Out of Stock';
        } else if (part.stock <= 5) {
            stockClass = 'low-stock';
            stockText = 'Low Stock';
        }

        const rowHTML = `
            <tr>
                <td><strong>${part.name}</strong></td>
                <td>${part.category.toUpperCase()}</td>
                <td class="table-price">$${part.price.toFixed(2)}</td>
                <td><span class="stock-indicator ${stockClass}">${stockText}</span></td>
                <td><strong>${part.stock} items</strong></td>
                <td>
                    <div class="admin-qty-controls">
                        <button class="btn-qty" onclick="adjustPartStock('${part.id}', -1)">-</button>
                        <button class="btn-qty" onclick="adjustPartStock('${part.id}', 1)">+</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += rowHTML;
    });
}

function adjustPartStock(partId, amount) {
    const part = state.parts.find(p => p.id === partId);
    if (!part) return;

    const newStock = part.stock + amount;
    if (newStock < 0) return;

    part.stock = newStock;
    localStorage.setItem('vg_parts', JSON.stringify(state.parts));
    
    showToast(`Stock updated for ${part.name}`);
    renderAdminInventory();
}

function resetInventoryStock() {
    state.parts = INITIAL_PARTS.map(p => ({ ...p }));
    localStorage.setItem('vg_parts', JSON.stringify(state.parts));
    showToast("Stock levels reset to factory defaults.");
    renderAdminInventory();
}

function renderAdminQueries() {
    const list = document.getElementById('admin-queries-list');
    if (!list) return;

    list.innerHTML = '';
    
    if (state.queries.length === 0) {
        list.innerHTML = '<div class="empty-placeholder">No customer troubleshooting queries submitted.</div>';
        return;
    }

    state.queries.forEach(q => {
        let repliesHTML = '';
        q.replies.forEach(rep => {
            repliesHTML += `<div class="chat-bubble admin-reply margin-top-sm"><p>${rep}</p></div>`;
        });

        const queryHTML = `
            <div class="query-admin-card">
                <div class="query-admin-header">
                    <h4>Customer Query ID: #${q.id}</h4>
                    <span class="ticket-badge">${q.scooter}</span>
                </div>
                <div class="chat-bubble">
                    <span class="bubble-meta">Customer: ${q.userName} (${q.userEmail})</span>
                    <p>${q.query}</p>
                </div>
                <div class="replies-container margin-top-sm">
                    ${repliesHTML}
                </div>
                <div class="query-reply-box">
                    <textarea id="reply-text-${q.id}" rows="2" placeholder="Write mechanic response..."></textarea>
                    <button class="btn btn-secondary btn-sm" onclick="submitQueryReply('${q.id}')">Submit Reply</button>
                </div>
            </div>
        `;
        list.innerHTML += queryHTML;
    });
}

function submitQueryReply(queryId) {
    const textarea = document.getElementById(`reply-text-${queryId}`);
    if (!textarea || textarea.value.trim() === "") return;

    const queryObj = state.queries.find(q => q.id === queryId);
    if (!queryObj) return;

    const replyMsg = `Sergei Volkov (Lead Tech): ${textarea.value.trim()}`;
    queryObj.replies.push(replyMsg);

    localStorage.setItem('vg_queries', JSON.stringify(state.queries));
    showToast("Response submitted to user dashboard.");
    textarea.value = '';
    renderAdminQueries();
}

// --- Global helper utilities ---
function scrollToElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

function navigateToDashboard() {
    if (state.currentUser && state.currentUser.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'user-dashboard.html';
    }
}

function navigateToDashboardShop() {
    if (!state.currentUser) {
        showToast("Please login to access store", "error");
        window.location.href = 'login.html';
        return;
    }
    window.location.href = 'user-dashboard.html';
}

function openBookingModal() {
    // Set date min to today
    const dateInput = document.getElementById('m-book-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    document.getElementById('bookingModal').classList.add('open');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('open');
}

function openBookingWithService(serviceName) {
    openBookingModal();
    const select = document.getElementById('m-book-service');
    if (select) {
        // Find option that matches or starts with serviceName
        for (let i = 0; i < select.options.length; i++) {
            if (serviceName.toLowerCase().indexOf(select.options[i].value.toLowerCase()) > -1 || 
                select.options[i].value.toLowerCase().indexOf(serviceName.toLowerCase()) > -1) {
                select.selectedIndex = i;
                break;
            }
        }
    }
}

function handleModalBooking(event) {
    event.preventDefault();
    const model = document.getElementById('m-book-scooter').value;
    const service = document.getElementById('m-book-service').value;
    const date = document.getElementById('m-book-date').value;
    const time = document.getElementById('m-book-time').value;
    const notes = document.getElementById('m-book-notes').value;

    if (!state.currentUser) {
        showToast("Please login to save appointment.", "error");
        closeBookingModal();
        navigateTo('login');
        return;
    }

    createNewAppointment(model, service, date, time, "First Available", notes);
    closeBookingModal();
    navigateTo('user-dashboard');
}

// --- Toggle Mobile Menu ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileNavMenu');
    const backdrop = document.getElementById('mobileNavBackdrop');
    menu.classList.toggle('open');
    backdrop.classList.toggle('open');
}

function closeMobileMenuOnly() {
    const menu = document.getElementById('mobileNavMenu');
    const backdrop = document.getElementById('mobileNavBackdrop');
    if (menu) menu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
}

// Accordion helper with icon toggle
function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle('open');
    const icon = btn.querySelector('.faq-icon');
    if (icon) {
        if (item.classList.contains('open')) {
            icon.className = 'fa-solid fa-minus faq-icon';
        } else {
            icon.className = 'fa-solid fa-plus faq-icon';
        }
    }
}

// --- Smooth Scroll Helper ---
function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- Interactive Eco-Tracker ---
function updateGreenImpact() {
    const slider = document.getElementById('green-mileage-range');
    const milesVal = document.getElementById('green-miles-val');
    const co2Val = document.getElementById('green-co2-val');
    const treesVal = document.getElementById('green-trees-val');

    if (!slider) return;
    const miles = parseInt(slider.value);
    
    // Update label
    if (milesVal) milesVal.textContent = `${miles} miles`;

    // Calculate annual CO2 savings: ~0.404 lbs per mile * 220 commute days
    const co2Savings = Math.round(miles * 220 * 0.404);
    if (co2Val) co2Val.textContent = `${co2Savings.toLocaleString()} lbs`;

    // Equivalent trees offset (1 tree absorbs ~22 lbs CO2/year)
    const treesEquivalent = Math.round(co2Savings / 22);
    if (treesVal) treesVal.textContent = `${treesEquivalent} ${treesEquivalent === 1 ? 'Tree' : 'Trees'}`;
}

// Map-related interactive SVG removed to avoid runtime errors when map markup is absent.

// --- Roadside Dispatch ---
function handleDispatchSubmit(e) {
    e.preventDefault();
    const location = document.getElementById('disp-location').value;
    showToast(`Emergency dispatch confirmed! Van is heading to ${location}. Estimated arrival: 14 mins.`);
    document.getElementById('dispatch-form').reset();
}

// --- Survey Rating ---
let currentSurveyRating = 5;

function rateSurveyStars(rating) {
    currentSurveyRating = rating;
    const stars = document.querySelectorAll('.rider-survey-section .star-rating');
    stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-val'));
        if (val <= rating) {
            star.style.color = 'var(--primary-color)';
            star.classList.add('active');
        } else {
            star.style.color = 'var(--text-dim)';
            star.classList.remove('active');
        }
    });
}

function handleSurveySubmit(e) {
    e.preventDefault();
    showToast(`Feedback submitted! You rated us ${currentSurveyRating} Stars.`);
    document.getElementById('survey-form').reset();
    rateSurveyStars(5);
}

// --- Toast System ---
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    let icon = '<i class="fa-solid fa-circle-check text-green"></i>';
    if (type === 'error') {
        icon = '<i class="fa-solid fa-triangle-exclamation text-red"></i>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Theme toggle click
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // RTL toggle click
    document.getElementById('rtl-toggle').addEventListener('click', toggleDirection);
    
    const mobileRtlToggle = document.getElementById('mobile-rtl-toggle');
    if (mobileRtlToggle) {
        mobileRtlToggle.addEventListener('click', toggleDirection);
    }
}

// --- Mobile Navigation Helpers ---
function toggleMobileDropdown(button) {
    const parent = button.parentElement;
    const allDropdowns = document.querySelectorAll('.mobile-has-dropdown');
    allDropdowns.forEach(dd => {
        if (dd !== parent) {
            dd.classList.remove('open');
        }
    });
    parent.classList.toggle('open');
}
