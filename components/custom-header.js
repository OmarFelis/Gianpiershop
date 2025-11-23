class CustomHeader extends HTMLElement {
    connectedCallback() {
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        const logoPath = this.getAttribute('logo') || `${basePath}public/assets-img/LOGOGIAM.png`;
        
        this.innerHTML = `
            <header class="main-header">
                <div class="header-container">
                    <div class="logo-area">
                        <img src="${logoPath}" alt="Logo" class="logo">
                    </div>
                    <nav class="nav-menu">
                        <ul>
                            <li><a href="${basePath}index.html">INICIO</a></li>
                            <li><a href="${basePath}pages/catalogo.html">CATALOGO</a></li>
                            <li><a href="${basePath}nosotros.html">NOSOTROS</a></li>
                            <li><a href="${basePath}contacto.html">CONTACTO</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('custom-header', CustomHeader);