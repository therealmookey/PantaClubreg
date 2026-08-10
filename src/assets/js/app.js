/**
 * ============================================
 * HOOFDAPPLICATIE - MET MODELLEN EN FIETSEN
 * ============================================
 */

console.log('🚀 Panta Club Fietsregistratie start...');

// ============================================
// STARTUP - RENDER NAVIGATIE EN FOOTER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM geladen');
    
    if (typeof window.renderNavigation === 'function') {
        window.renderNavigation();
    }
    if (typeof window.renderFooter === 'function') {
        window.renderFooter();
    }
    
    console.log('🔍 Controleren van sessie...');
    
    if (typeof window.checkSession === 'function') {
        window.checkSession().then(user => {
            if (user) {
                console.log('✅ Ingelogd als:', user.email);
                window.currentUser = user;
                if (typeof window.renderNavigation === 'function') {
                    window.renderNavigation();
                }
                loadDashboard();
            } else {
                console.log('👤 Niet ingelogd, toon login pagina');
                window.currentUser = null;
                if (typeof window.renderNavigation === 'function') {
                    window.renderNavigation();
                }
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
// PAGINA'S
// ============================================

const PAGES = {
    dashboard: `
        <div style="padding: 20px 0;">
            <h1>👋 Welkom bij Panta Club!</h1>
            <p style="color: #666; margin-bottom: 30px;">
                Beheer hier jouw fietsmodellen, individuele fietsen, klanten en onderhoud.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">📦</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-modellen">0</h3>
                    <p style="color: #666; margin: 0;">Fietsmodellen</p>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">🚲</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-fietsen">0</h3>
                    <p style="color: #666; margin: 0;">Individuele fietsen</p>
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
                    <button class="btn btn-primary" onclick="window.navigateTo('modellen')">
                        📦 Model toevoegen
                    </button>
                    <button class="btn btn-accent" onclick="window.navigateTo('fietsen')">
                        🚲 Fiets toevoegen
                    </button>
                    <button class="btn btn-outline" onclick="window.showMessage('Klanten pagina komt binnenkort!')">
                        👤 Klant toevoegen
                    </button>
                </div>
            </div>
        </div>
    `,
    
    modellen: `
        <div style="padding: 20px 0;">
            <h1>📦 Fietsmodellen</h1>
            <p style="color: #666; margin-bottom: 20px;">
                Beheer hier de standaard fietsmodellen (merk, model, kleur). 
                Dit zijn de <strong>"dozen"</strong> waar later individuele fietsen met serienummers aan worden gekoppeld.
            </p>
            
            <button class="btn btn-primary" onclick="window.showAddModelForm()" style="margin-bottom: 20px;">
                ➕ Nieuw model toevoegen
            </button>
            
            <div id="addModelForm" style="display: none; margin-bottom: 30px;">
                <div class="card">
                    <h3>Nieuw fietsmodel toevoegen</h3>
                    <form id="modelForm">
                        <div class="form-group">
                            <label for="modelMerk">Merk *</label>
                            <input type="text" id="modelMerk" placeholder="Bijv. Panta" required>
                        </div>
                        <div class="form-group">
                            <label for="modelNaam">Model *</label>
                            <input type="text" id="modelNaam" placeholder="Bijv. Club 20" required>
                        </div>
                        <div class="form-group">
                            <label for="modelKleur">Kleur *</label>
                            <input type="text" id="modelKleur" placeholder="Bijv. Rood" required>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button type="submit" class="btn btn-primary">💾 Opslaan</button>
                            <button type="button" class="btn btn-outline" onclick="window.hideAddModelForm()">Annuleren</button>
                        </div>
                    </form>
                    <div id="modelFormMessage" style="margin-top: 10px;"></div>
                </div>
            </div>
            
            <div id="modellenLijst">
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📦</div>
                    <h3>Laden van modellen...</h3>
                </div>
            </div>
        </div>
    `,
    
    fietsen: `
        <div style="padding: 20px 0;">
            <h1>🚲 Individuele fietsen</h1>
            <p style="color: #666; margin-bottom: 20px;">
                Beheer hier de individuele fietsen met serienummer. 
                Elke fiets is gekoppeld aan een model uit de <strong>"Fietsmodellen"</strong> lijst.
                Dit zijn de <strong>"schoenen"</strong> die in de dozen passen.
            </p>
            
            <button class="btn btn-accent" onclick="window.showAddFietsForm()" style="margin-bottom: 20px;">
                ➕ Nieuwe fiets toevoegen
            </button>
            
            <div id="addFietsForm" style="display: none; margin-bottom: 30px;">
                <div class="card">
                    <h3>Nieuwe fiets registreren</h3>
                    <form id="fietsForm">
                        <div class="form-group">
                            <label for="fietsSerienummer">Serienummer *</label>
                            <input type="text" id="fietsSerienummer" placeholder="Bijv. PNT-2024-001" required>
                        </div>
                        <div class="form-group">
                            <label for="fietsModelSelect">Model (merk + model + kleur) *</label>
                            <select id="fietsModelSelect" required>
                                <option value="">-- Selecteer een model --</option>
                            </select>
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
                            <button type="submit" class="btn btn-accent">💾 Opslaan</button>
                            <button type="button" class="btn btn-outline" onclick="window.hideAddFietsForm()">Annuleren</button>
                        </div>
                    </form>
                    <div id="fietsFormMessage" style="margin-top: 10px;"></div>
                </div>
            </div>
            
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
// NAVIGATIE
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
    
    if (typeof window.setActiveNavItem === 'function') {
        window.setActiveNavItem(page);
    }
    
    if (page === 'modellen') {
        setTimeout(loadModellen, 100);
    }
    if (page === 'fietsen') {
        setTimeout(loadFietsen, 100);
    }
    if (page === 'dashboard') {
        setTimeout(loadStats, 100);
    }
}

// ============================================
// LOGOUT
// ============================================

async function handleLogout() {
    console.log('🚪 Uitloggen...');
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
        if (typeof window.logoutUser === 'function') {
            const result = await window.logoutUser();
            if (result.success) {
                window.currentUser = null;
                if (typeof window.renderNavigation === 'function') {
                    window.renderNavigation();
                }
                if (typeof window.showLoginPage === 'function') {
                    window.showLoginPage();
                }
                showMessage('👋 Je bent uitgelogd.');
            }
        }
    }
}

window.handleLogout = handleLogout;

// ============================================
// MODEL FUNCTIES
// ============================================

function showAddModelForm() {
    const form = document.getElementById('addModelForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideAddModelForm() {
    const form = document.getElementById('addModelForm');
    if (form) {
        form.style.display = 'none';
    }
    const message = document.getElementById('modelFormMessage');
    if (message) {
        message.innerHTML = '';
    }
}

async function loadModellen() {
    console.log('📥 Laden van modellen...');
    const lijst = document.getElementById('modellenLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>`;
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('fiets_modellen')
            .select('*')
            .order('merk', { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            lijst.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📦</div>
                    <h3>Geen modellen gevonden</h3>
                    <p style="color: #999;">Voeg je eerste model toe met de knop hierboven.</p>
                </div>
            `;
            return;
        }
        
        let html = `<div class="table-responsive"><table><thead><tr><th>Merk</th><th>Model</th><th>Kleur</th><th>Acties</th></tr></thead><tbody>`;
        
        data.forEach(model => {
            html += `
                <tr>
                    <td><strong>${model.merk}</strong></td>
                    <td>${model.model}</td>
                    <td><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${model.kleur.toLowerCase()};border:1px solid #ddd;"></span> ${model.kleur}</td>
                    <td><button class="btn btn-sm btn-outline" onclick="window.showMessage('Detail van ${model.merk} ${model.model} komt binnenkort!')">📋 Detail</button></td>
                </tr>
            `;
        });
        
        html += `</tbody></table></div><p style="color:#999;font-size:0.85rem;margin-top:10px;">Totaal: ${data.length} modellen</p>`;
        lijst.innerHTML = html;
    } catch (error) {
        console.error('❌ Fout:', error);
        lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>`;
    }
}

document.addEventListener('submit', async function(event) {
    if (event.target.id === 'modelForm') {
        event.preventDefault();
        await handleModelSubmit(event);
    }
});

async function handleModelSubmit(event) {
    const merk = document.getElementById('modelMerk').value.trim();
    const model = document.getElementById('modelNaam').value.trim();
    const kleur = document.getElementById('modelKleur').value.trim();
    const messageDiv = document.getElementById('modelFormMessage');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    if (!merk || !model || !kleur) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Alle velden zijn verplicht!</p>';
        return;
    }
    
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    messageDiv.innerHTML = '<p style="color: #666;">⏳ Bezig met opslaan...</p>';
    
    try {
        const { error } = await window.supabaseClient
            .from('fiets_modellen')
            .insert([{ merk, model, kleur }]);
        
        if (error) throw error;
        
        messageDiv.innerHTML = `<p style="color: #28a745;">✅ Model ${merk} - ${model} (${kleur}) toegevoegd!</p>`;
        document.getElementById('modelForm').reset();
        
        setTimeout(() => {
            hideAddModelForm();
            loadModellen();
            loadStats();
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = `<p style="color: #dc3545;">❌ Fout: ${error.message}</p>`;
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// FIETS FUNCTIES
// ============================================

function showAddFietsForm() {
    const form = document.getElementById('addFietsForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        loadModelSelectOptions();
    }
}

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

async function loadModelSelectOptions() {
    const select = document.getElementById('fietsModelSelect');
    if (!select) return;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('fiets_modellen')
            .select('*')
            .order('merk', { ascending: true });
        
        if (error) throw error;
        
        select.innerHTML = '<option value="">-- Selecteer een model --</option>';
        data.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.merk} - ${model.model} (${model.kleur})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Fout bij laden modellen:', error);
    }
}

async function loadFietsen() {
    console.log('📥 Laden van fietsen...');
    const lijst = document.getElementById('fietsenLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>`;
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('individuele_fietsen')
            .select(`*, fiets_modellen (merk, model, kleur)`)
            .order('aangemaakt_op', { ascending: false });
        
        if (error) throw error;
        
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
        
        let html = `<div class="table-responsive"><table><thead><tr><th>Serienummer</th><th>Model</th><th>Kleur</th><th>Status</th><th>QR</th></tr></thead><tbody>`;
        
        data.forEach(fiets => {
            const statusClass = fiets.status === 'beschikbaar' ? 'badge-available' :
                               fiets.status === 'verhuurd' ? 'badge-rented' : 'badge-maintenance';
            const modelInfo = fiets.fiets_modellen || { merk: '-', model: '-', kleur: '-' };
            
            html += `
                <tr>
                    <td><strong>${fiets.serienummer}</strong></td>
                    <td>${modelInfo.merk} ${modelInfo.model}</td>
                    <td><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${modelInfo.kleur.toLowerCase()};border:1px solid #ddd;"></span> ${modelInfo.kleur}</td>
                    <td><span class="badge ${statusClass}">${fiets.status}</span></td>
                    <td>${fiets.qr_code ? '✅' : '❌'}</td>
                </tr>
            `;
        });
        
        html += `</tbody></table></div><p style="color:#999;font-size:0.85rem;margin-top:10px;">Totaal: ${data.length} fietsen</p>`;
        lijst.innerHTML = html;
    } catch (error) {
        console.error('❌ Fout:', error);
        lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>`;
    }
}

document.addEventListener('submit', async function(event) {
    if (event.target.id === 'fietsForm') {
        event.preventDefault();
        await handleFietsSubmit(event);
    }
});

async function handleFietsSubmit(event) {
    const serienummer = document.getElementById('fietsSerienummer').value.trim();
    const modelId = document.getElementById('fietsModelSelect').value;
    const status = document.getElementById('fietsStatus').value;
    const messageDiv = document.getElementById('fietsFormMessage');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    if (!serienummer || !modelId) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Serienummer en model zijn verplicht!</p>';
        return;
    }
    
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    messageDiv.innerHTML = '<p style="color: #666;">⏳ Bezig met opslaan...</p>';
    
    try {
        const qrCode = `https://therealmookey.github.io/PantaClubreg/fiets/${serienummer}`;
        
        const { error } = await window.supabaseClient
            .from('individuele_fietsen')
            .insert([{
                serienummer: serienummer,
                model_id: modelId,
                status: status,
                qr_code: qrCode
            }]);
        
        if (error) throw error;
        
        messageDiv.innerHTML = `<p style="color: #28a745;">✅ Fiets ${serienummer} succesvol toegevoegd!</p>`;
        document.getElementById('fietsForm').reset();
        
        setTimeout(() => {
            hideAddFietsForm();
            loadFietsen();
            loadStats();
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = `<p style="color: #dc3545;">❌ Fout: ${error.message}</p>`;
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
        
        const { count: modellenCount } = await window.supabaseClient
            .from('fiets_modellen')
            .select('*', { count: 'exact', head: true });
        
        const { count: fietsenCount } = await window.supabaseClient
            .from('individuele_fietsen')
            .select('*', { count: 'exact', head: true });
        
        const el1 = document.getElementById('stat-modellen');
        const el2 = document.getElementById('stat-fietsen');
        if (el1) el1.textContent = modellenCount || 0;
        if (el2) el2.textContent = fietsenCount || 0;
    } catch (error) {
        console.error('❌ Fout bij laden statistieken:', error);
    }
}

// ============================================
// DASHBOARD
// ============================================

function loadDashboard() {
    console.log('📊 Dashboard laden...');
    navigateTo('dashboard');
}

// ============================================
// HULPFUNCTIES
// ============================================

function showMessage(message) {
    alert('📢 ' + message);
}

// ============================================
// EXPORTEER FUNCTIES
// ============================================

window.navigateTo = navigateTo;
window.showMessage = showMessage;
window.showAddModelForm = showAddModelForm;
window.hideAddModelForm = hideAddModelForm;
window.loadModellen = loadModellen;
window.showAddFietsForm = showAddFietsForm;
window.hideAddFietsForm = hideAddFietsForm;
window.loadFietsen = loadFietsen;
window.loadStats = loadStats;
window.loadDashboard = loadDashboard;

console.log('✅ Applicatie klaar voor gebruik');