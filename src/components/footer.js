/**
 * ============================================
 * FOOTER COMPONENT
 * ============================================
 * Centrale footer voor alle pagina's.
 * ============================================
 */

console.log('📌 Footer component geladen');

function renderFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) {
        console.error('❌ #footer element niet gevonden!');
        return;
    }
    
    footerElement.innerHTML = `
        <footer class="site-footer">
            <div class="container-full">
                <p style="margin-bottom: 5px;">
                    &copy; ${new Date().getFullYear()} <strong>Panta Club</strong> 
                    - Fietsregistratie Platform
                </p>
                <p style="font-size: 0.85rem; margin: 0;">
                    Gebouwd met &#10084; voor een veilige en overzichtelijke fietsadministratie
                </p>
            </div>
        </footer>
    `;
    
    console.log('✅ Footer geladen');
}

// Maak functie globaal beschikbaar
window.renderFooter = renderFooter;

console.log('✅ Footer component klaar voor gebruik');