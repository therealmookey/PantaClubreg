/**
 * ============================================
 * FOOTER COMPONENT
 * ============================================
 * Centrale footer voor alle pagina's.
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📌 Footer component laden...');
    renderFooter();
});

function renderFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) return;
    
    const currentYear = new Date().getFullYear();
    
    footerElement.innerHTML = `
        <footer style="
            background-color: var(--primary-blue);
            color: rgba(255,255,255,0.7);
            padding: 30px 0;
            margin-top: 40px;
            text-align: center;
        ">
            <div class="container">
                <p style="margin-bottom: 5px;">
                    © ${currentYear} <strong style="color: white;">Panta Club</strong> 
                    - Fietsregistratie Platform v1.0
                </p>
                <p style="font-size: 0.85rem; margin: 0;">
                    Gebouwd met ❤️ voor een veilige en overzichtelijke fietsadministratie
                </p>
            </div>
        </footer>
    `;
}