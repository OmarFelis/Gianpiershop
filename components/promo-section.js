class PromoSection extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'GIAMPIERSHOP';
        const subtitle = this.getAttribute('subtitle') || 'Calidad y Estilo en Cada Ola';
        const description = this.getAttribute('description') || 'Descubre tendencias exclusivas para tus días de sol';
        const buttonText = this.getAttribute('button-text') || 'Explorar Colección';
        
        this.innerHTML = `
            <section class="promo-section">
                <div class="promo-container">
                    <h2 class="promo-title">${title}</h2>
                    <h3 class="promo-subtitle">${subtitle}</h3>
                    <p class="promo-description">${description}</p>
                    <button class="promo-button">${buttonText}</button>
                </div>
            </section>
        `;
    }
}

customElements.define('promo-section', PromoSection);