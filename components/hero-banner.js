class HeroBanner extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Tu Estilo, Bajo el Sol';
        const subtitle = this.getAttribute('subtitle') || '';
        const buttonText = this.getAttribute('button-text') || 'Descubre Nuevos Modelos';
        const backgroundImage = this.getAttribute('background') || 'public/assets-img/bikini1.png';
        
        this.innerHTML = `
            <section class="hero-banner" style="background-image: url('${backgroundImage}')">
                <div class="hero-content">
                    <h1 class="hero-title">${title}</h1>
                    ${subtitle ? `<p class="hero-subtitle">${subtitle}</p>` : ''}
                    <button class="hero-button">${buttonText}</button>
                </div>
            </section>
        `;
    }
}

customElements.define('hero-banner', HeroBanner);