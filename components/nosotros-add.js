class Nosotros extends HTMLElement {
    connectedCallback(){
        // --- Datos para la Sección de Misión (Hero Banner) ---
        const missionHeadline = 'CONQUISTA TU VERANO CON CONFIANZA.';
        const missionSlogan = 'El estilo que te acompaña en cada ola, diseñado para tu confort y belleza.';
        // **IMPORTANTE:** Reemplaza 'public/assets-img/quienes-somos-bg.jpg' con una imagen de alta calidad de tu marca (playa, modelo, etc.).
        const missionImage = '/public/assets-img/banner3.jpg'; 
        const missionButton = 'Explorar Colección';

        // --- Estructura Completa de la Página ---
        this.innerHTML = `
            <div class="quienes-somos-page">

                <section id="hero-mission" class="mission-hero-section" style="background-image: url('${missionImage}')">
                    <div class="mission-overlay"></div>
                    <div class="mission-content">
                        <h1 class="mission-headline">${missionHeadline}</h1>
                        <p class="mission-slogan">${missionSlogan}</p>
                        <a href="../pages/catalogo.html" class="mission-button">${missionButton}</a>
                    </div>
                </section>

                <section id="brand-values" class="values-section">
                    <h2 class="section-title">NUESTROS PILARES DE CALIDAD</h2>
                    <div class="values-container">
                        
                        <div class="value-card">
                            <div class="value-icon">
                                <i class="fas fa-gem"></i>
                            </div>
                            <h3 class="value-title">CONFECCIÓN PREMIUM</h3>
                            <p class="value-text">Tejidos con protección UV y alta resistencia al cloro y la sal, manteniendo la forma y color de tu prenda.</p>
                        </div>
                        
                        <div class="value-card">
                            <div class="value-icon">
                                <i class="fas fa-ruler-combined"></i>
                            </div>
                            <h3 class="value-title">DISEÑO EXCLUSIVO</h3>
                            <p class="value-text">Patrones innovadores creados para adaptarse y realzar la belleza de la silueta latina en cada detalle.</p>
                        </div>
                        
                        <div class="value-card">
                            <div class="value-icon">
                                <i class="fas fa-heart"></i>
                            </div>
                            <h3 class="value-title">CONFIANZA TOTAL</h3>
                            <p class="value-text">Creamos moda de baño para que te sientas segura, cómoda y radiante disfrutando cada momento bajo el sol.</p>
                        </div>

                    </div>
                </section>
                
                <section class="cta-section">
                    <h2 class="cta-headline">¿Lista para Vivir la Experiencia Giampiershop?</h2>
                    <a href="../pages/contacto.html" class="cta-button">Contáctanos Hoy</a>
                </section>

            </div>
        `;
    }
}
customElements.define('nosotros-page', Nosotros);