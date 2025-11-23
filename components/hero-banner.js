class HeroBanner extends HTMLElement {
    connectedCallback() {
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        this.title = this.getAttribute('title') || 'Tu Estilo, ';
        this.subtitle = this.getAttribute('subtitle') || 'Bajo el Sol';
        this.buttonText = this.getAttribute('button-text') || 'Descubre Nuevos Modelos';
        this.interval = Number(this.getAttribute('interval')) || 5000;
        this.images = this.getImages();
        this.currentIndex = 0;

        this.render();
        this.startAutoplay();
    }

    disconnectedCallback() {
        this.stopAutoplay();
    }

    getImages() {
        const backgroundImage = this.getAttribute('background') || 'public/assets-img/bikini1.png';
        const imagesAttr = this.getAttribute('images');

        if (imagesAttr) {
            try {
                const parsed = JSON.parse(imagesAttr);
                if (Array.isArray(parsed) && parsed.length) {
                    const normalized = parsed.map((img) => this.normalizePath(img));
                    return normalized.length === 1 ? [normalized[0], normalized[0], normalized[0]] : normalized;
                }
            } catch (err) {
                console.warn('No se pudo parsear el atributo "images" en hero-banner', err);
            }
        }

        const singleImage = this.normalizePath(backgroundImage);
        return [singleImage, singleImage, singleImage];
    }

    normalizePath(path) {
        if (!path) return '';
        const isAbsolute = /^(https?:)?\/\//.test(path) || path.startsWith('/');
        return isAbsolute ? path : `${this.basePath}${path}`;
    }

    render() {
        const slides = this.images.map((image, index) => `
            <div class="hero-slide ${index === this.currentIndex ? 'active' : ''}" style="background-image: url('${image}')">
                <div class="hero-content">
                    <h1 class="hero-title">${this.title}</h1>
                    ${this.subtitle ? `<p class="hero-subtitle">${this.subtitle}</p>` : ''}
                    <button class="hero-button">${this.buttonText}</button>
                </div>
            </div>
        `).join('');

        const dots = this.images.map((_, index) => `
            <button class="hero-dot ${index === this.currentIndex ? 'active' : ''}" aria-label="Ir al banner ${index + 1}" data-index="${index}"></button>
        `).join('');

        this.innerHTML = `
            <section class="hero-banner">
                <div class="hero-slider">
                    ${slides}
                    ${this.images.length > 1 ? `
                        <button class="hero-nav prev" aria-label="Banner anterior">‹</button>
                        <button class="hero-nav next" aria-label="Banner siguiente">›</button>
                        <div class="hero-dots">${dots}</div>
                    ` : ''}
                </div>
            </section>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const prevBtn = this.querySelector('.hero-nav.prev');
        const nextBtn = this.querySelector('.hero-nav.next');
        const dots = this.querySelectorAll('.hero-dot');

        prevBtn?.addEventListener('click', () => this.showSlide(this.currentIndex - 1, true));
        nextBtn?.addEventListener('click', () => this.showSlide(this.currentIndex + 1, true));
        dots.forEach((dot) => {
            const index = Number(dot.dataset.index);
            dot.addEventListener('click', () => this.showSlide(index, true));
        });
    }

    showSlide(index, fromUser = false) {
        if (!this.images.length) return;

        const lastIndex = this.images.length - 1;
        if (index < 0) index = lastIndex;
        if (index > lastIndex) index = 0;

        this.currentIndex = index;
        this.updateActiveSlide();

        if (fromUser) {
            this.resetAutoplay();
        }
    }

    updateActiveSlide() {
        const slides = this.querySelectorAll('.hero-slide');
        const dots = this.querySelectorAll('.hero-dot');

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === this.currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === this.currentIndex);
        });
    }

    startAutoplay() {
        if (this.images.length <= 1) return;
        this.stopAutoplay();
        this.timer = setInterval(() => this.showSlide(this.currentIndex + 1), this.interval);
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

customElements.define('hero-banner', HeroBanner);
