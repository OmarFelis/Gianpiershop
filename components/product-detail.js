class ProductDetail extends HTMLElement {
    connectedCallback() {
        const product = JSON.parse(this.getAttribute('product') || '{}');
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        
        this.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-container">
                    <div class="product-image-section">
                        <img src="${product.image}" alt="${product.name}" class="detail-image">
                    </div>
                    <div class="product-info-section">
                        <h1 class="product-title">${product.name}</h1>
                        <p class="product-description">${product.description || 'Sumérgete en el estilo con nuestros diseños únicos. Confeccionado con materiales de alta calidad para brindarte comodidad y elegancia en cada momento bajo el sol.'}</p>
                        <div class="size-selector">
                            <label>Talla:</label>
                            <div class="size-options">
                                <button class="size-btn">S</button>
                                <button class="size-btn">M</button>
                                <button class="size-btn">L</button>
                            </div>
                        </div>
                        <div class="color-selector">
                            <label>Color:</label>
                            <div class="color-options">
                                <div class="color-option" style="background: #ff6b6b"></div>
                                <div class="color-option" style="background: #4ecdc4"></div>
                                <div class="color-option" style="background: #45b7d1"></div>
                            </div>
                        </div>
                        <div class="price-section">
                            <span class="price">S/ ${product.price}</span>
                        </div>
                        <button class="whatsapp-btn">
                            <img src="${basePath}public/assets-img/whatsapp.png" alt="WhatsApp">
                            Consultar por WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn')) {
                this.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
            if (e.target.classList.contains('color-option')) {
                this.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }
}

customElements.define('product-detail', ProductDetail);