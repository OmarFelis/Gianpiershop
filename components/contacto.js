class ContactPage extends HTMLElement {
    connectedCallback() {
        const contactImage = '/public/assets-img/bannerform.png'; 
        
        this.innerHTML = `
            <div class="contact-page-wrapper">
                
                <!-- Encabezado de la Página de Contacto -->
                <section class="contact-hero">
                    <div class="contact-header">
                        <h1>Ponte en Contacto</h1>
                        <p>Estamos aquí para ayudarte a encontrar el estilo perfecto para tu verano. Escríbenos o llámanos.</p>
                    </div>
                </section>

                <!-- Sección Principal: Diseño Asimétrico (Imagen + Formulario) -->
                <section class="contact-container">
                    
                    <!-- Columna Izquierda: Imagen Destacada -->
                    <div class="contact-image-area">
                        <img src="${contactImage}" alt="Modelo Giampiershop en la playa" class="contact-visual">
                    </div>

                    <!-- Columna Derecha: Formulario y Datos -->
                    <div class="contact-form-area">
                        
                        <!-- Formulario de Contacto -->
                        <form action="#" method="POST" class="contact-form">
                            <h2>Envíanos un Mensaje</h2>
                            <div class="form-group">
                                <label for="name">Nombre Completo</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Correo Electrónico</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Mensaje</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            
                            <button type="submit" class="contact-submit-button">Enviar Mensaje</button>
                        </form>

                        <hr class="contact-divider">

                        <!-- Información Adicional -->
                        <div class="contact-info">
                            <h3>Información de Contacto</h3>
                            <p>
                                <i class="fas fa-envelope"></i>
                                <strong>Email:</strong> 
                                <a href="mailto:info@giampiershop.com">info@giampiershop.com</a>
                            </p>
                            <p>
                                <i class="fas fa-phone"></i>
                                <strong>Teléfono:</strong> 
                                <a href="tel:+51929767531">+51 929 767 531</a>
                            </p>
                            
                            <div class="social-links">
                                <a href=""><i class="fa-brands fa-facebook"></i></a>
                                <a href=""><i class="fa-brands fa-instagram"></i></a>
                                <a href="https://www.tiktok.com/@giampiershop"><i class="fa-brands fa-tiktok"></i></a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }
}
customElements.define('contact-page', ContactPage);