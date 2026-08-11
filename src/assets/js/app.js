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
            </p>
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                <button class="btn btn-accent" onclick="window.showAddFietsForm()">
                    ➕ Nieuwe fiets toevoegen
                </button>
                <button class="btn btn-accent" onclick="window.showFietsExcelImport()">
                    📊 Importeer Excel (Stocklijst)
                </button>
            </div>
            
            <!-- FIETS EXCEL IMPORT MODAL -->
            <div id="fietsExcelImportModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
                <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3>📊 Excel Import - Fietsen (Stocklijst)</h3>
                        <button onclick="window.closeFietsExcelImport()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;">✕</button>
                    </div>
                    
                    <p style="color: #666; margin-bottom: 15px;">
                        Upload een Excel bestand (.xlsx of .xls) met fietsgegevens.
                        <br><small style="color: #999;">De eerste rij moet de kolomnamen bevatten.</small>
                        <br><small style="color: #999;">Kies het tabblad <strong>"stocklijst"</strong> of selecteer het juiste tabblad.</small>
                    </p>
                    
                    <div style="border: 2px dashed #E0DCD6; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 20px; cursor: pointer;" 
                         ondrop="window.handleFietsExcelDrop(event)" ondragover="event.preventDefault()" onclick="document.getElementById('fietsExcelFileInput').click()">
                        <div style="font-size: 3rem; margin-bottom: 10px;">📁</div>
                        <p><strong>Klik hier</strong> of sleep een Excel bestand naar dit vak</p>
                        <p style="color: #999; font-size: 0.85rem;">Ondersteunt .xlsx en .xls</p>
                        <input type="file" id="fietsExcelFileInput" accept=".xlsx,.xls" style="display: none;" onchange="window.handleFietsExcelFile(event)">
                    </div>
                    
                    <div id="fietsExcelPreview" style="display: none; margin-bottom: 20px;">
                        <h4>📋 Voorbeeld van de data</h4>
                        <div id="fietsExcelPreviewContent" style="overflow-x: auto; max-height: 300px; border: 1px solid #E0DCD6; border-radius: 8px; padding: 10px;"></div>
                    </div>
                    
                    <div id="fietsExcelImportStatus" style="margin-bottom: 15px;"></div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button id="fietsExcelImportBtn" class="btn btn-accent" onclick="window.importFietsExcelData()" style="display: none;">
                            💾 Importeer data
                        </button>
                        <button class="btn btn-outline" onclick="window.closeFietsExcelImport()">Annuleren</button>
                    </div>
                </div>
            </div>
            
            <!-- ZOEKBALK -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="fietsZoekInput" placeholder="🔍 Zoek op serienummer, merk of model..." 
                       style="flex:1;min-width:200px;padding:10px 16px;border:2px solid #E0DCD6;border-radius:8px;font-family:'Poppins',sans-serif;font-size:1rem;">
                <select id="fietsStatusFilter" style="padding:10px 16px;border:2px solid #E0DCD6;border-radius:8px;font-family:'Poppins',sans-serif;font-size:1rem;">
                    <option value="">Alle statussen</option>
                    <option value="beschikbaar">Beschikbaar</option>
                    <option value="verhuurd">Verhuurd</option>
                    <option value="in-onderhoud">In onderhoud</option>
                </select>
                <button class="btn btn-primary" onclick="window.filterFietsen()">🔍 Zoeken</button>
                <button class="btn btn-outline" onclick="window.resetFietsFilter()">🔄 Reset</button>
            </div>
            
            <div id="addFietsForm" style="display: none; margin-bottom: 30px;">
                <div class="card">
                    <h3>Nieuwe fiets registreren</h3>
                    <form id="fietsForm">
                        <div class="form-group">
                            <label for="fietsSerienummer">Serienummer *</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="text" id="fietsSerienummer" placeholder="Bijv. PC-A7B3F9D2" style="flex:1;" required>
                                <button type="button" class="btn btn-outline" onclick="window.vulSerienummerIn()" style="white-space:nowrap;">
                                    🎲 Genereer
                                </button>
                            </div>
                            <small style="color: #999; font-size: 0.8rem;">
                                Klik op "Genereer" voor een automatisch serienummer (PC-XXXXXXXX)
                            </small>
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
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                <button class="btn btn-primary" onclick="window.showAddKlantForm()">
                    ➕ Nieuwe klant toevoegen
                </button>
                <button class="btn btn-accent" onclick="window.showExcelImport()">
                    📊 Importeer Excel (Subscribers)
                </button>
            </div>
            
            <!-- EXCEL IMPORT MODAL -->
            <div id="excelImportModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
                <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3>📊 Excel Import - Klanten</h3>
                        <button onclick="window.closeExcelImport()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;">✕</button>
                    </div>
                    
                    <p style="color: #666; margin-bottom: 15px;">
                        Upload een Excel bestand (.xlsx of .xls) met klantgegevens.
                        <br><small style="color: #999;">De eerste rij moet de kolomnamen bevatten.</small>
                        <br><small style="color: #999;">Gebruik het <strong>"Subscribers"</strong> tabblad.</small>
                    </p>
                    
                    <div style="border: 2px dashed #E0DCD6; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 20px; cursor: pointer;" 
                         ondrop="window.handleExcelDrop(event)" ondragover="event.preventDefault()" onclick="document.getElementById('excelFileInput').click()">
                        <div style="font-size: 3rem; margin-bottom: 10px;">📁</div>
                        <p><strong>Klik hier</strong> of sleep een Excel bestand naar dit vak</p>
                        <p style="color: #999; font-size: 0.85rem;">Ondersteunt .xlsx en .xls</p>
                        <input type="file" id="excelFileInput" accept=".xlsx,.xls" style="display: none;" onchange="window.handleExcelFile(event)">
                    </div>
                    
                    <div id="excelPreview" style="display: none; margin-bottom: 20px;">
                        <h4>📋 Voorbeeld van de data</h4>
                        <div id="excelPreviewContent" style="overflow-x: auto; max-height: 300px; border: 1px solid #E0DCD6; border-radius: 8px; padding: 10px;"></div>
                    </div>
                    
                    <div id="excelImportStatus" style="margin-bottom: 15px;"></div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button id="excelImportBtn" class="btn btn-accent" onclick="window.importExcelData()" style="display: none;">
                            💾 Importeer data
                        </button>
                        <button class="btn btn-outline" onclick="window.closeExcelImport()">Annuleren</button>
                    </div>
                </div>
            </div>
            
            <!-- ZOEKBALK -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="klantZoekInput" placeholder="🔍 Zoek op naam, e-mail of telefoon..." 
                       style="flex:1;min-width:200px;padding:10px 16px;border:2px solid #E0DCD6;border-radius:8px;font-family:'Poppins',sans-serif;font-size:1rem;">
                <button class="btn btn-primary" onclick="window.filterKlanten()">🔍 Zoeken</button>
                <button class="btn btn-outline" onclick="window.resetKlantFilter()">🔄 Reset</button>
            </div>
            
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
            
            <!-- ZOEKBALK -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="verhuurZoekInput" placeholder="🔍 Zoek op fiets, klant of serienummer..." 
                       style="flex:1;min-width:200px;padding:10px 16px;border:2px solid #E0DCD6;border-radius:8px;font-family:'Poppins',sans-serif;font-size:1rem;">
                <select id="verhuurStatusFilter" style="padding:10px 16px;border:2px solid #E0DCD6;border-radius:8px;font-family:'Poppins',sans-serif;font-size:1rem;">
                    <option value="">Alle verhuur</option>
                    <option value="actief">Actief</option>
                    <option value="afgerond">Afgerond</option>
                </select>
                <button class="btn btn-primary" onclick="window.filterVerhuur()">🔍 Zoeken</button>
                <button class="btn btn-outline" onclick="window.resetVerhuurFilter()">🔄 Reset</button>
            </div>
            
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
// SERIENUMMER GENERATOR
// ============================================

function genereerSerienummer() {
    const prefix = 'PC';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return prefix + '-' + result;
}

function vulSerienummerIn() {
    const input = document.getElementById('fietsSerienummer');
    if (input) {
        const nieuwSerienummer = genereerSerienummer();
        input.value = nieuwSerienummer;
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#f0fff4';
        setTimeout(function() {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        }, 1500);
    }
}

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
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>';
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
        
        data.forEach(function(model) {
            var kleurStyle = 'display:inline-block;width:20px;height:20px;border-radius:50%;background:' + model.kleur.toLowerCase() + ';border:1px solid #ddd;vertical-align:middle;margin-right:5px;';
            
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
        lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>';
    }
}

// ============================================
// MODEL BEWERKEN
// ============================================

function editModel(modelId) {
    console.log('✏️ Bewerken van model:', modelId);
    
    var row = document.getElementById('model-' + modelId);
    if (!row) {
        showMessage('Model niet gevonden!');
        return;
    }
    
    var cells = row.querySelectorAll('td');
    var merk = cells[0].textContent.trim();
    var model = cells[1].textContent.trim();
    var kleur = cells[2].textContent.trim();
    
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
    
    var merkInput = document.getElementById('edit-merk-' + modelId);
    var modelInput = document.getElementById('edit-model-' + modelId);
    var kleurInput = document.getElementById('edit-kleur-' + modelId);
    
    if (!merkInput || !modelInput || !kleurInput) {
        showMessage('Fout: kan velden niet vinden.');
        return;
    }
    
    var merk = merkInput.value.trim();
    var model = modelInput.value.trim();
    var kleur = kleurInput.value.trim();
    
    if (!merk || !model || !kleur) {
        showMessage('❌ Alle velden zijn verplicht!');
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('fiets_modellen')
            .update({ merk: merk, model: model, kleur: kleur })
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
    var merk = document.getElementById('modelMerk').value.trim();
    var model = document.getElementById('modelNaam').value.trim();
    var kleur = document.getElementById('modelKleur').value.trim();
    var messageDiv = document.getElementById('modelFormMessage');
    var button = event.target.querySelector('button[type="submit"]');
    var originalText = button.textContent;
    
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
            .insert([{ merk: merk, model: model, kleur: kleur }]);
        
        if (error) throw error;
        
        messageDiv.innerHTML = '<p style="color: #28a745;">✅ Model ' + merk + ' - ' + model + ' (' + kleur + ') toegevoegd!</p>';
        document.getElementById('modelForm').reset();
        
        setTimeout(function() {
            hideAddModelForm();
            loadModellen();
            loadStats();
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout: ' + error.message + '</p>';
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// FIETSEN FUNCTIES
// ============================================

var alleFietsen = [];

function showAddFietsForm() {
    var form = document.getElementById('addFietsForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        loadModelSelectOptions();
    }
}

function hideAddFietsForm() {
    var form = document.getElementById('addFietsForm');
    if (form) {
        form.style.display = 'none';
    }
    var message = document.getElementById('fietsFormMessage');
    if (message) {
        message.innerHTML = '';
    }
}

async function loadModelSelectOptions() {
    var select = document.getElementById('fietsModelSelect');
    if (!select) return;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('fiets_modellen')
            .select('*')
            .order('merk', { ascending: true });
        
        if (error) throw error;
        
        select.innerHTML = '<option value="">-- Selecteer een model --</option>';
        data.forEach(function(model) {
            var option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.merk + ' - ' + model.model + ' (' + model.kleur + ')';
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Fout bij laden modellen:', error);
    }
}

async function loadFietsen() {
    console.log('📥 Laden van fietsen...');
    var lijst = document.getElementById('fietsenLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>';
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('individuele_fietsen')
            .select('*, fiets_modellen (merk, model, kleur)')
            .order('aangemaakt_op', { ascending: false });
        
        if (error) throw error;
        
        alleFietsen = data || [];
        
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
        
        toonFietsenLijst(data);
        
    } catch (error) {
        console.error('❌ Fout bij laden fietsen:', error);
        lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3><p style="color:#999;">' + error.message + '</p></div>';
    }
}

async function filterFietsen() {
    var zoekTerm = document.getElementById('fietsZoekInput').value.toLowerCase().trim();
    var statusFilter = document.getElementById('fietsStatusFilter').value;
    var lijst = document.getElementById('fietsenLijst');
    if (!lijst) return;
    
    if (alleFietsen.length === 0) {
        try {
            const { data, error } = await window.supabaseClient
                .from('individuele_fietsen')
                .select('*, fiets_modellen (merk, model, kleur)')
                .order('aangemaakt_op', { ascending: false });
            
            if (error) throw error;
            alleFietsen = data || [];
        } catch (error) {
            console.error('❌ Fout bij laden:', error);
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>';
            return;
        }
    }
    
    var gefilterd = alleFietsen;
    
    if (zoekTerm) {
        gefilterd = gefilterd.filter(function(fiets) {
            var modelInfo = fiets.fiets_modellen || { merk: '', model: '', kleur: '' };
            var zoekString = (fiets.serienummer + ' ' + modelInfo.merk + ' ' + modelInfo.model + ' ' + modelInfo.kleur).toLowerCase();
            return zoekString.includes(zoekTerm);
        });
    }
    
    if (statusFilter) {
        gefilterd = gefilterd.filter(function(fiets) { return fiets.status === statusFilter; });
    }
    
    if (gefilterd.length === 0) {
        lijst.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
                <h3>Geen fietsen gevonden</h3>
                <p style="color: #999;">Probeer een andere zoekterm of reset de filter.</p>
            </div>
        `;
        return;
    }
    
    toonFietsenLijst(gefilterd, 'Totaal: ' + gefilterd.length + ' fietsen (gefilterd)');
}

function resetFietsFilter() {
    document.getElementById('fietsZoekInput').value = '';
    document.getElementById('fietsStatusFilter').value = '';
    alleFietsen = [];
    loadFietsen();
}

function toonFietsenLijst(data, footerText) {
    var lijst = document.getElementById('fietsenLijst');
    if (!lijst) return;
    
    var html = `
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Serienummer</th>
                        <th>Model</th>
                        <th>Kleur</th>
                        <th>Status</th>
                        <th style="text-align:center;">QR-code</th>
                        <th style="text-align:center;">Acties</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(function(fiets) {
        var statusClass = fiets.status === 'beschikbaar' ? 'badge-available' :
                           fiets.status === 'verhuurd' ? 'badge-rented' : 'badge-maintenance';
        var modelInfo = fiets.fiets_modellen || { merk: '-', model: '-', kleur: '-' };
        
        html += `
            <tr id="fiets-${fiets.id}">
                <td><strong id="fiets-serie-${fiets.id}">${fiets.serienummer}</strong></td>
                <td>${modelInfo.merk} ${modelInfo.model}</td>
                <td><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${modelInfo.kleur.toLowerCase()};border:1px solid #ddd;vertical-align:middle;margin-right:5px;"></span> ${modelInfo.kleur}</td>
                <td><span class="badge ${statusClass}" id="fiets-status-${fiets.id}">${fiets.status}</span></td>
                <td style="text-align:center;">
                    <button onclick="window.showQRCode('${fiets.serienummer}')" 
                            style="background:none;border:none;cursor:pointer;font-size:1.2rem;"
                            title="Klik om QR-code te bekijken">
                        📱
                    </button>
                </td>
                <td style="text-align:center;">
                    <button class="btn btn-sm btn-primary" onclick="window.editFiets('${fiets.id}')" style="margin-right:5px;">
                        ✏️ Bewerken
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.deleteFiets('${fiets.id}')">
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
            ${footerText || 'Totaal: ' + data.length + ' fietsen'}
        </p>
    `;
    
    lijst.innerHTML = html;
}

// ============================================
// FIETS BEWERKEN
// ============================================

function editFiets(fietsId) {
    console.log('✏️ Bewerken van fiets:', fietsId);
    
    var row = document.getElementById('fiets-' + fietsId);
    if (!row) {
        showMessage('Fiets niet gevonden!');
        return;
    }
    
    var serieCell = document.getElementById('fiets-serie-' + fietsId);
    var huidigSerienummer = serieCell ? serieCell.textContent.trim() : '';
    
    var statusCell = document.getElementById('fiets-status-' + fietsId);
    var huidigeStatus = statusCell ? statusCell.textContent.trim() : 'beschikbaar';
    
    if (serieCell) {
        serieCell.innerHTML = `
            <input type="text" id="edit-serie-${fietsId}" value="${huidigSerienummer}" 
                   class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;" required>
        `;
    }
    
    if (statusCell) {
        statusCell.innerHTML = `
            <select id="edit-status-${fietsId}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid #ddd;border-radius:4px;">
                <option value="beschikbaar" ${huidigeStatus === 'beschikbaar' ? 'selected' : ''}>Beschikbaar</option>
                <option value="verhuurd" ${huidigeStatus === 'verhuurd' ? 'selected' : ''}>Verhuurd</option>
                <option value="in-onderhoud" ${huidigeStatus === 'in-onderhoud' ? 'selected' : ''}>In onderhoud</option>
            </select>
        `;
    }
    
    var actieCell = row.querySelector('td:last-child');
    if (actieCell) {
        actieCell.innerHTML = `
            <button class="btn btn-sm btn-success" onclick="window.saveFiets('${fietsId}')" style="margin-right:5px;">
                💾 Opslaan
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.loadFietsen()">
                ❌ Annuleren
            </button>
        `;
    }
}

// ============================================
// FIETS OPSLAAN
// ============================================

async function saveFiets(fietsId) {
    console.log('💾 Opslaan van fiets:', fietsId);
    
    var serieInput = document.getElementById('edit-serie-' + fietsId);
    var statusSelect = document.getElementById('edit-status-' + fietsId);
    
    if (!serieInput || !statusSelect) {
        showMessage('Fout: kan velden niet vinden.');
        return;
    }
    
    var serienummer = serieInput.value.trim();
    var status = statusSelect.value;
    
    if (!serienummer) {
        showMessage('❌ Serienummer is verplicht!');
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('individuele_fietsen')
            .update({ serienummer: serienummer, status: status })
            .eq('id', fietsId);
        
        if (error) throw error;
        
        showMessage('✅ Fiets succesvol bijgewerkt!');
        loadFietsen();
        loadStats();
        
    } catch (error) {
        console.error('❌ Fout bij opslaan:', error);
        showMessage('❌ Fout: ' + error.message);
    }
}

// ============================================
// FIETS VERWIJDEREN
// ============================================

async function deleteFiets(fietsId) {
    console.log('🗑️ Verwijderen van fiets:', fietsId);
    
    if (!confirm('Weet je zeker dat je deze fiets wilt verwijderen?\n\nLet op: Als er verhuur aan deze fiets is gekoppeld, kan dit niet!')) {
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('individuele_fietsen')
            .delete()
            .eq('id', fietsId);
        
        if (error) throw error;
        
        showMessage('✅ Fiets succesvol verwijderd!');
        loadFietsen();
        loadStats();
        
    } catch (error) {
        console.error('❌ Fout bij verwijderen:', error);
        
        if (error.message && error.message.includes('foreign key')) {
            showMessage('❌ Deze fiets kan niet worden verwijderd omdat er nog verhuur aan is gekoppeld.');
        } else {
            showMessage('❌ Fout: ' + error.message);
        }
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
    var serienummer = document.getElementById('fietsSerienummer').value.trim();
    var modelId = document.getElementById('fietsModelSelect').value;
    var status = document.getElementById('fietsStatus').value;
    var messageDiv = document.getElementById('fietsFormMessage');
    var button = event.target.querySelector('button[type="submit"]');
    var originalText = button.textContent;
    
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
        
        messageDiv.innerHTML = '<p style="color: #28a745;">✅ Fiets ' + serienummer + ' succesvol toegevoegd!</p>';
        document.getElementById('fietsForm').reset();
        
        setTimeout(function() {
            hideAddFietsForm();
            loadFietsen();
            loadStats();
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout: ' + error.message + '</p>';
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// FIETSEN EXCEL IMPORT
// ============================================

var fietsExcelData = [];
var fietsExcelHeaders = [];

function showFietsExcelImport() {
    var modal = document.getElementById('fietsExcelImportModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    document.getElementById('fietsExcelImportStatus').innerHTML = '';
    document.getElementById('fietsExcelPreview').style.display = 'none';
    document.getElementById('fietsExcelImportBtn').style.display = 'none';
    fietsExcelData = [];
    fietsExcelHeaders = [];
}

function closeFietsExcelImport() {
    var modal = document.getElementById('fietsExcelImportModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.getElementById('fietsExcelFileInput').value = '';
}

function handleFietsExcelFile(event) {
    var file = event.target.files[0];
    if (!file) return;
    processFietsExcelFile(file);
}

function handleFietsExcelDrop(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    if (!file) return;
    processFietsExcelFile(file);
}

function processFietsExcelFile(file) {
    var reader = new FileReader();
    var statusDiv = document.getElementById('fietsExcelImportStatus');
    
    statusDiv.innerHTML = '<p style="color: #666;">⏳ Bestand wordt gelezen...</p>';
    
    reader.onload = function(e) {
        try {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            
            var sheetNames = workbook.SheetNames;
            var sheetName = sheetNames[0];
            
            if (sheetNames.includes('stocklijst')) {
                sheetName = 'stocklijst';
                console.log('✅ Tabblad "stocklijst" gevonden, gebruiken deze.');
            } else {
                console.log('ℹ️ Gebruik tabblad:', sheetName);
            }
            
            var sheet = workbook.Sheets[sheetName];
            var rawData = XLSX.utils.sheet_to_json(sheet);
            
            if (!rawData || rawData.length === 0) {
                statusDiv.innerHTML = '<p style="color: #dc3545;">❌ Geen data gevonden in tabblad "' + sheetName + '".</p>';
                return;
            }
            
            // Kolomnamen schoonmaken
            var cleanData = rawData.map(function(row) {
                var cleanRow = {};
                for (var key in row) {
                    if (row.hasOwnProperty(key)) {
                        var cleanKey = key.trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '').trim();
                        if (!cleanKey) cleanKey = key.trim();
                        cleanRow[cleanKey] = row[key];
                    }
                }
                return cleanRow;
            });
            
            fietsExcelHeaders = Object.keys(cleanData[0] || {});
            fietsExcelData = cleanData;
            
            console.log('📋 Originele kolommen:', Object.keys(rawData[0] || {}));
            console.log('📋 Schoongemaakte kolommen:', fietsExcelHeaders);
            
            showFietsExcelPreview(cleanData, sheetName);
            
            statusDiv.innerHTML = `
                <p style="color: #28a745;">✅ ${cleanData.length} fietsen gevonden in tabblad "${sheetName}".</p>
                <p style="color: #666; font-size:0.85rem;">Kolommen: ${fietsExcelHeaders.join(', ')}</p>
            `;
            
            document.getElementById('fietsExcelImportBtn').style.display = 'inline-block';
            
        } catch (error) {
            console.error('❌ Fout bij lezen Excel:', error);
            statusDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout bij lezen: ' + error.message + '</p>';
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function showFietsExcelPreview(data, sheetName) {
    var previewDiv = document.getElementById('fietsExcelPreview');
    var contentDiv = document.getElementById('fietsExcelPreviewContent');
    
    if (!previewDiv || !contentDiv) return;
    
    var previewData = data.slice(0, 10);
    
    var html = '<p style="color: #666; font-size:0.9rem; margin-bottom:10px;">📋 Tabblad: <strong>' + (sheetName || 'Onbekend') + '</strong></p>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr style="background:#1A2B4C;color:white;">';
    
    fietsExcelHeaders.forEach(function(header) {
        html += '<th style="padding:8px 12px;text-align:left;white-space:nowrap;">' + header + '</th>';
    });
    
    html += '</tr></thead><tbody>';
    
    previewData.forEach(function(row) {
        html += '<tr>';
        fietsExcelHeaders.forEach(function(header) {
            var value = row[header] || '';
            html += '<td style="padding:6px 12px;border-bottom:1px solid #eee;">' + value + '</td>';
        });
        html += '</tr>';
    });
    
    if (data.length > 10) {
        html += '<tr><td colspan="' + fietsExcelHeaders.length + '" style="padding:8px 12px;color:#999;font-style:italic;">... en ' + (data.length - 10) + ' rijen meer</td></tr>';
    }
    
    html += '</tbody></table>';
    contentDiv.innerHTML = html;
    previewDiv.style.display = 'block';
}

async function importFietsExcelData() {
    if (!fietsExcelData || fietsExcelData.length === 0) {
        alert('❌ Geen data om te importeren.');
        return;
    }
    
    var statusDiv = document.getElementById('fietsExcelImportStatus');
    var importBtn = document.getElementById('fietsExcelImportBtn');
    
    console.log('📋 Kolommen voor import:', fietsExcelHeaders);
    
    if (!confirm('Weet je zeker dat je ' + fietsExcelData.length + ' fietsen wilt importeren?')) {
        return;
    }
    
    importBtn.disabled = true;
    importBtn.textContent = '⏳ Bezig...';
    statusDiv.innerHTML = '<p style="color: #666;">⏳ Bezig met importeren...</p>';
    
    var successCount = 0;
    var errorCount = 0;
    var errors = [];
    var newModels = [];
    var matchedModels = [];
    
    try {
        // ============================================
        // HAAL ALLE BESTAANDE MODELLEN OP
        // ============================================
        const { data: bestaandeModellen, error: modellenError } = await window.supabaseClient
            .from('fiets_modellen')
            .select('*');
        
        if (modellenError) throw modellenError;
        
        // ============================================
        // HAAL ALLE BESTAANDE FIETSEN OP (VOOR DUPLICATE CHECK)
        // ============================================
        const { data: bestaandeFietsen, error: fietsenError } = await window.supabaseClient
            .from('individuele_fietsen')
            .select('serienummer');
        
        if (fietsenError) throw fietsenError;
        
        var bestaandeSerienummers = new Set(bestaandeFietsen.map(function(f) { return f.serienummer; }));
        
        // ============================================
        // HAAL ALLE KLANTEN OP (VOOR KOPPELING)
        // ============================================
        const { data: alleKlanten, error: klantenError } = await window.supabaseClient
            .from('klanten')
            .select('id, naam');
        
        if (klantenError) throw klantenError;
        
        // ============================================
        // MAP VOOR UNIEKE MODELLEN (VERMIJD DUPLICATEN)
        // ============================================
        var modelCache = {};
        var modelIdMap = {};
        
        // Bouw een cache van bestaande modellen op basis van "merk|model|kleur"
        bestaandeModellen.forEach(function(model) {
            var key = (model.merk + '|' + model.model + '|' + (model.kleur || '')).toLowerCase();
            modelCache[key] = model.id;
        });
        
        for (var i = 0; i < fietsExcelData.length; i++) {
            var row = fietsExcelData[i];
            
            // ============================================
            // 1. SERIENUMMER
            // ============================================
            var serienummer = null;
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('serienummer') || key.toLowerCase().includes('serie')) {
                        if (row[key] && row[key] !== '') {
                            serienummer = String(row[key]).trim();
                            break;
                        }
                    }
                }
            }
            
            if (!serienummer) {
                errorCount++;
                errors.push('Rij ' + (i + 1) + ': Geen serienummer gevonden');
                continue;
            }
            
            if (bestaandeSerienummers.has(serienummer)) {
                errorCount++;
                errors.push('Rij ' + (i + 1) + ': Serienummer ' + serienummer + ' bestaat al');
                continue;
            }
            
            // ============================================
            // 2. TYPE/MODEL
            // ============================================
            var type = null;
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('type') || key.toLowerCase().includes('model')) {
                        if (row[key] && row[key] !== '') {
                            type = String(row[key]).trim();
                            break;
                        }
                    }
                }
            }
            
            // ============================================
            // 3. KLEUR
            // ============================================
            var kleur = null;
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('kleur') || key.toLowerCase().includes('color')) {
                        if (row[key] && row[key] !== '') {
                            kleur = String(row[key]).trim();
                            break;
                        }
                    }
                }
            }
            
            // ============================================
            // 4. MERK
            // ============================================
            var merk = 'WOOM';
            if (type) {
                var typeParts = type.split(' ');
                if (typeParts.length > 0 && typeParts[0].length > 0) {
                    // Controleer of het eerste deel een merk is (WOOM, Panta, etc.)
                    var possibleMerk = typeParts[0].toUpperCase();
                    if (possibleMerk === 'WOOM' || possibleMerk === 'PANTA' || possibleMerk === 'CUBE' || possibleMerk === 'SCOTT') {
                        merk = possibleMerk;
                    }
                }
            }
            
            // ============================================
            // 5. MODEL ID - CHECK OF MODEL AL BESTAAT
            // ============================================
            var modelKey = (merk + '|' + type + '|' + (kleur || '')).toLowerCase();
            var modelId = null;
            
            // Kijk of het model al in de cache zit
            if (modelCache[modelKey]) {
                modelId = modelCache[modelKey];
                matchedModels.push(merk + ' - ' + type + ' (' + (kleur || 'Onbekend') + ')');
            } else if (type) {
                // Model bestaat nog niet, maak een nieuwe aan
                var modelKleur = kleur || 'Onbekend';
                const { data: newModel, error: newModelError } = await window.supabaseClient
                    .from('fiets_modellen')
                    .insert([{ 
                        merk: merk, 
                        model: type, 
                        kleur: modelKleur
                    }])
                    .select();
                
                if (newModelError) {
                    errorCount++;
                    errors.push('Rij ' + (i + 1) + ': Fout bij aanmaken model: ' + newModelError.message);
                    continue;
                }
                modelId = newModel[0].id;
                // Sla het nieuwe model op in de cache
                modelCache[modelKey] = modelId;
                newModels.push(merk + ' - ' + type + ' (' + modelKleur + ')');
            } else {
                errorCount++;
                errors.push('Rij ' + (i + 1) + ': Geen type/model gevonden');
                continue;
            }
            
            // ============================================
            // 6. STATUS
            // ============================================
            var statusRaw = '';
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('status') || key.toLowerCase().includes('conditie')) {
                        if (row[key] && row[key] !== '') {
                            statusRaw = String(row[key]).toLowerCase().trim();
                            break;
                        }
                    }
                }
            }
            
            var fietsStatus = 'beschikbaar';
            if (statusRaw.includes('verhuurd') || statusRaw.includes('huur')) {
                fietsStatus = 'verhuurd';
            } else if (statusRaw.includes('onderhoud') || statusRaw.includes('reparatie') || statusRaw.includes('kapot')) {
                fietsStatus = 'in-onderhoud';
            }
            
            // ============================================
            // 7. KLANT KOPPELING
            // ============================================
            var klantId = null;
            var klantNaam = null;
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('klant')) {
                        if (row[key] && row[key] !== '') {
                            klantNaam = String(row[key]).trim();
                            break;
                        }
                    }
                }
            }
            
            if (klantNaam) {
                var klantMatch = alleKlanten.find(function(k) {
                    return k.naam.toLowerCase().includes(klantNaam.toLowerCase()) ||
                           klantNaam.toLowerCase().includes(k.naam.toLowerCase());
                });
                if (klantMatch) {
                    klantId = klantMatch.id;
                }
            }
            
            // ============================================
            // 8. NOTITIES
            // ============================================
            var notities = '';
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('notitie') || key.toLowerCase().includes('opmerking')) {
                        if (row[key] && row[key] !== '') {
                            notities = String(row[key]).trim();
                            break;
                        }
                    }
                }
            }
            
            var oorsprongSerie = '';
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('oorsprong') && key.toLowerCase().includes('serie')) {
                        if (row[key] && row[key] !== '') {
                            oorsprongSerie = String(row[key]).trim();
                            break;
                        }
                    }
                }
            }
            
            if (oorsprongSerie) {
                notities = notities ? notities + ' | Oorsprong: ' + oorsprongSerie : 'Oorsprong: ' + oorsprongSerie;
            }
            
            // ============================================
            // 9. AANKOOP DATUM
            // ============================================
            var aankoopDatum = null;
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if (key.toLowerCase().includes('aangekocht') || key.toLowerCase().includes('aankoop') || key.toLowerCase().includes('datum')) {
                        if (row[key] && row[key] !== '') {
                            try {
                                var datum = new Date(row[key]);
                                if (!isNaN(datum)) {
                                    aankoopDatum = datum.toISOString().split('T')[0];
                                }
                            } catch (e) {}
                            break;
                        }
                    }
                }
            }
            
            // ============================================
            // 10. FIETS OPSLAAN
            // ============================================
            const { error: fietsError } = await window.supabaseClient
                .from('individuele_fietsen')
                .insert([{
                    serienummer: serienummer,
                    model_id: modelId,
                    status: fietsStatus,
                    huidige_klant_id: klantId || null,
                    opmerkingen: notities || null,
                    aankoop_datum: aankoopDatum || null,
                    qr_code: 'https://therealmookey.github.io/PantaClubreg/fiets/' + serienummer
                }]);
            
            if (fietsError) {
                errorCount++;
                errors.push('Rij ' + (i + 1) + ': ' + fietsError.message);
            } else {
                successCount++;
                bestaandeSerienummers.add(serienummer);
            }
        }
        
        // ============================================
        // RESULTAAT TONEN
        // ============================================
        var resultMessage = '✅ ' + successCount + ' fietsen succesvol geïmporteerd.';
        if (newModels.length > 0) {
            resultMessage += '\n📦 Nieuwe modellen aangemaakt: ' + newModels.length;
            // Toon welke modellen zijn aangemaakt
            resultMessage += '\n   ' + newModels.slice(0, 5).join(', ') + (newModels.length > 5 ? '... en ' + (newModels.length - 5) + ' meer' : '');
        }
        if (matchedModels.length > 0) {
            resultMessage += '\n🔗 Bestaande modellen gebruikt: ' + matchedModels.length;
        }
        if (errorCount > 0) {
            resultMessage += '\n⚠️ ' + errorCount + ' fouten: ' + errors.slice(0, 5).join('; ') + (errors.length > 5 ? '... en ' + (errors.length - 5) + ' meer' : '');
        }
        
        statusDiv.innerHTML = '<p style="color: ' + (errorCount > 0 && successCount === 0 ? '#dc3545' : errorCount > 0 ? '#ffc107' : '#28a745') + ';">' + resultMessage + '</p>';
        
        if (successCount > 0) {
            loadFietsen();
            loadStats();
        }
        
        if (errorCount === 0) {
            setTimeout(function() {
                closeFietsExcelImport();
            }, 3000);
        }
        
    } catch (error) {
        console.error('❌ Fout bij importeren:', error);
        statusDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout: ' + error.message + '</p>';
    } finally {
        importBtn.disabled = false;
        importBtn.textContent = '💾 Importeer data';
    }
}

// ============================================
// KLANTEN FUNCTIES
// ============================================

var alleKlanten = [];

function showAddKlantForm() {
    var form = document.getElementById('addKlantForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideAddKlantForm() {
    var form = document.getElementById('addKlantForm');
    if (form) {
        form.style.display = 'none';
    }
    var message = document.getElementById('klantFormMessage');
    if (message) {
        message.innerHTML = '';
    }
    var formElement = document.getElementById('klantForm');
    if (formElement) {
        formElement.reset();
    }
}

async function loadKlanten() {
    console.log('📥 Laden van klanten...');
    alleKlanten = [];
    
    var lijst = document.getElementById('klantenLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>';
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('klanten')
            .select('*')
            .order('naam', { ascending: true });
        
        if (error) throw error;
        
        alleKlanten = data || [];
        
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
        
        toonKlantenLijst(data);
    } catch (error) {
        console.error('❌ Fout bij laden klanten:', error);
        lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>';
    }
}

async function filterKlanten() {
    var zoekTerm = document.getElementById('klantZoekInput').value.toLowerCase().trim();
    var lijst = document.getElementById('klantenLijst');
    if (!lijst) return;
    
    if (alleKlanten.length === 0) {
        try {
            const { data, error } = await window.supabaseClient
                .from('klanten')
                .select('*')
                .order('naam', { ascending: true });
            
            if (error) throw error;
            alleKlanten = data || [];
        } catch (error) {
            console.error('❌ Fout bij laden:', error);
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>';
            return;
        }
    }
    
    var gefilterd = alleKlanten;
    
    if (zoekTerm) {
        gefilterd = gefilterd.filter(function(klant) {
            var zoekString = (klant.naam + ' ' + (klant.email || '') + ' ' + (klant.telefoon || '') + ' ' + (klant.adres || '')).toLowerCase();
            return zoekString.includes(zoekTerm);
        });
    }
    
    if (gefilterd.length === 0) {
        lijst.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
                <h3>Geen klanten gevonden</h3>
                <p style="color: #999;">Probeer een andere zoekterm of reset de filter.</p>
            </div>
        `;
        return;
    }
    
    toonKlantenLijst(gefilterd, 'Totaal: ' + gefilterd.length + ' klanten (gefilterd)');
}

function resetKlantFilter() {
    document.getElementById('klantZoekInput').value = '';
    alleKlanten = [];
    loadKlanten();
}

function toonKlantenLijst(data, footerText) {
    var lijst = document.getElementById('klantenLijst');
    if (!lijst) return;
    
    var html = `
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
    
    data.forEach(function(klant) {
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
            ${footerText || 'Totaal: ' + data.length + ' klanten'}
        </p>
    `;
    
    lijst.innerHTML = html;
}

// ============================================
// KLANT BEWERKEN
// ============================================

function editKlant(klantId) {
    console.log('✏️ Bewerken van klant:', klantId);
    
    var row = document.getElementById('klant-' + klantId);
    if (!row) {
        showMessage('Klant niet gevonden!');
        return;
    }
    
    var cells = row.querySelectorAll('td');
    var naam = cells[0].textContent.trim();
    var email = cells[1].textContent.trim() === '-' ? '' : cells[1].textContent.trim();
    var telefoon = cells[2].textContent.trim() === '-' ? '' : cells[2].textContent.trim();
    var adres = cells[3].textContent.trim() === '-' ? '' : cells[3].textContent.trim();
    
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
    
    var naamInput = document.getElementById('edit-naam-' + klantId);
    var emailInput = document.getElementById('edit-email-' + klantId);
    var telefoonInput = document.getElementById('edit-telefoon-' + klantId);
    var adresInput = document.getElementById('edit-adres-' + klantId);
    
    if (!naamInput) {
        showMessage('Fout: kan velden niet vinden.');
        return;
    }
    
    var naam = naamInput.value.trim();
    var email = emailInput.value.trim();
    var telefoon = telefoonInput.value.trim();
    var adres = adresInput.value.trim();
    
    if (!naam) {
        showMessage('❌ Naam is verplicht!');
        return;
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('klanten')
            .update({ naam: naam, email: email, telefoon: telefoon, adres: adres })
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
// KLANT SUBMIT
// ============================================

document.addEventListener('submit', async function(event) {
    if (event.target.id === 'klantForm') {
        event.preventDefault();
        await handleKlantSubmit(event);
    }
});

async function handleKlantSubmit(event) {
    var naam = document.getElementById('klantNaam').value.trim();
    var email = document.getElementById('klantEmail').value.trim();
    var telefoon = document.getElementById('klantTelefoon').value.trim();
    var adres = document.getElementById('klantAdres').value.trim();
    var messageDiv = document.getElementById('klantFormMessage');
    var button = event.target.querySelector('button[type="submit"]');
    var originalText = button.textContent;
    
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
            .insert([{ naam: naam, email: email, telefoon: telefoon, adres: adres }]);
        
        if (error) throw error;
        
        messageDiv.innerHTML = '<p style="color: #28a745;">✅ Klant ' + naam + ' succesvol toegevoegd!</p>';
        document.getElementById('klantForm').reset();
        
        setTimeout(function() {
            hideAddKlantForm();
            loadKlanten();
            loadStats();
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout: ' + error.message + '</p>';
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// EXCEL IMPORT - KLANTEN
// ============================================

var excelData = [];
var excelHeaders = [];

function showExcelImport() {
    var modal = document.getElementById('excelImportModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    document.getElementById('excelImportStatus').innerHTML = '';
    document.getElementById('excelPreview').style.display = 'none';
    document.getElementById('excelImportBtn').style.display = 'none';
    excelData = [];
    excelHeaders = [];
}

function closeExcelImport() {
    var modal = document.getElementById('excelImportModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.getElementById('excelFileInput').value = '';
}

function handleExcelFile(event) {
    var file = event.target.files[0];
    if (!file) return;
    processExcelFile(file);
}

function handleExcelDrop(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    if (!file) return;
    processExcelFile(file);
}

function processExcelFile(file) {
    var reader = new FileReader();
    var statusDiv = document.getElementById('excelImportStatus');
    
    statusDiv.innerHTML = '<p style="color: #666;">⏳ Bestand wordt gelezen...</p>';
    
    reader.onload = function(e) {
        try {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            var jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            if (!jsonData || jsonData.length === 0) {
                statusDiv.innerHTML = '<p style="color: #dc3545;">❌ Geen data gevonden in het bestand.</p>';
                return;
            }
            
            excelHeaders = Object.keys(jsonData[0]);
            excelData = jsonData;
            
            showExcelPreview(jsonData);
            
            statusDiv.innerHTML = `
                <p style="color: #28a745;">✅ ${jsonData.length} rijen gevonden.</p>
                <p style="color: #666; font-size:0.85rem;">Kolommen: ${excelHeaders.join(', ')}</p>
            `;
            
            document.getElementById('excelImportBtn').style.display = 'inline-block';
            
        } catch (error) {
            console.error('❌ Fout bij lezen Excel:', error);
            statusDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout bij lezen: ' + error.message + '</p>';
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function showExcelPreview(data) {
    var previewDiv = document.getElementById('excelPreview');
    var contentDiv = document.getElementById('excelPreviewContent');
    
    if (!previewDiv || !contentDiv) return;
    
    var previewData = data.slice(0, 10);
    
    var html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr style="background:#1A2B4C;color:white;">';
    excelHeaders.forEach(function(header) {
        html += '<th style="padding:8px 12px;text-align:left;white-space:nowrap;">' + header + '</th>';
    });
    html += '</tr></thead><tbody>';
    
    previewData.forEach(function(row) {
        html += '<tr>';
        excelHeaders.forEach(function(header) {
            var value = row[header] || '';
            html += '<td style="padding:6px 12px;border-bottom:1px solid #eee;">' + value + '</td>';
        });
        html += '</tr>';
    });
    
    if (data.length > 10) {
        html += '<tr><td colspan="' + excelHeaders.length + '" style="padding:8px 12px;color:#999;font-style:italic;">... en ' + (data.length - 10) + ' rijen meer</td></tr>';
    }
    
    html += '</tbody></table>';
    contentDiv.innerHTML = html;
    previewDiv.style.display = 'block';
}

async function importExcelData() {
    if (!excelData || excelData.length === 0) {
        alert('❌ Geen data om te importeren.');
        return;
    }
    
    var statusDiv = document.getElementById('excelImportStatus');
    var importBtn = document.getElementById('excelImportBtn');
    
    var gevondenKolommen = excelHeaders.join(', ');
    if (!confirm('Weet je zeker dat je ' + excelData.length + ' klanten wilt importeren?\n\nGevonden kolommen: ' + gevondenKolommen)) {
        return;
    }
    
    importBtn.disabled = true;
    importBtn.textContent = '⏳ Bezig...';
    statusDiv.innerHTML = '<p style="color: #666;">⏳ Bezig met importeren...</p>';
    
    var successCount = 0;
    var errorCount = 0;
    var errors = [];
    var skippedCount = 0;
    
    try {
        const { data: bestaandeKlanten, error: klantenError } = await window.supabaseClient
            .from('klanten')
            .select('email');
        
        if (klantenError) throw klantenError;
        
        var bestaandeEmails = new Set(bestaandeKlanten.map(function(k) { return k.email; }).filter(Boolean));
        
        for (var i = 0; i < excelData.length; i++) {
            var row = excelData[i];
            
            var firstName = row.first_name || '';
            var lastName = row.last_name || '';
            var naam = (firstName + ' ' + lastName).trim();
            var email = row.email ? String(row.email).trim() : null;
            var telefoon = row.phone ? String(row.phone).trim() : null;
            
            var adres1 = row.default_shipping_address_1 || '';
            var adres2 = row.default_shipping_address_2 || '';
            var stad = row.default_shipping_city || '';
            var postcode = row.default_shipping_zip || '';
            var provincie = row.default_shipping_province || '';
            var land = row.default_shipping_country || '';
            
            var adresParts = [adres1, adres2];
            if (postcode) adresParts.push(postcode);
            if (stad) adresParts.push(stad);
            if (provincie) adresParts.push(provincie);
            if (land) adresParts.push(land);
            
            var adres = adresParts.filter(Boolean).join(', ') || null;
            
            if (!naam) {
                errorCount++;
                errors.push('Rij ' + (i + 1) + ': Geen naam gevonden');
                continue;
            }
            
            if (email && bestaandeEmails.has(email)) {
                skippedCount++;
                errors.push('Rij ' + (i + 1) + ': Email ' + email + ' bestaat al (overgeslagen)');
                continue;
            }
            
            const { error } = await window.supabaseClient
                .from('klanten')
                .insert([{
                    naam: naam,
                    email: email || null,
                    telefoon: telefoon || null,
                    adres: adres || null
                }]);
            
            if (error) {
                errorCount++;
                errors.push('Rij ' + (i + 1) + ': ' + error.message);
            } else {
                successCount++;
                if (email) bestaandeEmails.add(email);
            }
        }
        
        var resultMessage = '✅ ' + successCount + ' klanten succesvol geïmporteerd.';
        if (skippedCount > 0) {
            resultMessage += '\n⏭️ ' + skippedCount + ' klanten overgeslagen (dubbele email).';
        }
        if (errorCount > 0) {
            resultMessage += '\n⚠️ ' + errorCount + ' fouten: ' + errors.slice(0, 5).join('; ') + (errors.length > 5 ? '... en ' + (errors.length - 5) + ' meer' : '');
        }
        
        statusDiv.innerHTML = '<p style="color: ' + (errorCount > 0 && successCount === 0 ? '#dc3545' : errorCount > 0 ? '#ffc107' : '#28a745') + ';">' + resultMessage + '</p>';
        
        if (successCount > 0) {
            loadKlanten();
            loadStats();
        }
        
        if (errorCount === 0 && skippedCount === 0) {
            setTimeout(function() {
                closeExcelImport();
            }, 3000);
        }
        
    } catch (error) {
        console.error('❌ Fout bij importeren:', error);
        statusDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout: ' + error.message + '</p>';
    } finally {
        importBtn.disabled = false;
        importBtn.textContent = '💾 Importeer data';
    }
}

// ============================================
// VERHUUR FUNCTIES
// ============================================

var alleVerhuur = [];

function showAddVerhuurForm() {
    var form = document.getElementById('addVerhuurForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        loadVerhuurSelectOptions();
    }
}

function hideAddVerhuurForm() {
    var form = document.getElementById('addVerhuurForm');
    if (form) {
        form.style.display = 'none';
    }
    var message = document.getElementById('verhuurFormMessage');
    if (message) {
        message.innerHTML = '';
    }
    var formElement = document.getElementById('verhuurForm');
    if (formElement) {
        formElement.reset();
    }
}

async function loadVerhuurSelectOptions() {
    var fietsSelect = document.getElementById('verhuurFiets');
    var klantSelect = document.getElementById('verhuurKlant');
    
    if (fietsSelect) {
        try {
            const { data, error } = await window.supabaseClient
                .from('individuele_fietsen')
                .select('id, serienummer, fiets_modellen (merk, model, kleur)')
                .eq('status', 'beschikbaar')
                .order('serienummer', { ascending: true });
            
            if (!error && data) {
                fietsSelect.innerHTML = '<option value="">-- Selecteer een fiets --</option>';
                data.forEach(function(fiets) {
                    var modelInfo = fiets.fiets_modellen || { merk: '', model: '', kleur: '' };
                    var label = fiets.serienummer + ' - ' + modelInfo.merk + ' ' + modelInfo.model + ' (' + modelInfo.kleur + ')';
                    var option = document.createElement('option');
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
                data.forEach(function(klant) {
                    var option = document.createElement('option');
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
    alleVerhuur = [];
    
    var lijst = document.getElementById('verhuurLijst');
    if (!lijst) return;
    
    try {
        if (!window.supabaseClient) {
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Geen verbinding</h3></div>';
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
        
        alleVerhuur = data || [];
        
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
        
        toonVerhuurLijst(data);
    } catch (error) {
        console.error('❌ Fout bij laden verhuur:', error);
        lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>';
    }
}

async function filterVerhuur() {
    var zoekTerm = document.getElementById('verhuurZoekInput').value.toLowerCase().trim();
    var statusFilter = document.getElementById('verhuurStatusFilter').value;
    var lijst = document.getElementById('verhuurLijst');
    if (!lijst) return;
    
    if (alleVerhuur.length === 0) {
        try {
            const { data, error } = await window.supabaseClient
                .from('verhuur_historiek')
                .select(`
                    *,
                    individuele_fietsen (serienummer, fiets_modellen (merk, model, kleur)),
                    klanten (naam, email, telefoon)
                `)
                .order('start_datum', { ascending: false });
            
            if (error) throw error;
            alleVerhuur = data || [];
        } catch (error) {
            console.error('❌ Fout bij laden:', error);
            lijst.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><h3>❌ Fout bij laden</h3></div>';
            return;
        }
    }
    
    var gefilterd = alleVerhuur;
    
    if (zoekTerm) {
        gefilterd = gefilterd.filter(function(verhuur) {
            var fietsInfo = verhuur.individuele_fietsen || { serienummer: '' };
            var modelInfo = fietsInfo.fiets_modellen || { merk: '', model: '' };
            var klantInfo = verhuur.klanten || { naam: '' };
            var zoekString = (fietsInfo.serienummer + ' ' + modelInfo.merk + ' ' + modelInfo.model + ' ' + klantInfo.naam).toLowerCase();
            return zoekString.includes(zoekTerm);
        });
    }
    
    if (statusFilter === 'actief') {
        gefilterd = gefilterd.filter(function(v) { return !v.eind_datum; });
    } else if (statusFilter === 'afgerond') {
        gefilterd = gefilterd.filter(function(v) { return v.eind_datum; });
    }
    
    if (gefilterd.length === 0) {
        lijst.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
                <h3>Geen verhuur gevonden</h3>
                <p style="color: #999;">Probeer een andere zoekterm of reset de filter.</p>
            </div>
        `;
        return;
    }
    
    toonVerhuurLijst(gefilterd, 'Totaal: ' + gefilterd.length + ' verhuurregels (gefilterd)');
}

function resetVerhuurFilter() {
    document.getElementById('verhuurZoekInput').value = '';
    document.getElementById('verhuurStatusFilter').value = '';
    alleVerhuur = [];
    loadVerhuur();
}

function toonVerhuurLijst(data, footerText) {
    var lijst = document.getElementById('verhuurLijst');
    if (!lijst) return;
    
    var html = `
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Fiets</th>
                        <th>Klant</th>
                        <th>Start</th>
                        <th>Eind</th>
                        <th>Dagen in bezit</th>
                        <th>Status</th>
                        <th style="text-align:center;">Acties</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(function(verhuur) {
        var fietsInfo = verhuur.individuele_fietsen || { serienummer: 'Onbekend', fiets_modellen: { merk: '', model: '', kleur: '' } };
        var modelInfo = fietsInfo.fiets_modellen || { merk: '', model: '', kleur: '' };
        var klantInfo = verhuur.klanten || { naam: 'Onbekend' };
        
        var isActief = !verhuur.eind_datum;
        var statusClass = isActief ? 'badge-rented' : 'badge-available';
        var statusText = isActief ? '🔴 Actief' : '✅ Afgerond';
        
        var startDatum = new Date(verhuur.start_datum);
        var eindDatum = verhuur.eind_datum ? new Date(verhuur.eind_datum) : new Date();
        
        var tijdVerschil = eindDatum - startDatum;
        var dagenInBezit = Math.floor(tijdVerschil / (1000 * 60 * 60 * 24));
        
        var startDatumStr = startDatum.toLocaleDateString('nl-BE');
        var eindDatumStr = verhuur.eind_datum ? eindDatum.toLocaleDateString('nl-BE') : '-';
        
        var dagenKleur = '#28a745';
        if (dagenInBezit > 30 && dagenInBezit <= 90) {
            dagenKleur = '#ffc107';
        } else if (dagenInBezit > 90) {
            dagenKleur = '#dc3545';
        }
        
        html += `
            <tr id="verhuur-${verhuur.id}">
                <td><strong>${fietsInfo.serienummer}</strong><br><span style="font-size:0.8rem;color:#666;">${modelInfo.merk} ${modelInfo.model}</span></td>
                <td><strong>${klantInfo.naam}</strong></td>
                <td>${startDatumStr}</td>
                <td>${eindDatumStr}</td>
                <td style="font-weight:600;color:${dagenKleur};">
                    ${dagenInBezit} ${dagenInBezit === 1 ? 'dag' : 'dagen'}
                    ${isActief ? '⏳' : ''}
                </td>
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
            ${footerText || 'Totaal: ' + data.length + ' verhuurregels'}
        </p>
    `;
    
    lijst.innerHTML = html;
}

// ============================================
// VERHUUR SUBMIT
// ============================================

document.addEventListener('submit', async function(event) {
    if (event.target.id === 'verhuurForm') {
        event.preventDefault();
        await handleVerhuurSubmit(event);
    }
});

async function handleVerhuurSubmit(event) {
    var fietsId = document.getElementById('verhuurFiets').value;
    var klantId = document.getElementById('verhuurKlant').value;
    var startDatum = document.getElementById('verhuurStart').value;
    var opmerkingen = document.getElementById('verhuurOpmerkingen').value.trim();
    var messageDiv = document.getElementById('verhuurFormMessage');
    var button = event.target.querySelector('button[type="submit"]');
    var originalText = button.textContent;
    
    if (!fietsId || !klantId || !startDatum) {
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Fiets, klant en startdatum zijn verplicht!</p>';
        return;
    }
    
    button.textContent = '⏳ Bezig...';
    button.disabled = true;
    messageDiv.innerHTML = '<p style="color: #666;">⏳ Verhuur wordt gestart...</p>';
    
    try {
        const { error: verhuurError } = await window.supabaseClient
            .from('verhuur_historiek')
            .insert([{
                fiets_id: fietsId,
                klant_id: klantId,
                start_datum: startDatum,
                opmerkingen: opmerkingen || null
            }]);
        
        if (verhuurError) throw verhuurError;
        
        const { error: fietsError } = await window.supabaseClient
            .from('individuele_fietsen')
            .update({ status: 'verhuurd' })
            .eq('id', fietsId);
        
        if (fietsError) throw fietsError;
        
        messageDiv.innerHTML = '<p style="color: #28a745;">✅ Verhuur succesvol gestart!</p>';
        document.getElementById('verhuurForm').reset();
        
        setTimeout(function() {
            hideAddVerhuurForm();
            loadVerhuur();
            loadFietsen();
            loadStats();
        }, 2000);
    } catch (error) {
        console.error('❌ Fout:', error);
        messageDiv.innerHTML = '<p style="color: #dc3545;">❌ Fout: ' + error.message + '</p>';
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
    
    var eindDatum = new Date().toISOString().split('T')[0];
    
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
        
        var el1 = document.getElementById('stat-modellen');
        var el2 = document.getElementById('stat-fietsen');
        var el3 = document.getElementById('stat-klanten');
        var el4 = document.getElementById('stat-verhuur');
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
    
    if (typeof window.renderNavigation === 'function') {
        window.renderNavigation();
    }
    
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

async function showQRCode(serienummer) {
    console.log('📱 Toon QR-code voor:', serienummer);
    
    var fietsGegevens = null;
    try {
        const { data, error } = await window.supabaseClient
            .from('individuele_fietsen')
            .select('*, fiets_modellen (merk, model, kleur)')
            .eq('serienummer', serienummer)
            .single();
        
        if (!error && data) {
            fietsGegevens = data;
        }
    } catch (error) {
        console.warn('⚠️ Kan fietsgegevens niet ophalen:', error);
    }
    
    var modal = document.getElementById('qrModal');
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
                    
                    <div id="qrCodeContainer" style="display: flex; justify-content: center; margin: 10px 0;"></div>
                    
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
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                window.closeQRModal();
            }
        });
    }
    
    modal.style.display = 'flex';
    
    var container = document.getElementById('qrCodeContainer');
    var modelDisplay = document.getElementById('qrModelDisplay');
    var serienummerDisplay = document.getElementById('qrSerienummerDisplay');
    
    if (container) {
        container.innerHTML = '';
        
        if (fietsGegevens && fietsGegevens.fiets_modellen) {
            var model = fietsGegevens.fiets_modellen;
            var kleurStyle = 'display:inline-block;width:14px;height:14px;border-radius:50%;background:' + model.kleur.toLowerCase() + ';border:1px solid #ddd;vertical-align:middle;margin-right:5px;';
            modelDisplay.innerHTML = `
                <span style="${kleurStyle}"></span>
                ${model.merk} ${model.model} (${model.kleur})
            `;
        } else {
            modelDisplay.textContent = 'Onbekend model';
        }
        
        serienummerDisplay.textContent = serienummer;
        
        window._currentQRSerienummer = serienummer;
        window._currentQRFietsData = fietsGegevens;
        
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

function closeQRModal() {
    var modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function downloadQRCode() {
    console.log('⬇️ Start download van QR-afbeelding...');
    
    var qrContainer = document.getElementById('qrCodeContainer');
    if (!qrContainer) {
        alert('❌ Geen QR-code gevonden.');
        return;
    }
    
    var qrCanvas = qrContainer.querySelector('canvas');
    if (!qrCanvas) {
        alert('❌ Geen QR-code afbeelding gevonden.');
        return;
    }
    
    var modelDisplay = document.getElementById('qrModelDisplay');
    var serienummerDisplay = document.getElementById('qrSerienummerDisplay');
    var modelText = modelDisplay ? modelDisplay.textContent.trim() : 'Panta Club';
    var serienummer = serienummerDisplay ? serienummerDisplay.textContent.trim() : window._currentQRSerienummer || 'Onbekend';
    
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    var padding = 30;
    var qrSize = 200;
    var totalWidth = qrSize + (padding * 2);
    var totalHeight = qrSize + (padding * 2) + 70;
    
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    
    ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);
    
    ctx.fillStyle = '#1A2B4C';
    ctx.font = 'bold 14px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(modelText, totalWidth / 2, qrSize + padding + 30);
    
    ctx.fillStyle = '#666666';
    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText('Serienummer: ' + serienummer, totalWidth / 2, qrSize + padding + 55);
    
    try {
        var link = document.createElement('a');
        link.download = 'PantaClub_QR_' + serienummer + '.png';
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

// Serienummer generator
window.genereerSerienummer = genereerSerienummer;
window.vulSerienummerIn = vulSerienummerIn;

// Fietsen
window.filterFietsen = filterFietsen;
window.resetFietsFilter = resetFietsFilter;
window.editFiets = editFiets;
window.saveFiets = saveFiets;
window.deleteFiets = deleteFiets;

// Fietsen Excel Import (Stocklijst)
window.showFietsExcelImport = showFietsExcelImport;
window.closeFietsExcelImport = closeFietsExcelImport;
window.handleFietsExcelFile = handleFietsExcelFile;
window.handleFietsExcelDrop = handleFietsExcelDrop;
window.importFietsExcelData = importFietsExcelData;

// Klanten
window.showAddKlantForm = showAddKlantForm;
window.hideAddKlantForm = hideAddKlantForm;
window.loadKlanten = loadKlanten;
window.editKlant = editKlant;
window.saveKlant = saveKlant;
window.cancelEditKlant = cancelEditKlant;
window.deleteKlant = deleteKlant;
window.filterKlanten = filterKlanten;
window.resetKlantFilter = resetKlantFilter;

// Klant Excel Import (Subscribers)
window.showExcelImport = showExcelImport;
window.closeExcelImport = closeExcelImport;
window.handleExcelFile = handleExcelFile;
window.handleExcelDrop = handleExcelDrop;
window.importExcelData = importExcelData;

// Verhuur
window.showAddVerhuurForm = showAddVerhuurForm;
window.hideAddVerhuurForm = hideAddVerhuurForm;
window.loadVerhuur = loadVerhuur;
window.beëindigVerhuur = beëindigVerhuur;
window.deleteVerhuur = deleteVerhuur;
window.filterVerhuur = filterVerhuur;
window.resetVerhuurFilter = resetVerhuurFilter;

// QR-code
window.showQRCode = showQRCode;
window.closeQRModal = closeQRModal;
window.downloadQRCode = downloadQRCode;

console.log('✅ Applicatie klaar voor gebruik');