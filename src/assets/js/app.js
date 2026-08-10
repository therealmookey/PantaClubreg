/**
 * ============================================
 * HOOFDAPPLICATIE - MET MODELLEN, FIETSEN, KLANTEN EN VERHUUR
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
                Beheer hier jouw fietsmodellen, individuele fietsen, klanten, verhuur en onderhoud.
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
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">👤</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-klanten">0</h3>
                    <p style="color: #666; margin: 0;">Klanten</p>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">📋</div>
                    <h3 style="font-size: 1.8rem; margin: 0;" id="stat-verhuur">0</h3>
                    <p style="color: #666; margin: 0;">Actieve verhuur</p>
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
                    <button class="btn btn-primary" onclick="window.navigateTo('klanten')">
                        👤 Klant toevoegen
                    </button>
                    <button class="btn btn-accent" onclick="window.navigateTo('verhuur')">
                        📋 Verhuur starten
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
            <p style="color: #666; margin-bottom: 20px;">
                Beheer hier alle klanten. Je kunt ze handmatig toevoegen, bewerken of verwijderen.
            </p>
            
            <button class="btn btn-primary" onclick="window.showAddKlantForm()" style="margin-bottom: 20px;">
                ➕ Nieuwe klant toevoegen
            </button>
            
            <div id="addKlantForm" style="display: none; margin-bottom: 30px;">
                <div class="card">
                    <h3>Nieuwe klant toevoegen</h3>
                    <form id="klantForm">
                        <div class="form-group">
                            <label for="klantNaam">Volledige naam *</label>
                            <input type="text" id="klantNaam" placeholder="Bijv. Jan Janssens" required>
                        </div>
                        <div class="form-group">
                            <label for="klantEmail">E-mailadres</label>
                            <input type="email" id="klantEmail" placeholder="jan@voorbeeld.be">
                        </div>
                        <div class="form-group">
                            <label for="klantTelefoon">Telefoonnummer</label>
                            <input type="text" id="klantTelefoon" placeholder="0485 12 34 56">
                        </div>
                        <div class="form-group">
                            <label for="klantAdres">Adres</label>
                            <input type="text" id="klantAdres" placeholder="Straat 1, 1000 Brussel">
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button type="submit" class="btn btn-primary">💾 Opslaan</button>
                            <button type="button" class="btn btn-outline" onclick="window.hideAddKlantForm()">Annuleren</button>
                        </div>
                    </form>
                    <div id="klantFormMessage" style="margin-top: 10px;"></div>
                </div>
            </div>
            
            <div id="klantenLijst">
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">👤</div>
                    <h3>Laden van klanten...</h3>
                </div>
            </div>
        </div>
    `,
    
    verhuur: `
        <div style="padding: 20px 0;">
            <h1>📋 Verhuur</h1>
            <p style="color: #666; margin-bottom: 20px;">
                Koppel fietsen aan klanten en hou bij hoe lang ze de fiets hebben.
            </p>
            
            <button class="btn btn-accent" onclick="window.showAddVerhuurForm()" style="margin-bottom: 20px;">
                ➕ Nieuwe verhuur starten
            </button>
            
            <div id="addVerhuurForm" style="display: none; margin-bottom: 30px;">
                <div class="card">
                    <h3>Nieuwe verhuur starten</h3>
                    <form id="verhuurForm">
                        <div class="form-group">
                            <label for="verhuurFiets">Fiets (serienummer) *</label>
                            <select id="verhuurFiets" required>
                                <option value="">-- Selecteer een fiets --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="verhuurKlant">Klant *</label>
                            <select id="verhuurKlant" required>
                                <option value="">-- Selecteer een klant --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="verhuurStart">Startdatum *</label>
                            <input type="date" id="verhuurStart" required>
                        </div>
                        <div class="form-group">
                            <label for="verhuurOpmerkingen">Opmerkingen</label>
                            <textarea id="verhuurOpmerkingen" rows="2" placeholder="Bijv. fiets is in goede staat"></textarea>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button type="submit" class="btn btn-accent">💾 Verhuur starten</button>
                            <button type="button" class="btn btn-outline" onclick="window.hideAddVerhuurForm()">Annuleren</button>
                        </div>
                    </form>
                    <div id="verhuurFormMessage" style="margin-top: 10px;"></div>
                </div>
            </div>
            
            <div id="verhuurLijst">
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📋</div>
                    <h3>Laden van verhuur...</h3>
                </div>
            </div>
        </div>
    `,
    
    onderhoud: `
        <div style="padding: 20px 0;">
            <h1>🔧 Onderhoudsboekje</h1>
            <p style="color: #666; margin-bottom: 20px;">
                Registreer onderhoudsbeurten per fiets. (Komt binnenkort)
            </p>
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
    if (page === 'klanten') {
        setTimeout(loadKlanten, 100);
    }
    if (page === 'verhuur') {
        setTimeout(loadVerhuur, 100);
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
// KLANTEN FUNCTIES
// ============================================

function showAddKlantForm() {
    const form = document.getElementById('addKlantForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideAddKlantForm() {
    const form = document.getElementById('addKlantForm');
    if (form) {
        form.style.display = 'none';
    }
    const message = document.getElementById('klantFormMessage');
    if (message) {
        message.innerHTML = '';
    }
    const formElement = document.getElementById('klantForm');
    if (formElement) {
        formElement.reset();
    }
}

async function loadKlanten() {
    console.log('📥 Laden van klanten...');
    const lijst = document.getElementById('klantenLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>`;
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('klanten')
            .select('*')
            .order('naam', { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            lijst.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">👤</div>
                    <h3>Geen klanten gevonden</h3>
                    <p style="color: #999;">Voeg je eerste klant toe met de knop hierboven.</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Naam</th>
                            <th>E-mail</th>
                            <th>Telefoon</th>
                            <th>Adres</th>
                            <th style="text-align:center;">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(klant => {
            html += `
                <tr id="klant-${klant.id}">
                    <td><strong>${klant.naam}</strong></td>
                    <td>${klant.email || '-'}</td>
                    <td>${klant.telefoon || '-'}</td>
                    <td>${klant.adres || '-'}</td>
                    <td style="text-align:center;">
                        <button class="btn btn-sm btn-primary" onclick="window.editKlant('${klant.id}')" style="margin-right:5px;">
                            ✏️ Bewerken
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.deleteKlant('${klant.id}')">
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
                Totaal: ${data.length} klanten
            </p>
        `;
        
        lijst.innerHTML = html;
    } catch (error) {
        console.error('❌ Fout bij laden klanten:', error);
        lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>`;
    }
}

// ============================================
// KLANT BEWERKEN
// ============================================

function editKlant(klantId) {
    console.log('✏️ Bewerken van klant:', klantId);
    
    const row = document.getElementById(`klant-${klantId}`);
    if (!row) {
        showMessage('Klant niet gevonden!');
        return;
    }
    
    const cells = row.querySelectorAll('td');
    const naam = cells[0].textContent.trim();
    const email = cells[1].textContent.trim() === '-' ? '' : cells[1].textContent.trim();
    const telefoon = cells[2].textContent.trim() === '-' ? '' : cells[2].textContent.trim();
    const adres = cells[3].textContent.trim() === '-' ? '' : cells[3].textContent.trim();
    
    row.innerHTML = `
        <td>
            <input type="text" id="edit-naam-${klantId}" value="${naam}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;" required>
        </td>
        <td>
            <input type="email" id="edit-email-${klantId}" value="${email}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
        </td>
        <td>
            <input type="text" id="edit-telefoon-${klantId}" value="${telefoon}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
        </td>
        <td>
            <input type="text" id="edit-adres-${klantId}" value="${adres}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
        </td>
        <td style="text-align:center;">
            <button class="btn btn-sm btn-success" onclick="window.saveKlant('${klantId}')" style="margin-right:5px;">
                💾 Opslaan
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.cancelEditKlant('${klantId}')">
                ❌ Annuleren
            </button>
        </td>
    `;
}

// ============================================
// KLANT OPSLAAN
// ============================================

async function saveKlant(klantId) {
    console.log('💾 Opslaan van klant:', klantId);
    
    const naamInput = document.getElementById(`edit-naam-${klantId}`);
    const emailInput = document.getElementById(`edit-email-${klantId}`);
    const telefoonInput = document.getElementById(`edit-telefoon-${klantId}`);
    const adresInput = document.getElementById(`edit-adres-${klantId}`);
    
    if (!naamInput) {
        showMessage('Fout: kan velden niet vinden.');
        return;
    }
    
    const naam = naamInput.value.trim();
    const email = emailInput.value.trim();
    const telefoon = telefoonInput.value.trim();
    const adres = adresInput.value.trim();
    
    if (!naam) {
        showMessage('❌ Naam is verplicht!');
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('klanten')
            .update({ naam, email, telefoon, adres })
            .eq('id', klantId);
        
        if (error) throw error;
        
        showMessage('✅ Klant succesvol bijgewerkt!');
        loadKlanten();
        
    } catch (error) {
        console.error('❌ Fout bij opslaan:', error);
        showMessage('❌ Fout: ' + error.message);
    }
}

// ============================================
// KLANT BEWERKING ANNULEREN
// ============================================

function cancelEditKlant(klantId) {
    console.log('❌ Bewerking geannuleerd voor:', klantId);
    loadKlanten();
}

// ============================================
// KLANT VERWIJDEREN
// ============================================

async function deleteKlant(klantId) {
    console.log('🗑️ Verwijderen van klant:', klantId);
    
    if (!confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('klanten')
            .delete()
            .eq('id', klantId);
        
        if (error) throw error;
        
        showMessage('✅ Klant succesvol verwijderd!');
        loadKlanten();
        loadStats();
        
    } catch (error) {
        console.error('❌ Fout bij verwijderen:', error);
        showMessage('❌ Fout: ' + error.message);
    }
}

// ============================================
// KLANT SUBMIT (Toevoegen)
// ============================================

document.addEventListener('submit', async function(event) {
    if (event.target.id === 'klantForm') {
        event.preventDefault();
        await handleKlantSubmit(event);
    }
});

async function handleKlantSubmit(event) {
    const naam = document.getElementById('klantNaam').value.trim();
    const email = document.getElementById('klantEmail').value.trim();
    const telefoon = document.getElementById('klantTelefoon').value.trim();
    const adres = document.getElementById('klantAdres').value.trim();
    const messageDiv = document.getElementById('klantFormMessage');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    if (!naam) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Naam is verplicht!</p>';
        return;
    }
    
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    messageDiv.innerHTML = '<p style="color: #666;">⏳ Bezig met opslaan...</p>';
    
    try {
        const { error } = await window.supabaseClient
            .from('klanten')
            .insert([{ naam, email, telefoon, adres }]);
        
        if (error) throw error;
        
        messageDiv.innerHTML = `<p style="color: #28a745;">✅ Klant ${naam} succesvol toegevoegd!</p>`;
        document.getElementById('klantForm').reset();
        
        setTimeout(() => {
            hideAddKlantForm();
            loadKlanten();
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
// VERHUUR FUNCTIES
// ============================================

function showAddVerhuurForm() {
    const form = document.getElementById('addVerhuurForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        loadVerhuurSelectOptions();
    }
}

function hideAddVerhuurForm() {
    const form = document.getElementById('addVerhuurForm');
    if (form) {
        form.style.display = 'none';
    }
    const message = document.getElementById('verhuurFormMessage');
    if (message) {
        message.innerHTML = '';
    }
    const formElement = document.getElementById('verhuurForm');
    if (formElement) {
        formElement.reset();
    }
}

async function loadVerhuurSelectOptions() {
    // LAAD ALLEEN BESCHIKBARE FIETSEN (status = 'beschikbaar')
    const fietsSelect = document.getElementById('verhuurFiets');
    const klantSelect = document.getElementById('verhuurKlant');
    
    if (fietsSelect) {
        try {
            const { data, error } = await window.supabaseClient
                .from('individuele_fietsen')
                .select(`id, serienummer, fiets_modellen (merk, model, kleur)`)
                .eq('status', 'beschikbaar')  // ALLEEN beschikbare fietsen
                .order('serienummer', { ascending: true });
            
            if (!error && data) {
                fietsSelect.innerHTML = '<option value="">-- Selecteer een fiets --</option>';
                data.forEach(fiets => {
                    const modelInfo = fiets.fiets_modellen || { merk: '', model: '', kleur: '' };
                    const label = `${fiets.serienummer} - ${modelInfo.merk} ${modelInfo.model} (${modelInfo.kleur})`;
                    const option = document.createElement('option');
                    option.value = fiets.id;
                    option.textContent = label;
                    fietsSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('❌ Fout bij laden fietsen:', error);
        }
    }
    
    if (klantSelect) {
        try {
            const { data, error } = await window.supabaseClient
                .from('klanten')
                .select('id, naam')
                .order('naam', { ascending: true });
            
            if (!error && data) {
                klantSelect.innerHTML = '<option value="">-- Selecteer een klant --</option>';
                data.forEach(klant => {
                    const option = document.createElement('option');
                    option.value = klant.id;
                    option.textContent = klant.naam;
                    klantSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('❌ Fout bij laden klanten:', error);
        }
    }
}

async function loadVerhuur() {
    console.log('📥 Laden van verhuur...');
    const lijst = document.getElementById('verhuurLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>`;
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('verhuur_historiek')
            .select(`
                *,
                individuele_fietsen (serienummer, fiets_modellen (merk, model, kleur)),
                klanten (naam, email, telefoon)
            `)
            .order('start_datum', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            lijst.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📋</div>
                    <h3>Geen verhuur gevonden</h3>
                    <p style="color: #999;">Start een nieuwe verhuur met de knop hierboven.</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Fiets</th>
                            <th>Klant</th>
                            <th>Start</th>
                            <th>Eind</th>
                            <th>Status</th>
                            <th style="text-align:center;">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(verhuur => {
            const fietsInfo = verhuur.individuele_fietsen || { serienummer: 'Onbekend', fiets_modellen: { merk: '', model: '', kleur: '' } };
            const modelInfo = fietsInfo.fiets_modellen || { merk: '', model: '', kleur: '' };
            const klantInfo = verhuur.klanten || { naam: 'Onbekend' };
            
            const isActief = !verhuur.eind_datum;
            const statusClass = isActief ? 'badge-rented' : 'badge-available';
            const statusText = isActief ? '🔴 Actief' : '✅ Afgerond';
            
            const startDatum = new Date(verhuur.start_datum).toLocaleDateString('nl-BE');
            const eindDatum = verhuur.eind_datum ? new Date(verhuur.eind_datum).toLocaleDateString('nl-BE') : '-';
            
            html += `
                <tr id="verhuur-${verhuur.id}">
                    <td><strong>${fietsInfo.serienummer}</strong><br><span style="font-size:0.8rem;color:#666;">${modelInfo.merk} ${modelInfo.model}</span></td>
                    <td><strong>${klantInfo.naam}</strong></td>
                    <td>${startDatum}</td>
                    <td>${eindDatum}</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td style="text-align:center;">
                        ${isActief ? `
                            <button class="btn btn-sm btn-success" onclick="window.beëindigVerhuur('${verhuur.id}')" style="margin-right:5px;">
                                ✅ Beëindigen
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-danger" onclick="window.deleteVerhuur('${verhuur.id}')">
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
                Totaal: ${data.length} verhuurregels
            </p>
        `;
        
        lijst.innerHTML = html;
    } catch (error) {
        console.error('❌ Fout bij laden verhuur:', error);
        lijst.innerHTML = `<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>`;
    }
}

// ============================================
// VERHUUR SUBMIT (Toevoegen)
// ============================================

document.addEventListener('submit', async function(event) {
    if (event.target.id === 'verhuurForm') {
        event.preventDefault();
        await handleVerhuurSubmit(event);
    }
});

async function handleVerhuurSubmit(event) {
    const fietsId = document.getElementById('verhuurFiets').value;
    const klantId = document.getElementById('verhuurKlant').value;
    const startDatum = document.getElementById('verhuurStart').value;
    const opmerkingen = document.getElementById('verhuurOpmerkingen').value.trim();
    const messageDiv = document.getElementById('verhuurFormMessage');
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    if (!fietsId || !klantId || !startDatum) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Fiets, klant en startdatum zijn verplicht!</p>';
        return;
    }
    
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    messageDiv.innerHTML = '<p style="color: #666;">⏳ Verhuur wordt gestart...</p>';
    
    try {
        // 1. Voeg verhuur toe aan historiek
        const { error: verhuurError } = await window.supabaseClient
            .from('verhuur_historiek')
            .insert([{
                fiets_id: fietsId,
                klant_id: klantId,
                start_datum: startDatum,
                opmerkingen: opmerkingen || null
            }]);
        
        if (verhuurError) throw verhuurError;
        
        // 2. Update fiets status naar 'verhuurd'
        const { error: fietsError } = await window.supabaseClient
            .from('individuele_fietsen')
            .update({ status: 'verhuurd' })
            .eq('id', fietsId);
        
        if (fietsError) throw fietsError;
        
        messageDiv.innerHTML = `<p style="color: #28a745;">✅ Verhuur succesvol gestart!</p>`;
        document.getElementById('verhuurForm').reset();
        
        setTimeout(() => {
            hideAddVerhuurForm();
            loadVerhuur();
            loadFietsen();
            loadStats();
        }, 2000);
    } catch (error) {
        console.error('❌ Fout:', error);
        messageDiv.innerHTML = `<p style="color: #dc3545;">❌ Fout: ${error.message}</p>`;
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// VERHUUR BEËINDIGEN
// ============================================

async function beëindigVerhuur(verhuurId) {
    console.log('✅ Beëindigen van verhuur:', verhuurId);
    
    if (!confirm('Weet je zeker dat je deze verhuur wilt beëindigen?')) {
        return;
    }
    
    const eindDatum = new Date().toISOString().split('T')[0];
    
    try {
        const { data: verhuurData, error: verhuurFetchError } = await window.supabaseClient
            .from('verhuur_historiek')
            .select('fiets_id')
            .eq('id', verhuurId)
            .single();
        
        if (verhuurFetchError) throw verhuurFetchError;
        
        const { error: updateError } = await window.supabaseClient
            .from('verhuur_historiek')
            .update({ eind_datum: eindDatum })
            .eq('id', verhuurId);
        
        if (updateError) throw updateError;
        
        if (verhuurData && verhuurData.fiets_id) {
            const { error: fietsError } = await window.supabaseClient
                .from('individuele_fietsen')
                .update({ status: 'beschikbaar' })
                .eq('id', verhuurData.fiets_id);
            
            if (fietsError) throw fietsError;
        }
        
        showMessage('✅ Verhuur succesvol beëindigd!');
        loadVerhuur();
        loadFietsen();
        loadStats();
        
    } catch (error) {
        console.error('❌ Fout bij beëindigen:', error);
        showMessage('❌ Fout: ' + error.message);
    }
}

// ============================================
// VERHUUR VERWIJDEREN
// ============================================

async function deleteVerhuur(verhuurId) {
    console.log('🗑️ Verwijderen van verhuur:', verhuurId);
    
    if (!confirm('Weet je zeker dat je deze verhuur wilt verwijderen?')) {
        return;
    }
    
    try {
        const { data: verhuurData, error: fetchError } = await window.supabaseClient
            .from('verhuur_historiek')
            .select('fiets_id, eind_datum')
            .eq('id', verhuurId)
            .single();
        
        if (fetchError) throw fetchError;
        
        const { error: deleteError } = await window.supabaseClient
            .from('verhuur_historiek')
            .delete()
            .eq('id', verhuurId);
        
        if (deleteError) throw deleteError;
        
        if (verhuurData && !verhuurData.eind_datum && verhuurData.fiets_id) {
            const { error: fietsError } = await window.supabaseClient
                .from('individuele_fietsen')
                .update({ status: 'beschikbaar' })
                .eq('id', verhuurData.fiets_id);
            
            if (fietsError) throw fietsError;
        }
        
        showMessage('✅ Verhuur verwijderd!');
        loadVerhuur();
        loadFietsen();
        loadStats();
        
    } catch (error) {
        console.error('❌ Fout bij verwijderen:', error);
        showMessage('❌ Fout: ' + error.message);
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
        
        const { count: klantenCount } = await window.supabaseClient
            .from('klanten')
            .select('*', { count: 'exact', head: true });
        
        const { count: verhuurCount } = await window.supabaseClient
            .from('verhuur_historiek')
            .select('*', { count: 'exact', head: true })
            .is('eind_datum', null);
        
        const el1 = document.getElementById('stat-modellen');
        const el2 = document.getElementById('stat-fietsen');
        const el3 = document.getElementById('stat-klanten');
        const el4 = document.getElementById('stat-verhuur');
        if (el1) el1.textContent = modellenCount || 0;
        if (el2) el2.textContent = fietsenCount || 0;
        if (el3) el3.textContent = klantenCount || 0;
        if (el4) el4.textContent = verhuurCount || 0;
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
async function showQRCode(serienummer) {
    console.log('📱 Toon QR-code voor:', serienummer);
    
    // Haal de fietsgegevens op uit de database
    let fietsGegevens = null;
    try {
        const { data, error } = await window.supabaseClient
            .from('individuele_fietsen')
            .select(`*, fiets_modellen (merk, model, kleur)`)
            .eq('serienummer', serienummer)
            .single();
        
        if (!error && data) {
            fietsGegevens = data;
        }
    } catch (error) {
        console.warn('⚠️ Kan fietsgegevens niet ophalen:', error);
    }
    
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
            padding: 20px;
        `;
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 450px;
                width: 100%;
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
                
                <div id="qrExportContainer" style="padding: 10px;">
                    <h3 style="margin-bottom: 5px; color: #1A2B4C;">🚲 Panta Club</h3>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">
                        Scan de QR-code voor fietsinformatie
                    </p>
                    
                    <!-- QR-code container -->
                    <div id="qrCodeContainer" style="display: flex; justify-content: center; margin: 10px 0;"></div>
                    
                    <!-- Fietsgegevens onder de QR -->
                    <div id="qrFietsInfo" style="margin-top: 10px; padding: 10px; background: #f8f6f3; border-radius: 8px;">
                        <p style="margin: 3px 0; font-weight: 600; color: #1A2B4C;" id="qrModelDisplay">-</p>
                        <p style="margin: 3px 0; color: #666; font-size: 0.9rem;">
                            Serienummer: <strong id="qrSerienummerDisplay">-</strong>
                        </p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px; flex-wrap: wrap;">
                    <button onclick="window.downloadQRCode()" class="btn btn-primary">
                        ⬇️ Download afbeelding
                    </button>
                </div>
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
    const modelDisplay = document.getElementById('qrModelDisplay');
    const serienummerDisplay = document.getElementById('qrSerienummerDisplay');
    
    if (container) {
        container.innerHTML = '';
        
        // Toon fietsgegevens
        if (fietsGegevens && fietsGegevens.fiets_modellen) {
            const model = fietsGegevens.fiets_modellen;
            const kleurStyle = `display:inline-block;width:14px;height:14px;border-radius:50%;background:${model.kleur.toLowerCase()};border:1px solid #ddd;vertical-align:middle;margin-right:5px;`;
            modelDisplay.innerHTML = `
                <span style="${kleurStyle}"></span>
                ${model.merk} ${model.model} (${model.kleur})
            `;
        } else {
            modelDisplay.textContent = 'Onbekend model';
        }
        
        serienummerDisplay.textContent = serienummer;
        
        // Sla het serienummer op voor download
        window._currentQRSerienummer = serienummer;
        window._currentQRFietsData = fietsGegevens;
        
        // Genereer QR - ALLEEN het serienummer
        try {
            new QRCode(container, {
                text: serienummer,
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
 * Downloadt de QR-code als afbeelding met fietsgegevens
 */
function downloadQRCode() {
    console.log('⬇️ Start download van QR-afbeelding...');
    
    // Haal de QR-code canvas op
    const qrContainer = document.getElementById('qrCodeContainer');
    if (!qrContainer) {
        alert('❌ Geen QR-code gevonden.');
        return;
    }
    
    const qrCanvas = qrContainer.querySelector('canvas');
    if (!qrCanvas) {
        alert('❌ Geen QR-code afbeelding gevonden.');
        return;
    }
    
    // Haal de fietsgegevens op
    const modelDisplay = document.getElementById('qrModelDisplay');
    const serienummerDisplay = document.getElementById('qrSerienummerDisplay');
    const modelText = modelDisplay ? modelDisplay.textContent.trim() : 'Panta Club';
    const serienummer = serienummerDisplay ? serienummerDisplay.textContent.trim() : window._currentQRSerienummer || 'Onbekend';
    
    // Maak een nieuwe canvas voor de volledige afbeelding
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Bepaal afmetingen
    const padding = 30;
    const qrSize = 200;
    const totalWidth = qrSize + (padding * 2);
    const totalHeight = qrSize + (padding * 2) + 70;
    
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    
    // Witte achtergrond
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    
    // QR-code tekenen
    ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);
    
    // Tekst onder de QR-code
    ctx.fillStyle = '#1A2B4C';
    ctx.font = 'bold 14px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(modelText, totalWidth / 2, qrSize + padding + 30);
    
    ctx.fillStyle = '#666666';
    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText('Serienummer: ' + serienummer, totalWidth / 2, qrSize + padding + 55);
    
    // Download de afbeelding
    try {
        const link = document.createElement('a');
        link.download = `PantaClub_QR_${serienummer}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ QR-afbeelding gedownload');
        showMessage('✅ Afbeelding gedownload!');
    } catch (error) {
        console.error('❌ Fout bij downloaden:', error);
        alert('❌ Kan afbeelding niet downloaden. Probeer opnieuw.');
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

// Klanten functies
window.showAddKlantForm = showAddKlantForm;
window.hideAddKlantForm = hideAddKlantForm;
window.loadKlanten = loadKlanten;
window.editKlant = editKlant;
window.saveKlant = saveKlant;
window.cancelEditKlant = cancelEditKlant;
window.deleteKlant = deleteKlant;

// Verhuur functies
window.showAddVerhuurForm = showAddVerhuurForm;
window.hideAddVerhuurForm = hideAddVerhuurForm;
window.loadVerhuur = loadVerhuur;
window.beëindigVerhuur = beëindigVerhuur;
window.deleteVerhuur = deleteVerhuur;

// QR-code functies
window.showQRCode = showQRCode;
window.closeQRModal = closeQRModal;
window.downloadQRCode = downloadQRCode;

console.log('✅ Applicatie klaar voor gebruik');