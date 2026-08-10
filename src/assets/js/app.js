/**
 * ============================================
 * HOOFDAPPLICATIE - MET FIETSEN FUNCTIONALITEIT
 * ============================================
 */

console.log('🚀 Panta Club Fietsregistratie start...');

// ============================================
// PAGINA'S (dynamische content)
// ============================================

const PAGES = {
    dashboard: `
        <div style="padding: 20px 0;">
            <h1>👋 Welkom bij Panta Club!</h1>
            <p style="color: #666; margin-bottom: 30px;">
                Beheer hier jouw fietsen, klanten en onderhoud.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">🚲</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-fietsen">0</h3>
                    <p style="color: #666; margin: 0;">Totaal fietsen</p>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">👤</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-klanten">0</h3>
                    <p style="color: #666; margin: 0;">Totaal klanten</p>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">🔧</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-onderhoud">0</h3>
                    <p style="color: #666; margin: 0;">Openstaand onderhoud</p>
                </div>
            </div>
            
            <div class="card">
                <h3>📌 Snelle acties</h3>
                <div class="btn-group" style="margin-top: 15px;">
                    <button class="btn btn-primary" onclick="window.navigateTo('fietsen')">
                        ➕ Fiets toevoegen
                    </button>
                    <button class="btn btn-accent" onclick="window.showMessage('Klanten pagina komt binnenkort!')">
                        👤 Klant toevoegen
                    </button>
                </div>
            </div>
        </div>
    `,
    
    fietsen: `
        <div style="padding: 20px 0;">
            <h1>🚲 Fietsen</h1>
            <p style="color: #666; margin-bottom: 20px;">Beheer hier alle fietsen. Voeg nieuwe fietsen toe met serienummer en QR-code.</p>
            
            <!-- Knop om nieuwe fiets toe te voegen -->
            <button class="btn btn-primary" onclick="window.showAddFietsForm()" style="margin-bottom: 20px;">
                ➕ Nieuwe fiets toevoegen
            </button>
            
            <!-- Formulier voor nieuwe fiets (standaard verborgen) -->
            <div id="addFietsForm" style="display: none; margin-bottom: 30px;">
                <div class="card">
                    <h3>Nieuwe fiets registreren</h3>
                    <form id="fietsForm">
                        <div class="form-group">
                            <label for="fietsSerienummer">Serienummer *</label>
                            <input type="text" id="fietsSerienummer" placeholder="Bijv. ABC123456" required>
                        </div>
                        <div class="form-group">
                            <label for="fietsMerk">Merk</label>
                            <input type="text" id="fietsMerk" placeholder="Bijv. Panta">
                        </div>
                        <div class="form-group">
                            <label for="fietsModel">Model</label>
                            <input type="text" id="fietsModel" placeholder="Bijv. Club 20">
                        </div>
                        <div class="form-group">
                            <label for="fietsKleur">Kleur</label>
                            <input type="text" id="fietsKleur" placeholder="Bijv. Rood">
                        </div>
                        <div class="form-group">
                            <label for="fietsStatus">Status</label>
                            <select id="fietsStatus">
                                <option value="beschikbaar">Beschikbaar</option>
                                <option value="verhuurd">Verhuurd</option>
                                <option value="in-onderhoud">In onderhoud</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button type="submit" class="btn btn-primary">💾 Opslaan</button>
                            <button type="button" class="btn btn-outline" onclick="window.hideAddFietsForm()">Annuleren</button>
                        </div>
                    </form>
                    <div id="fietsFormMessage" style="margin-top: 10px;"></div>
                </div>
            </div>
            
            <!-- Overzicht van fietsen -->
            <div id="fietsenLijst">
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🚲</div>
                    <h3>Laden van fietsen...</h3>
                </div>
            </div>
        </div>
    `,
    
    klanten: `
        <div style="padding: 20px 0;">
            <h1>👤 Klanten</h1>
            <p style="color: #666; margin-bottom: 20px;">Beheer hier alle klanten. (Komt binnenkort)</p>
            <div class="card" style="text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">👤</div>
                <h3>Klantenbeheer komt binnenkort</h3>
                <p style="color: #999;">Handmatig toevoegen en Excel import.</p>
            </div>
        </div>
    `,
    
    onderhoud: `
        <div style="padding: 20px 0;">
            <h1>🔧 Onderhoudsboekje</h1>
            <p style="color: #666; margin-bottom: 20px;">Registreer onderhoudsbeurten per fiets. (Komt binnenkort)</p>
            <div class="card" style="text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔧</div>
                <h3>Onderhoudsboekje komt binnenkort</h3>
                <p style="color: #999;">Registreer reparaties en onderhoud.</p>
            </div>
        </div>
    `
};

// ============================================
// NAVIGATIE FUNCTIE
// ============================================

function navigateTo(page) {
    console.log('📄 Navigeren naar:', page);
    const content = PAGES[page];
    if (!content) {
        showMessage('Pagina "' + page + '" is nog niet beschikbaar.');
        return;
    }
    
    const wrapper = document.getElementById('content-wrapper');
    if (wrapper) {
        wrapper.innerHTML = content;
    }
    
    // Update navigatie active state
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    // Sluit mobiel menu
    const navbarLinks = document.getElementById('navbarLinks');
    const menuToggle = document.getElementById('menuToggle');
    if (navbarLinks) {
        navbarLinks.classList.remove('open');
    }
    if (menuToggle) {
        menuToggle.textContent = '☰';
    }
    
    // Laad data als we naar fietsen gaan
    if (page === 'fietsen') {
        setTimeout(loadFietsen, 100);
    }
    if (page === 'dashboard') {
        setTimeout(loadStats, 100);
    }
}

// ============================================
// FIETSEN FUNCTIES
// ============================================

/**
 * Toont het formulier voor het toevoegen van een fiets
 */
function showAddFietsForm() {
    const form = document.getElementById('addFietsForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Verbergt het formulier voor het toevoegen van een fiets
 */
function hideAddFietsForm() {
    const form = document.getElementById('addFietsForm');
    if (form) {
        form.style.display = 'none';
    }
    const message = document.getElementById('fietsFormMessage');
    if (message) {
        message.innerHTML = '';
    }
}

/**
 * Laadt alle fietsen uit de database
 */
async function loadFietsen() {
    console.log('📥 Laden van fietsen...');
    
    const lijst = document.getElementById('fietsenLijst');
    if (!lijst) return;
    
    try {
        // Controleer of supabaseClient bestaat
        if (!window.supabaseClient) {
            lijst.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px; border: 2px solid #dc3545;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">❌</div>
                    <h3>Geen verbinding</h3>
                    <p style="color: #999;">Supabase client is niet geïnitialiseerd.</p>
                </div>
            `;
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('fietsen')
            .select('*')
            .order('aangemaakt_op', { ascending: false });
        
        if (error) {
            console.error('❌ Fout bij laden fietsen:', error);
            lijst.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px; border: 2px solid #dc3545;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">❌</div>
                    <h3>Fout bij laden</h3>
                    <p style="color: #999;">${error.message}</p>
                </div>
            `;
            return;
        }
        
        if (!data || data.length === 0) {
            lijst.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🚲</div>
                    <h3>Geen fietsen gevonden</h3>
                    <p style="color: #999;">Voeg je eerste fiets toe met de knop hierboven.</p>
                </div>
            `;
            return;
        }
        
        // Toon de fietsen in een tabel
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Serienummer</th>
                            <th>Merk</th>
                            <th>Model</th>
                            <th>Kleur</th>
                            <th>Status</th>
                            <th>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(fiets => {
            const statusClass = fiets.status === 'beschikbaar' ? 'badge-available' :
                               fiets.status === 'verhuurd' ? 'badge-rented' :
                               'badge-maintenance';
            
            html += `
                <tr>
                    <td><strong>${fiets.serienummer}</strong></td>
                    <td>${fiets.merk || '-'}</td>
                    <td>${fiets.model || '-'}</td>
                    <td>${fiets.kleur || '-'}</td>
                    <td><span class="badge ${statusClass}">${fiets.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="window.showFietsDetail('${fiets.id}')">
                            📋 Detail
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            <p style="color: #999; font-size: 0.85rem; margin-top: 10px;">
                Totaal: ${data.length} fietsen
            </p>
        `;
        
        lijst.innerHTML = html;
        
    } catch (error) {
        console.error('❌ Onverwachte fout bij laden fietsen:', error);
        lijst.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px; border: 2px solid #dc3545;">
                <div style="font-size: 3rem; margin-bottom: 10px;">❌</div>
                <h3>Fout bij laden</h3>
                <p style="color: #999;">Er is een fout opgetreden.</p>
            </div>
        `;
    }
}

// ============================================
// FIETS TOEVOEGEN FORMULIER
// ============================================

// Event listener voor het fiets formulier
document.addEventListener('submit', async function(event) {
    if (event.target.id === 'fietsForm') {
        event.preventDefault();
        await handleFietsSubmit(event);
    }
});

/**
 * Handelt het toevoegen van een fiets af
 */
async function handleFietsSubmit(event) {
    console.log('📝 Fiets formulier ingediend');
    
    const serienummer = document.getElementById('fietsSerienummer').value.trim();
    const merk = document.getElementById('fietsMerk').value.trim();
    const model = document.getElementById('fietsModel').value.trim();
    const kleur = document.getElementById('fietsKleur').value.trim();
    const status = document.getElementById('fietsStatus').value;
    
    const messageDiv = document.getElementById('fietsFormMessage');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Validatie
    if (!serienummer) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Serienummer is verplicht!</p>';
        return;
    }
    
    // Controleer of supabaseClient bestaat
    if (!window.supabaseClient) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Geen verbinding met de database.</p>';
        return;
    }
    
    // Toon loading state
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    messageDiv.innerHTML = '<p style="color: #666;">⏳ Bezig met opslaan...</p>';
    
    try {
        // Genereer QR-code URL
        const qrCode = `https://therealmookey.github.io/PantaClubreg/fiets/${serienummer}`;
        
        // Sla op in Supabase
        const { data, error } = await window.supabaseClient
            .from('fietsen')
            .insert([
                {
                    serienummer: serienummer,
                    merk: merk || null,
                    model: model || null,
                    kleur: kleur || null,
                    status: status,
                    qr_code: qrCode
                }
            ])
            .select();
        
        if (error) {
            console.error('❌ Fout bij opslaan:', error);
            messageDiv.innerHTML = `<p style="color: #dc3545;">❌ Fout: ${error.message}</p>`;
            button.textContent = originalText;
            button.disabled = false;
            return;
        }
        
        console.log('✅ Fiets opgeslagen:', data);
        messageDiv.innerHTML = `<p style="color: #28a745;">✅ Fiets ${serienummer} succesvol toegevoegd!</p>`;
        
        // Reset formulier
        document.getElementById('fietsForm').reset();
        
        // Verberg formulier na 2 seconden en herlaad lijst
        setTimeout(() => {
            hideAddFietsForm();
            loadFietsen();
            loadStats();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Onverwachte fout:', error);
        messageDiv.innerHTML = `<p style="color: #dc3545;">❌ Er is een fout opgetreden.</p>`;
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// STATISTIEKEN
// ============================================

async function loadStats() {
    try {
        if (!window.supabaseClient) return;
        
        const { count: fietsenCount, error: fietsError } = await window.supabaseClient
            .from('fietsen')
            .select('*', { count: 'exact', head: true });
        
        if (!fietsError) {
            const el = document.getElementById('stat-fietsen');
            if (el) el.textContent = fietsenCount || 0;
        }
    } catch (error) {
        console.error('❌ Fout bij laden statistieken:', error);
    }
}

// ============================================
// HULPFUNCTIES
// ============================================

function showMessage(message) {
    alert('📢 ' + message);
}

function showFietsDetail(id) {
    showMessage('Detail van fiets ' + id + ' komt binnenkort!');
}

// ============================================
// DASHBOARD LADEN (aangeroepen door auth.js)
// ============================================

function loadDashboard() {
    console.log('📊 Dashboard laden...');
    navigateTo('dashboard');
}

// ============================================
// STARTUP - SESSIE CONTROLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM geladen');
    console.log('🔍 Controleren van sessie...');
    
    // Check of er een actieve sessie is via auth.js
    if (typeof window.checkSession === 'function') {
        window.checkSession().then(user => {
            if (user) {
                console.log('✅ Ingelogd als:', user.email);
                loadDashboard();
            } else {
                console.log('👤 Niet ingelogd, toon login pagina');
                if (typeof window.showLoginPage === 'function') {
                    window.showLoginPage();
                }
            }
        });
    } else {
        console.error('❌ Auth module niet geladen!');
        if (typeof window.showLoginPage === 'function') {
            window.showLoginPage();
        }
    }
});

// ============================================
// EXPORTEER FUNCTIES
// ============================================

window.navigateTo = navigateTo;
window.showMessage = showMessage;
window.showAddFietsForm = showAddFietsForm;
window.hideAddFietsForm = hideAddFietsForm;
window.loadFietsen = loadFietsen;
window.loadStats = loadStats;
window.showFietsDetail = showFietsDetail;
window.loadDashboard = loadDashboard;

console.log('✅ Applicatie klaar voor gebruik');