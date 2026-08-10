/**
 * ============================================
 * NAVIGATIE COMPONENT
 * ============================================
 * Dit is de centrale navigatie die op alle
 * pagina's wordt gebruikt. Wijzigingen hier
 * worden overal doorgevoerd.
 * ============================================
 */

console.log('🧭 Navigatie component geladen');

/**
 * Genereert de HTML voor de navigatiebalk
 * en plaatst deze in het #navigation element
 */
function renderNavigation() {
    const navElement = document.getElementById('navigation');
    if (!navElement) {
        console.error('❌ #navigation element niet gevonden!');
        return;
    }
    
    // Controleer of gebruiker is ingelogd
    const isLoggedIn = window.currentUser !== null && window.currentUser !== undefined;
    
    // HTML voor de navigatie
    navElement.innerHTML = `
        <nav class="navbar">
            <div class="container-full">
                <div class="navbar-brand">
                    <span>🚲 Panta Club</span>
                </div>
                
                <!-- Hamburger menu knop (alleen zichtbaar op mobiel) -->
                <button class="menu-toggle" id="menuToggle" aria-label="Menu openen">
                    ☰
                </button>
                
                <ul class="navbar-links" id="navbarLinks">
                    ${isLoggedIn ? `
                        <li><a href="#" class="active" data-page="dashboard">📊 Dashboard</a></li>
                        <li><a href="#" data-page="modellen">📦 Modellen</a></li>
                        <li><a href="#" data-page="fietsen">🚲 Fietsen</a></li>
                        <li><a href="#" data-page="klanten">👤 Klanten</a></li>
                        <li><a href="#" data-page="onderhoud">🔧 Onderhoud</a></li>
                        <li><a href="#" id="logout-link">🚪 Uitloggen</a></li>
                    ` : `
                        <li><a href="#" onclick="window.showLoginPage()">🔐 Inloggen</a></li>
                    `}
                </ul>
            </div>
        </nav>
    `;
    
    console.log('✅ Navigatie geladen');
    
    // Als de gebruiker is ingelogd, zet dan de event listeners
    if (isLoggedIn) {
        setupNavigationEvents();
    }
}

/**
 * Zet de event listeners voor de navigatie
 */
function setupNavigationEvents() {
    // Logout link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.handleLogout === 'function') {
                window.handleLogout();
            } else if (typeof window.logoutUser === 'function') {
                window.logoutUser().then(() => {
                    window.showLoginPage();
                    renderNavigation(); // Herlaad navigatie
                });
            }
        });
    }
    
    // Navigatie links
    document.querySelectorAll('.navbar-links a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page && typeof window.navigateTo === 'function') {
                window.navigateTo(page);
            }
        });
    });
    
    // Hamburger menu
    const menuToggle = document.getElementById('menuToggle');
    const navbarLinks = document.getElementById('navbarLinks');
    
    if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navbarLinks.classList.toggle('open');
            this.textContent = navbarLinks.classList.contains('open') ? '✕' : '☰';
        });
        
        // Sluit menu als er op een link wordt geklikt
        navbarLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navbarLinks.classList.remove('open');
                if (menuToggle) {
                    menuToggle.textContent = '☰';
                }
            });
        });
    }
}

/**
 * Update de navigatie om de actieve pagina te markeren
 * @param {string} page - De naam van de actieve pagina
 */
function setActiveNavItem(page) {
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
}

// Maak functies globaal beschikbaar
window.renderNavigation = renderNavigation;
window.setActiveNavItem = setActiveNavItem;

console.log('✅ Navigatie component klaar voor gebruik');