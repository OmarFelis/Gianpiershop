class ContactPage extends HTMLElement {
    connectedCallback() {
        const contactImage = '/public/assets-img/bannerform.jpeg';
        const API_URL = 'http://localhost:8000';

        this.innerHTML = `
            <div class="contact-page-wrapper">
                <section class="contact-hero">
                    <div class="contact-header">
                        <h1>Ponte en Contacto</h1>
                        <p>Estamos aqui para ayudarte a encontrar el estilo perfecto para tu verano. Escribenos o llamanos.</p>
                    </div>
                </section>

                <section class="contact-container">
                    <div class="contact-image-area">
                        <img src="${contactImage}" alt="Modelo Giampiershop en la playa" class="contact-visual">
                    </div>

                    <div class="contact-form-area">
                        <form class="contact-form">
                            <h2>Envianos un Mensaje</h2>
                            <div class="form-group">
                                <label for="name">Nombre Completo</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Correo Electronico</label>
                                <input type="email" id="email" name="email" required>
                            </div>

                            <div class="form-group">
                                <label for="phone">Telefono (opcional)</label>
                                <input type="tel" id="phone" name="phone" placeholder="+51 900 000 000">
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Mensaje</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>

                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="wholesale" name="wholesale">
                                    <span>Estoy interesado en precios mayoristas</span>
                                </label>
                            </div>
                            
                            <div class="form-status" aria-live="polite"></div>
                            <button type="submit" class="contact-submit-button">Enviar Mensaje</button>
                        </form>

                        <hr class="contact-divider">

                        <div class="contact-info">
                            <h3>Informacion de Contacto</h3>
                            <p>
                                <i class="fas fa-envelope"></i>
                                <strong>Email:</strong> 
                                <a href="mailto:info@giampiershop.com">info@giampiershop.com</a>
                            </p>
                            <p>
                                <i class="fas fa-phone"></i>
                                <strong>Telefono:</strong> 
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

        const form = this.querySelector('.contact-form');
        const statusEl = this.querySelector('.form-status');

        const setStatus = (message, type = 'info') => {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.className = `form-status status-${type}`;
        };

        form?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombre = form.name.value.trim();
            const email = form.email.value.trim();
            const telefono = form.phone.value.trim();
            const mensaje = form.message.value.trim();
            const interesadoMayorista = form.wholesale.checked;

            if (!nombre || !email || !mensaje) {
                setStatus('Completa los campos obligatorios.', 'error');
                return;
            }

            const payload = {
                nombre_cliente: nombre,
                email,
                telefono: telefono || null,
                mensaje,
                interesado_en_mayorista: interesadoMayorista,
            };

            setStatus('Enviando mensaje...', 'info');
            try {
                const res = await fetch(`${API_URL}/mensajes_contacto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    throw new Error(`Error HTTP ${res.status}`);
                }

                setStatus('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
                form.reset();
            } catch (error) {
                console.error('Error enviando mensaje de contacto', error);
                setStatus('No se pudo enviar el mensaje. Intenta mas tarde.', 'error');
            }
        });
    }
}
customElements.define('contact-page', ContactPage);
