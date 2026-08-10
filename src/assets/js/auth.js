/**
 * ============================================
 * AUTHENTICATIE MODULE
 * ============================================
 * Behandelt alles rond inloggen, uitloggen en
 * sessiebeheer met Supabase.
 * ============================================
 */

console.log('🔐 Authenticatie module geladen');

// ============================================
// SUPABASE INITIALISATIE
// ============================================

// Haal de configuratie op (LET OP: SUPABASE_CONFIG, niet CONFIG!)
const supabaseConfig = window.SUPABASE_CONFIG;

if (!supabaseConfig || !supabaseConfig.URL || !supabaseConfig.ANON_KEY) {
    console.error('❌ Supabase configuratie niet gevonden!');
    console.error('Controleer of config.js bestaat en de juiste gegevens bevat.');
} else {
    console.log('✅ Supabase configuratie gevonden');
    console.log('📍 URL:', supabaseConfig.URL);
}

// Maak de Supabase client aan (globaal beschikbaar)
const supabaseClient = supabase.createClient(
    supabaseConfig.URL,
    supabaseConfig.ANON_KEY
);
window.supabaseClient = supabaseClient;

// ============================================
// HUIDIGE GEBRUIKER
// ============================================

let currentUser = null;
window.currentUser = currentUser;

// ============================================
// LOGIN FUNCTIE
// ============================================

/**
 * Logt een gebruiker in met email en wachtwoord
 * @param {string} email - Het e-mailadres
 * @param {string} password - Het wachtwoord
 * @returns {Promise<object>} - { success: boolean, user: object, error: string }
 */
async function loginUser(email, password) {
    console.log('🔑 Inlogpoging voor:', email);
    
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('❌ Login mislukt:', error.message);
            return { success: false, error: error.message };
        }
        
        if (data && data.user) {
            console.log('✅ Ingelogd als:', data.user.email);
            currentUser = data.user;
            window.currentUser = currentUser;
            
            // Sla gebruiker op in session storage voor persistentie
            sessionStorage.setItem('panta_user', JSON.stringify(data.user));
            
            return { success: true, user: data.user };
        }
        
        return { success: false, error: 'Onbekende fout bij inloggen' };
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij login:', error);
        return { success: false, error: 'Er is een fout opgetreden. Probeer opnieuw.' };
    }
}

// ============================================
// LOGOUT FUNCTIE
// ============================================

/**
 * Logt de huidige gebruiker uit
 * @returns {Promise<object>} - { success: boolean, error: string }
 */
async function logoutUser() {
    console.log('🚪 Uitloggen...');
    
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        
        if (error) {
            console.error('❌ Fout bij uitloggen:', error.message);
            return { success: false, error: error.message };
        }
        
        console.log('✅ Uitgelogd');
        currentUser = null;
        window.currentUser = null;
        sessionStorage.removeItem('panta_user');
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij uitloggen:', error);
        return { success: false, error: 'Er is een fout opgetreden.' };
    }
}

// ============================================
// SESSIE CONTROLE
// ============================================

/**
 * Controleert of er een actieve sessie is
 * @returns {Promise<object|null>} - De gebruiker of null
 */
async function checkSession() {
    console.log('🔍 Controleren van sessie...');
    
    try {
        // Controleer of supabaseClient bestaat
        if (!window.supabaseClient) {
            console.error('❌ supabaseClient niet geïnitialiseerd!');
            return null;
        }
        
        // Eerst checken we of er een user in session storage staat
        const storedUser = sessionStorage.getItem('panta_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log('📦 Gebruiker gevonden in session storage:', user.email);
            currentUser = user;
            window.currentUser = user;
            return user;
        }
        
        // Anders vragen we de sessie op bij Supabase
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        
        if (error) {
            console.error('❌ Fout bij sessie controle:', error.message);
            return null;
        }
        
        if (session && session.user) {
            console.log('✅ Actieve sessie gevonden voor:', session.user.email);
            currentUser = session.user;
            window.currentUser = session.user;
            sessionStorage.setItem('panta_user', JSON.stringify(session.user));
            return session.user;
        }
        
        console.log('👤 Geen actieve sessie gevonden');
        return null;
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij sessie controle:', error);
        return null;
    }
}

// ============================================
// LOGIN PAGINA WEERGAVE
// ============================================

/**
 * Toont de login pagina
 */
function showLoginPage() {
    console.log('📄 Laden van login pagina...');
    
    const wrapper = document.getElementById('content-wrapper');
    if (!wrapper) return;
    
    // Login HTML
    wrapper.innerHTML = `
        <div style="
            max-width: 420px;
            margin: 60px auto;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(26, 43, 76, 0.1);
        ">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🚲</div>
                <h1 style="font-size: 1.8rem; margin-bottom: 5px;">Panta Club</h1>
                <p style="color: #666; font-size: 0.95rem;">Log in om toegang te krijgen</p>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">E-mailadres</label>
                    <input type="email" id="loginEmail" placeholder="jouw@email.com" required>
                </div>
                
                <div class="form-group">
                    <label for="loginPassword">Wachtwoord</label>
                    <input type="password" id="loginPassword" placeholder="••••••••" required>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Inloggen
                </button>
            </form>
            
            <div id="loginError" style="
                display: none;
                margin-top: 15px;
                padding: 10px;
                background: #f8d7da;
                color: #721c24;
                border-radius: 8px;
                font-size: 0.9rem;
                text-align: center;
            "></div>
            
            <p style="
                text-align: center; 
                margin-top: 20px; 
                font-size: 0.85rem; 
                color: #999;
            ">
                Nog geen account? Neem contact op met de beheerder.
            </p>
        </div>
    `;
    
    // Event listener voor het formulier
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

// ============================================
// LOGIN FORMULIER AFHANDELING
// ============================================

/**
 * Handelt het login formulier af
 * @param {Event} event - Het submit event
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    console.log('📝 Login formulier ingediend');
    
    // Haal de ingevulde gegevens op
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Reset error
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
    
    // Simpele validatie
    if (!email || !password) {
        showLoginError('Vul zowel je e-mailadres als wachtwoord in.');
        return;
    }
    
    // Toon loading state
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    
    try {
        // Probeer in te loggen
        const result = await loginUser(email, password);
        
        if (result.success) {
            console.log('✅ Inloggen gelukt!');
            // Laad het dashboard
            if (typeof window.loadDashboard === 'function') {
                window.loadDashboard();
            } else {
                // Fallback: herlaad de pagina
                location.reload();
            }
        } else {
            console.error('❌ Login mislukt:', result.error);
            showLoginError(result.error || 'Ongeldig e-mailadres of wachtwoord.');
        }
        
    } catch (error) {
        console.error('❌ Onverwachte fout:', error);
        showLoginError('Er is een fout opgetreden. Probeer opnieuw.');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

/**
 * Toont een foutmelding op de login pagina
 * @param {string} message - De foutmelding
 */
function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert('❌ ' + message);
    }
}

// ============================================
// DASHBOARD LADEN (als ingelogd)
// ============================================

/**
 * Laadt het dashboard (wordt aangeroepen door app.js)
 */
function loadDashboard() {
    console.log('📊 Dashboard laden...');
    
    const wrapper = document.getElementById('content-wrapper');
    if (!wrapper) return;
    
    // Toon een welkomstbericht met de gebruiker
    const user = window.currentUser;
    const userName = user ? user.email : 'Gebruiker';
    
    wrapper.innerHTML = `
        <div style="padding: 20px 0;">
            <h1>👋 Welkom, ${userName}!</h1>
            <p style="color: #666; margin-bottom: 30px;">
                Je bent succesvol ingelogd. Beheer hier jouw fietsen, klanten en onderhoud.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">🚲</div>
                    <h3 style="font-size: 1.8rem; margin: 0;">0</h3>
                    <p style="color: #666; margin: 0;">Totaal fietsen</p>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">👤</div>
                    <h3 style="font-size: 1.8rem; margin: 0;">0</h3>
                    <p style="color: #666; margin: 0;">Totaal klanten</p>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">🔧</div>
                    <h3 style="font-size: 1.8rem; margin: 0;">0</h3>
                    <p style="color: #666; margin: 0;">Openstaand onderhoud</p>
                </div>
            </div>
            
            <div class="card">
                <h3>📌 Snelle acties</h3>
                <div class="btn-group" style="margin-top: 15px;">
                    <button class="btn btn-primary" onclick="window.showMessage('Fietsen toevoegen komt binnenkort!')">
                        ➕ Fiets toevoegen
                    </button>
                    <button class="btn btn-accent" onclick="window.showMessage('Klanten toevoegen komt binnenkort!')">
                        👤 Klant toevoegen
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Navigatie zichtbaar maken
    document.querySelector('.navbar').style.display = 'block';
}

// ============================================
// EXPORTEER FUNCTIES
// ============================================

// Maak functies globaal beschikbaar
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.checkSession = checkSession;
window.showLoginPage = showLoginPage;
window.loadDashboard = loadDashboard;
window.showLoginError = showLoginError;

console.log('✅ Authenticatie module klaar voor gebruik');