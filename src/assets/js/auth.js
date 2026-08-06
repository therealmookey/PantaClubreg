/**
 * ============================================
 * AUTHENTICATIE MODULE
 * ============================================
 * Behandelt alles rond inloggen, uitloggen en
 * sessiebeheer met Supabase.
 * ============================================
 */

// Wacht tot de DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Authenticatie module geladen');
    
    // Initialiseer Supabase client
    // De supabase library is geladen via CDN in index.html
    const supabaseUrl = CONFIG.SUPABASE_URL;
    const supabaseKey = CONFIG.SUPABASE_ANON_KEY;
    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Controleer of gebruiker al ingelogd is
    checkSession();
    
    // Zet event listeners voor login/logout formulieren
    setupAuthListeners();
});

/**
 * Controleert of er een actieve sessie is
 * Als de gebruiker ingelogd is, stuur ze door naar dashboard
 * Anders toon de login-pagina
 */
async function checkSession() {
    try {
        console.log('🔍 Controleren van sessie...');
        
        // Vraag de huidige sessie op bij Supabase
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        
        if (error) {
            console.error('❌ Fout bij sessie controle:', error);
            showLoginPage();
            return;
        }
        
        if (session) {
            // Gebruiker is ingelogd
            console.log('✅ Gebruiker is ingelogd:', session.user.email);
            window.currentUser = session.user;
            showDashboard();
        } else {
            // Geen actieve sessie
            console.log('👤 Geen actieve sessie gevonden');
            showLoginPage();
        }
    } catch (error) {
        console.error('❌ Onverwachte fout bij sessie controle:', error);
        showLoginPage();
    }
}

/**
 * Toont de login-pagina in de main content
 */
function showLoginPage() {
    console.log('📄 Laden van login-pagina...');
    const mainContent = document.getElementById('main-content');
    
    // HTML voor de login-pagina
    mainContent.innerHTML = `
        <div class="container">
            <div class="login-container">
                <h1>🔐 Welkom terug</h1>
                <p class="subtitle">Log in om toegang te krijgen tot het registratieplatform</p>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-email">E-mailadres</label>
                        <input type="email" id="login-email" placeholder="jouw@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password">Wachtwoord</label>
                        <input type="password" id="login-password" placeholder="••••••••" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Inloggen
                    </button>
                </form>
                
                <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: #666;">
                    Nog geen account? Neem contact op met de beheerder.
                </p>
            </div>
        </div>
    `;
    
    // Zet de event listener voor het login-formulier
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

/**
 * Toont het dashboard na succesvol inloggen
 */
function showDashboard() {
    console.log('📊 Laden van dashboard...');
    // De app.js zal het dashboard laden
    if (typeof window.loadDashboard === 'function') {
        window.loadDashboard();
    } else {
        console.warn('⚠️ loadDashboard functie nog niet beschikbaar');
    }
}

/**
 * Handelt het inloggen af
 */
async function handleLogin(event) {
    event.preventDefault();
    console.log('🔑 Inlogpoging...');
    
    // Haal de ingevulde gegevens op
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Toon loading state
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    
    try {
        // Probeer in te loggen met Supabase
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('❌ Login mislukt:', error);
            showToast('❌ ' + error.message, 'error');
            button.textContent = originalText;
            button.disabled = false;
            return;
        }
        
        // Login succesvol
        console.log('✅ Ingelogd als:', data.user.email);
        window.currentUser = data.user;
        showToast('✅ Welkom terug, ' + data.user.email + '!', 'success');
        
        // Navigeer naar dashboard
        showDashboard();
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij login:', error);
        showToast('❌ Er is een fout opgetreden. Probeer opnieuw.', 'error');
        button.textContent = originalText;
        button.disabled = false;
    }
}

/**
 * Handelt het uitloggen af
 */
async function handleLogout() {
    console.log('🚪 Uitloggen...');
    
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        
        if (error) {
            console.error('❌ Fout bij uitloggen:', error);
            showToast('❌ Kon niet uitloggen.', 'error');
            return;
        }
        
        console.log('✅ Uitgelogd');
        window.currentUser = null;
        showToast('👋 Je bent uitgelogd.', 'success');
        
        // Toon login-pagina
        showLoginPage();
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij uitloggen:', error);
        showToast('❌ Er is een fout opgetreden.', 'error');
    }
}

/**
 * Zet event listeners voor authenticatie
 */
function setupAuthListeners() {
    // Deze functie wordt aangeroepen nadat de DOM geladen is
    // We gebruiken event delegation voor dynamische elementen
    document.addEventListener('click', function(event) {
        // Logout knop
        if (event.target.matches('#logout-btn') || event.target.closest('#logout-btn')) {
            event.preventDefault();
            handleLogout();
        }
    });
}

/**
 * Toont een melding (toast) aan de gebruiker
 */
function showToast(message, type = 'info') {
    // Check of toast container bestaat, anders maak hem
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Maak de toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    // Verwijder na 4 seconden
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Maak showToast globaal beschikbaar
window.showToast = showToast;