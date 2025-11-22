import { getProduct } from '../services/api-services.js';

class ProductDetail extends HTMLElement {
    connectedCallback() {
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        this.renderLoading();
        this.loadProduct();
    }

    getProductId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadProduct() {
        const id = this.getProductId();
        if (!id) {
            this.renderError('Producto no encontrado (falta el id en la URL)');
            return;
        }

        try {
            const product = await getProduct(id);
            this.renderProduct(product);
        } catch (err) {
            console.error(err);
            this.renderError('No pudimos cargar el producto. Intenta más tarde.');
        }
    }

    renderLoading() {
        this.innerHTML = `
            <div class="product-detail">
                <p>Cargando producto...</p>
            </div>
        `;
    }

    renderError(message) {
        this.innerHTML = `
            <div class="product-detail">
                <p>${message}</p>
            </div>
        `;
    }

    renderProduct(product) {
        const imagenPrincipal =
            (product.imagenes && product.imagenes.find(img => img.es_principal)?.url_imagen) ||
            (product.imagenes && product.imagenes[0]?.url_imagen) ||
            `${this.basePath}public/productos/prd1.png`;

        const tallas = product.inventario || [];
        const descripcion =
            product.descripcion ||
            'Descubre nuestros diseños únicos con materiales de alta calidad para tu comodidad y estilo.';

        this.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-container">
                    <div class="product-image-section">
                        <img src="${imagenPrincipal}" alt="${product.nombre}" class="detail-image">
                    </div>
                    <div class="product-info-section">
                        <h1 class="product-title">${product.nombre}</h1>
                        <p class="product-description">${descripcion}</p>
                        <div class="size-selector">
                            <label>Talla:</label>
                            <div class="size-options">
                                ${tallas.map(t => `<button class="size-btn" data-sku="${t.sku || ''}">${t.talla}</button>`).join('') || '<p>Consultar tallas disponibles</p>'}
                            </div>
                        </div>
                        <div class="price-section">
                            <span class="price">S/ ${product.precio_minorista ?? product.precio ?? '0.00'}</span>
                        </div>
                        <button class="whatsapp-btn">
                            <img src="${this.basePath}public/assets-img/whatsapp.png" alt="WhatsApp">
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
        });
    }
}

customElements.define('product-detail', ProductDetail);
