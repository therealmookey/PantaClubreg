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

// Haal de configuratie op
const supabaseConfig = window.SUPABASE_CONFIG;

if (!supabaseConfig || !supabaseConfig.URL || !supabaseConfig.ANON_KEY) {
    console.error('❌ Supabase configuratie niet gevonden!');
    console.error('Controleer of config.js bestaat en de juiste gegevens bevat.');
} else {
    console.log('✅ Supabase configuratie gevonden');
    console.log('📍 URL:', supabaseConfig.URL);
}

// Maak de Supabase client aan
let supabaseClient = null;

try {
    const supabaseLib = window.supabase || supabase;
    
    if (supabaseLib && supabaseLib.createClient) {
        supabaseClient = supabaseLib.createClient(
            supabaseConfig.URL,
            supabaseConfig.ANON_KEY
        );
        console.log('✅ Supabase client aangemaakt');
    } else {
        console.error('❌ Kan geen Supabase client aanmaken');
    }
} catch (error) {
    console.error('❌ Fout bij aanmaken Supabase client:', error);
}

window.supabaseClient = supabaseClient;

// ============================================
// HUIDIGE GEBRUIKER
// ============================================

let currentUser = null;
window.currentUser = currentUser;

// ============================================
// LOGIN FUNCTIE
// ============================================

async function loginUser(email, password) {
    console.log('🔑 Inlogpoging voor:', email);
    
    if (!window.supabaseClient) {
        return { success: false, error: 'Systeemfout: probeer de pagina te herladen.' };
    }
    
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

async function logoutUser() {
    console.log('🚪 Uitloggen...');
    
    if (!window.supabaseClient) {
        return { success: false, error: 'Systeemfout' };
    }
    
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
        
        // ============================================
        // FIX: UPDATE NAVIGATIE NA UITLOGGEN
        // ============================================
        if (typeof window.renderNavigation === 'function') {
            console.log('🔄 Navigatie herladen na uitloggen...');
            window.renderNavigation();
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij uitloggen:', error);
        return { success: false, error: 'Er is een fout opgetreden.' };
    }
}

// ============================================
// SESSIE CONTROLE
// ============================================

async function checkSession() {
    console.log('🔍 Controleren van sessie...');
    
    try {
        if (!window.supabaseClient) {
            console.error('❌ supabaseClient niet geïnitialiseerd!');
            return null;
        }
        
        const storedUser = sessionStorage.getItem('panta_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log('📦 Gebruiker gevonden in session storage:', user.email);
            currentUser = user;
            window.currentUser = user;
            return user;
        }
        
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

function showLoginPage() {
    console.log('📄 Laden van login pagina...');
    
    const wrapper = document.getElementById('content-wrapper');
    if (!wrapper) return;
    
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
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

// ============================================
// LOGIN FORMULIER AFHANDELING
// ============================================

async function handleLoginSubmit(event) {
    event.preventDefault();
    console.log('📝 Login formulier ingediend');
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
    
    if (!email || !password) {
        showLoginError('Vul zowel je e-mailadres als wachtwoord in.');
        return;
    }
    
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    
    try {
        const result = await loginUser(email, password);
        
        if (result.success) {
            console.log('✅ Inloggen gelukt!');
            
            // ============================================
            // FIX: HERLAAD DE NAVIGATIE NA INLOGGEN
            // ============================================
            if (typeof window.renderNavigation === 'function') {
                console.log('🔄 Navigatie herladen na inloggen...');
                window.renderNavigation();
            }
            
            if (typeof window.loadDashboard === 'function') {
                window.loadDashboard();
            } else {
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
// EXPORTEER FUNCTIES
// ============================================

window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.checkSession = checkSession;
window.showLoginPage = showLoginPage;
window.showLoginError = showLoginError;

console.log('✅ Authenticatie module klaar voor gebruik');