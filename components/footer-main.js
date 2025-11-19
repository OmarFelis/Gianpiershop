class FooterMain extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
            <footer class="main-footer">
                <div class="footer-content">
                    
                    <div class="footer-column brand-info">
                        <div class="logo-container">
                            <img src="/public/assets-img/logo-footer.png" alt="Giampiershop Logo" class="footer-logo">
                        </div>
                        <p class="tagline">Diseños exclusivos y tejidos que te acompañan.</p>
                        <p class="tagline">Vive la moda de baño con la calidad</p>
                    </div>

                    <div class="footer-column">
                        <h3 class="column-title">Sobre Nosotros</h3>
                        <ul>
                            <li><a href="#">Servicios</a></li>
                            <li><a href="#">Quienes somos</a></li>
                            <li><a href="#">Contactanos</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="column-title">Informacion</h3>
                        <ul>
                            <li><a href="#">Libro de reclamaciones</a></li>
                            <li><a href="#">Términos y condiciones</a></li>
                            <li><a href="#">Políticas de privacidad</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="column-title">Categorías</h3>
                        <ul>
                            <li><a href="#">Bikinis</a></li>
                            <li><a href="#">Enterizas</a></li>
                        </ul>
                    </div>

                    <div class="footer-column social">
                        <h3 class="column-title">Síguenos</h3>
                        <div class="social-icons">
                            <a href=""><i class="fa-brands fa-facebook"></i></a>
                            <a href=""><i class="fa-brands fa-instagram"></i></a>
                            <a href="https://www.tiktok.com/@giampiershop"><i class="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>

                </div>

                <div class="footer-bottom">
                    <hr class="footer-divider">
                    <p class="copyright">Copyright © 2025 Nova Solution All rights reserved</p>
                </div>
            </footer>
        `;
    }
}
customElements.define('footer-main', FooterMain);