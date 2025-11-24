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
            this.renderError('No pudimos cargar el producto. Intenta mas tarde.');
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

    openWSP(product) {
        const phone = '51937475112'; // Cambiar por numero real con codigo de pais sin +
        const talla = this.querySelector('.size-btn.active')?.textContent.trim() || 'Talla no seleccionada';
        const precioTipo = this.querySelector('.price-check:checked')?.value === 'mayorista' ? 'mayorista' : 'minorista';
        const precio = precioTipo === 'mayorista'
            ? (product.precio_mayorista ?? product.precio ?? '0.00')
            : (product.precio_minorista ?? product.precio ?? '0.00');
        const text = `Hola, estoy interesado en el producto ${product.nombre} - Talla: ${talla} - Precio ${precioTipo}: S/ ${precio}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    renderProduct(product) {
        const imagenPrincipal =
            (product.imagenes && product.imagenes.find(img => img.es_principal)?.url_imagen) ||
            (product.imagenes && product.imagenes[0]?.url_imagen) ||
            `${this.basePath}public/productos/prd1.png`;

        const tallas = product.inventario || [];
        const descripcion =
            product.descripcion ||
            'Descubre nuestros disenos unicos con materiales de alta calidad para tu comodidad y estilo.';

        const precioMinorista = product.precio_minorista ?? product.precio ?? '0.00';
        const precioMayorista = product.precio_mayorista ?? product.precio ?? null;
        const tieneMayorista = precioMayorista !== null;

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
                                ${tallas.map(t => `
                                    <button class="size-btn${t.stock_actual === 0 ? ' disabled' : ''}" data-sku="${t.sku || ''}" ${t.stock_actual === 0 ? 'disabled' : ''}>
                                        ${t.talla}${t.stock_actual !== undefined ? ` (${t.stock_actual})` : ''}
                                    </button>
                                `).join('') || '<p>Consultar tallas disponibles</p>'}
                            </div>
                        </div>
                        <div class="price-section">
                            <div class="price-block">
                                <label class="price-label">Precio minorista:</label>
                                <span class="price">S/ ${precioMinorista}</span>
                                <label class="price-option">
                                    <input class="price-check" type="checkbox" value="minorista" checked>
                                    <span>Seleccionar</span>
                                </label>
                            </div>
                            <div class="price-block">
                                <label class="price-label">Precio mayorista:</label>
                                <span class="price">S/ ${precioMayorista ?? 'N/A'}</span>
                                <label class="price-option">
                                    <input class="price-check" type="checkbox" value="mayorista" ${tieneMayorista ? '' : 'disabled'}>
                                    <span>${tieneMayorista ? 'Seleccionar' : 'No disponible'}</span>
                                </label>
                            </div>
                        </div>
                        <button class="whatsapp-btn">
                            <img src="${this.basePath}public/assets-img/whatsapp.png" alt="WhatsApp">
                            Consultar por WhatsApp
                        </button>
        
                    </div>
                </div>
            </div>
        `;

        const wspBtn = this.querySelector('.whatsapp-btn');
        if (wspBtn) {
            wspBtn.addEventListener('click', () => this.openWSP(product));
        }

        const priceChecks = this.querySelectorAll('.price-check');
        priceChecks.forEach(check => {
            check.addEventListener('change', (e) => {
                if (e.target.checked) {
                    priceChecks.forEach(other => {
                        if (other !== e.target) other.checked = false;
                    });
                } else if (![...priceChecks].some(c => c.checked)) {
                    // Siempre deja una seleccionada: vuelve a minorista si se desmarcan todas
                    const minorista = this.querySelector('.price-check[value="minorista"]');
                    if (minorista) minorista.checked = true;
                }
            });
        });

        this.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn')) {
                this.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }
}

customElements.define('product-detail', ProductDetail);
