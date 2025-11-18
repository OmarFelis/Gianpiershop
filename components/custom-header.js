class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="main-header">
                <div class="header-container">
                    <div class="logo-area">
                        <img src="${this.getAttribute('logo') || 'public/assets-img/LOGOGIAM.png'}" alt="Logo" class="logo">
                    </div>
                    <nav class="nav-menu">
                        <ul>
                            <li><a href="index.html">INICIO</a></li>
                            <li><a href="catalogo.html">CATALOGO</a></li>
                            <li><a href="nosotros.html">NOSOTROS</a></li>
                            <li><a href="contacto.html">CONTACTO</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('custom-header', CustomHeader);