/**
 * ============================================
 * HOOFDAPPLICATIE
 * ============================================
 * Start de applicatie, controleert de sessie
 * en laadt de juiste pagina (login of dashboard).
 * ============================================
 */

console.log('🚀 Panta Club Fietsregistratie start...');

// ============================================
// STARTUP
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM geladen');
    console.log('🔍 Controleren van sessie...');
    
    // Check of er een actieve sessie is
    checkSessionAndLoad();
});

/**
 * Controleert de sessie en laadt de juiste pagina
 */
async function checkSessionAndLoad() {
    try {
        // Controleer of de auth module bestaat
        if (typeof window.checkSession !== 'function') {
            console.error('❌ Auth module niet geladen!');
            showError('Authenticatie module niet gevonden. Herlaad de pagina.');
            return;
        }
        
        // Controleer sessie
        const user = await window.checkSession();
        
        if (user) {
            // Gebruiker is ingelogd → toon dashboard
            console.log('✅ Ingelogd als:', user.email);
            if (typeof window.loadDashboard === 'function') {
                window.loadDashboard();
            } else {
                console.error('❌ loadDashboard functie niet gevonden');
                showError('Dashboard kon niet worden geladen.');
            }
        } else {
            // Niet ingelogd → toon login pagina
            console.log('👤 Niet ingelogd, toon login pagina');
            if (typeof window.showLoginPage === 'function') {
                window.showLoginPage();
            } else {
                console.error('❌ showLoginPage functie niet gevonden');
                showError('Login pagina kon niet worden geladen.');
            }
        }
    } catch (error) {
        console.error('❌ Fout bij opstarten:', error);
        showError('Er is een fout opgetreden bij het opstarten.');
    }
}

/**
 * Toont een foutmelding op de pagina
 * @param {string} message - De foutmelding
 */
function showError(message) {
    const wrapper = document.getElementById('content-wrapper');
    if (wrapper) {
        wrapper.innerHTML = `
            <div style="
                text-align: center;
                padding: 60px 20px;
                background: #f8d7da;
                border-radius: 12px;
                margin: 40px 0;
            ">
                <div style="font-size: 3rem; margin-bottom: 20px;">❌</div>
                <h2 style="color: #721c24;">Er is een fout opgetreden</h2>
                <p style="color: #721c24;">${message}</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 20px;">
                    🔄 Herlaad pagina
                </button>
            </div>
        `;
    } else {
        alert('❌ ' + message);
    }
}

// ============================================
// FALLBACK: Toon login als dashboard niet werkt
// ============================================

// Als de pagina na 5 seconden nog steeds het dashboard toont,
// forceer dan de login pagina
setTimeout(function() {
    const wrapper = document.getElementById('content-wrapper');
    if (wrapper) {
        const content = wrapper.innerHTML;
        // Als er geen login formulier of dashboard is, toon login
        if (!content.includes('loginForm') && !content.includes('Welkom')) {
            console.log('⏰ Timeout: Forceer login pagina');
            if (typeof window.showLoginPage === 'function') {
                window.showLoginPage();
            }
        }
    }
}, 5000);

// ============================================
// TOON MELDING (tijdelijk)
// ============================================

function showMessage(message) {
    alert('📢 ' + message);
}

// Maak functies globaal beschikbaar
window.showMessage = showMessage;
window.showError = showError;

console.log('✅ Applicatie klaar voor gebruik');