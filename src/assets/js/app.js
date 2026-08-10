/**
 * ============================================
 * HOOFDAPPLICATIE - MET MODELLEN EN FIETSEN
 * ============================================
 */

console.log('🚀 Panta Club Fietsregistratie start...');

// ============================================
// STARTUP
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
        
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Merk</th>
                            <th>Model</th>
                            <th>Kleur</th>
                            <th style="text-align:center;">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(model => {
            const kleurStyle = `display:inline-block;width:20px;height:20px;border-radius:50%;background:${model.kleur.toLowerCase()};border:1px solid #ddd;vertical-align:middle;margin-right:5px;`;
            
            html += `
                <tr id="model-${model.id}">
                    <td><strong>${model.merk}</strong></td>
                    <td>${model.model}</td>
                    <td><span style="${kleurStyle}"></span> ${model.kleur}</td>
                    <td style="text-align:center;">
                        <button class="btn btn-sm btn-primary" onclick="window.editModel('${model.id}')" style="margin-right:5px;">
                            ✏️ Bewerken
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.deleteModel('${model.id}')">
                            🗑️ Verwijderen
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
                Totaal: ${data.length} modellen
            </p>
        `;
        
        lijst.innerHTML = html;
    } catch (error) {
        console.error('❌ Fout:', error);
        lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>`;
    }
}

// ============================================
// MODEL BEWERKEN
// ============================================

function editModel(modelId) {
    console.log('✏️ Bewerken van model:', modelId);
    
    const row = document.getElementById(`model-${modelId}`);
    if (!row) {
        showMessage('Model niet gevonden!');
        return;
    }
    
    const cells = row.querySelectorAll('td');
    const merk = cells[0].textContent.trim();
    const model = cells[1].textContent.trim();
    const kleur = cells[2].textContent.trim();
    
    row.innerHTML = `
        <td>
            <input type="text" id="edit-merk-${modelId}" value="${merk}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
        </td>
        <td>
            <input type="text" id="edit-model-${modelId}" value="${model}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
        </td>
        <td>
            <input type="text" id="edit-kleur-${modelId}" value="${kleur}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
        </td>
        <td style="text-align:center;">
            <button class="btn btn-sm btn-success" onclick="window.saveModel('${modelId}')" style="margin-right:5px;">
                💾 Opslaan
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.cancelEditModel('${modelId}')">
                ❌ Annuleren
            </button>
        </td>
    `;
}

// ============================================
// MODEL OPSLAAN
// ============================================

async function saveModel(modelId) {
    console.log('💾 Opslaan van model:', modelId);
    
    const merkInput = document.getElementById(`edit-merk-${modelId}`);
    const modelInput = document.getElementById(`edit-model-${modelId}`);
    const kleurInput = document.getElementById(`edit-kleur-${modelId}`);
    
    if (!merkInput || !modelInput || !kleurInput) {
        showMessage('Fout: kan velden niet vinden.');
        return;
    }
    
    const merk = merkInput.value.trim();
    const model = modelInput.value.trim();
    const kleur = kleurInput.value.trim();
    
    if (!merk || !model || !kleur) {
        showMessage('❌ Alle velden zijn verplicht!');
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('fiets_modellen')
            .update({ merk, model, kleur })
            .eq('id', modelId);
        
        if (error) throw error;
        
        showMessage('✅ Model succesvol bijgewerkt!');
        loadModellen();
        
    } catch (error) {
        console.error('❌ Fout bij opslaan:', error);
        showMessage('❌ Fout: ' + error.message);
    }
}

// ============================================
// MODEL BEWERKING ANNULEREN
// ============================================

function cancelEditModel(modelId) {
    console.log('❌ Bewerking geannuleerd voor:', modelId);
    loadModellen();
}

// ============================================
// MODEL VERWIJDEREN
// ============================================

async function deleteModel(modelId) {
    console.log('🗑️ Verwijderen van model:', modelId);
    
    if (!confirm('Weet je zeker dat je dit model wilt verwijderen?\n\nLet op: Als er fietsen aan dit model zijn gekoppeld, kan dit niet!')) {
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('fiets_modellen')
            .delete()
            .eq('id', modelId);
        
        if (error) throw error;
        
        showMessage('✅ Model succesvol verwijderd!');
        loadModellen();
        loadStats();
        
    } catch (error) {
        console.error('❌ Fout bij verwijderen:', error);
        
        if (error.message && error.message.includes('foreign key')) {
            showMessage('❌ Dit model kan niet worden verwijderd omdat er nog fietsen aan zijn gekoppeld.');
        } else {
            showMessage('❌ Fout: ' + error.message);
        }
    }
}

// ============================================
// MODEL SUBMIT
// ============================================

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
        
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Serienummer</th>
                            <th>Model</th>
                            <th>Kleur</th>
                            <th>Status</th>
                            <th style="text-align:center;">QR-code</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(fiets => {
            const statusClass = fiets.status === 'beschikbaar' ? 'badge-available' :
                               fiets.status === 'verhuurd' ? 'badge-rented' : 'badge-maintenance';
            const modelInfo = fiets.fiets_modellen || { merk: '-', model: '-', kleur: '-' };
            
            html += `
                <tr>
                    <td><strong>${fiets.serienummer}</strong></td>
                    <td>${modelInfo.merk} ${modelInfo.model}</td>
                    <td><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${modelInfo.kleur.toLowerCase()};border:1px solid #ddd;vertical-align:middle;margin-right:5px;"></span> ${modelInfo.kleur}</td>
                    <td><span class="badge ${statusClass}">${fiets.status}</span></td>
                    <td style="text-align:center;">
                        <button onclick="window.showQRCode('${fiets.serienummer}')" 
                                style="background:none;border:none;cursor:pointer;font-size:1.2rem;"
                                title="Klik om QR-code te bekijken">
                            📱
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
        console.error('❌ Fout:', error);
        lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>`;
    }
}

// ============================================
// FIETS TOEVOEGEN
// ============================================

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
        const { error } = await window.supabaseClient
            .from('individuele_fietsen')
            .insert([{
                serienummer: serienummer,
                model_id: modelId,
                status: status
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
// QR-CODE FUNCTIES
// ============================================

/**
 * Toont een QR-code in een modal/popup
 * @param {string} serienummer - Het serienummer van de fiets
 */
function showQRCode(serienummer) {
    console.log('📱 Toon QR-code voor:', serienummer);
    
    // Maak een modal aan als die nog niet bestaat
    let modal = document.getElementById('qrModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'qrModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        `;
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                position: relative;
            ">
                <button onclick="window.closeQRModal()" style="
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                ">✕</button>
                <h3 style="margin-bottom: 10px;">🚲 QR-code</h3>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">
                    Scan deze QR-code om de fietsinformatie te bekijken
                </p>
                <div id="qrCodeContainer" style="display: flex; justify-content: center; margin: 20px 0;"></div>
                <p style="color: #999; font-size: 0.85rem; word-break: break-all;">
                    <strong>Serienummer:</strong> <span id="qrSerienummer"></span>
                </p>
                <button onclick="window.downloadQRCode()" class="btn btn-primary" style="margin-top: 15px;">
                    ⬇️ Download QR-code
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Sluit modal bij klikken buiten de modal
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                window.closeQRModal();
            }
        });
    }
    
    // Toon de modal
    modal.style.display = 'flex';
    
    // Genereer de QR-code in de container
    const container = document.getElementById('qrCodeContainer');
    const serienummerSpan = document.getElementById('qrSerienummer');
    if (container) {
        container.innerHTML = '';
        document.getElementById('qrSerienummer').textContent = serienummer;
        
        // Sla het serienummer op voor download
        window._currentQRSerienummer = serienummer;
        
        // Genereer QR - ALLEEN serienummer als tekst
        try {
            new QRCode(container, {
                text: serienummer,  // ← ALLEEN het serienummer!
                width: 200,
                height: 200,
                colorDark: '#1A2B4C',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('❌ Fout bij genereren QR:', error);
            container.innerHTML = '<p style="color: #dc3545;">❌ Kan QR-code niet genereren</p>';
        }
    }
}

/**
 * Sluit de QR-code modal
 */
function closeQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Downloadt de QR-code als afbeelding
 */
function downloadQRCode() {
    const container = document.getElementById('qrCodeContainer');
    if (!container) return;
    
    const canvas = container.querySelector('canvas');
    if (!canvas) {
        alert('❌ Geen QR-code om te downloaden.');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.download = `QR_${window._currentQRSerienummer || 'fiets'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        console.log('✅ QR-code gedownload');
    } catch (error) {
        console.error('❌ Fout bij downloaden:', error);
        alert('❌ Kan QR-code niet downloaden.');
    }
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
window.editModel = editModel;
window.saveModel = saveModel;
window.cancelEditModel = cancelEditModel;
window.deleteModel = deleteModel;

// QR-code functies
window.showQRCode = showQRCode;
window.closeQRModal = closeQRModal;
window.downloadQRCode = downloadQRCode;

console.log('✅ Applicatie klaar voor gebruik');