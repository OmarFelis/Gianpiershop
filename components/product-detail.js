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
        const phone = '51929767531'; // Cambiar por numero real con codigo de pais sin +
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
            `${this.basePath}public/productos/default.PNG`;
        const imagenesDisponibles = (product.imagenes || [])
            .map(img => img.url_imagen)
            .filter(Boolean);
        const imagenesCarrusel = imagenesDisponibles.length ? imagenesDisponibles : [imagenPrincipal];

        const tallas = product.inventario || [];
        const descripcion =
            product.descripcion ||
            'Descubre nuestros disenos unicos con materiales de alta calidad para tu comodidad y estilo.';

        const precioMinorista = product.precio_minorista ?? product.precio ?? '0.00';
        const precioMayorista = product.precio_mayorista ?? product.precio ?? null;
        const tieneMayorista = precioMayorista !== null;
        const qrImage = product.qr_image || product.qr || `${this.basePath}public/assets-img/qr-placeholder.png`;

        this.innerHTML = `
            <div class="product-detail">
                <style>
                    .qr-pay-btn {
                        margin-top: 12px;
                        width: 100%;
                        padding: 12px;
                        background: #0b8f5a;
                        color: #fff;
                        border: none;
                        border-radius: 8px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        transition: transform 0.2s ease;
                    }
                    .qr-pay-btn:hover { transform: translateY(-1px); }
                    .qr-modal {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.5);
                        display: none;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        z-index: 999;
                    }
                    .qr-modal.open { display: flex; }
                    .qr-modal-content {
                        background: #fff;
                        padding: 18px 18px 14px;
                        border-radius: 12px;
                        max-width: 360px;
                        width: 100%;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        position: relative;
                        text-align: center;
                    }
                    .qr-modal-close {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: transparent;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                    }
                    .qr-image {
                        width: 100%;
                        height: auto;
                        max-width: 240px;
                        margin: 10px auto 6px;
                        display: block;
                    }
                    .qr-note {
                        font-size: 0.9rem;
                        color: #444;
                        margin: 6px 0 4px;
                    }
                    .product-gallery {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .main-image-wrapper {
                        position: relative;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
                    }
                    .detail-image {
                        width: 100%;
                        height: 480px;
                        object-fit: cover;
                        display: block;
                        background: #f8f8f8;
                    }
                    .carousel-nav {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0,0,0,0.55);
                        color: #fff;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: grid;
                        place-items: center;
                        cursor: pointer;
                        transition: background 0.2s ease, transform 0.2s ease;
                    }
                    .carousel-nav:hover { background: rgba(0,0,0,0.75); transform: translateY(-50%) scale(1.03); }
                    .carousel-prev { left: 12px; }
                    .carousel-next { right: 12px; }
                    .thumbs {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
                        gap: 10px;
                    }
                    .thumb-btn {
                        border: 2px solid transparent;
                        border-radius: 10px;
                        padding: 4px;
                        background: #fff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        cursor: pointer;
                        transition: border-color 0.2s ease, transform 0.15s ease;
                    }
                    .thumb-btn:hover { transform: translateY(-1px); }
                    .thumb-btn.active { border-color: #0b8f5a; }
                    .thumb-btn img {
                        width: 100%;
                        height: 70px;
                        object-fit: cover;
                        border-radius: 8px;
                        display: block;
                        background: #f5f5f5;
                    }
                </style>
                <div class="product-detail-container">
                    <div class="product-image-section">
                        <div class="product-gallery">
                            <div class="main-image-wrapper">
                                <button class="carousel-nav carousel-prev" aria-label="Imagen anterior">&#10094;</button>
                                <img src="${imagenPrincipal}" alt="${product.nombre}" class="detail-image" data-index="0">
                                <button class="carousel-nav carousel-next" aria-label="Imagen siguiente">&#10095;</button>
                            </div>
                            <div class="thumbs">
                                ${imagenesCarrusel.map((img, idx) => `
                                    <button class="thumb-btn${idx === 0 ? ' active' : ''}" data-index="${idx}" aria-label="Ver imagen ${idx + 1}">
                                        <img src="${img}" alt="${product.nombre} ${idx + 1}">
                                    </button>
                                `).join('')}
                            </div>
                        </div>
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
                        <button class="qr-pay-btn">
                            <span aria-hidden="true">▣</span>
                            Pagar con QR
                        </button>
        
                    </div>
                </div>
                <div class="qr-modal" role="dialog" aria-modal="true" aria-hidden="true">
                    <div class="qr-modal-content">
                        <button class="qr-modal-close" aria-label="Cerrar modal">×</button>
                        <h3>Escanea y paga</h3>
                        <img src="${qrImage}" alt="Código QR de pago" class="qr-image">
                        <p class="qr-note">Escanea este código con tu app bancaria o billetera para realizar el pago.</p>
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

        const qrBtn = this.querySelector('.qr-pay-btn');
        const qrModal = this.querySelector('.qr-modal');
        const qrClose = this.querySelector('.qr-modal-close');
        const modalContent = this.querySelector('.qr-modal-content');

        const closeModal = () => {
            if (!qrModal) return;
            qrModal.classList.remove('open');
            qrModal.setAttribute('aria-hidden', 'true');
            document.removeEventListener('keydown', handleEsc);
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        const openModal = () => {
            if (!qrModal) return;
            qrModal.classList.add('open');
            qrModal.setAttribute('aria-hidden', 'false');
            document.addEventListener('keydown', handleEsc);
        };
        if (qrBtn && qrModal) {
            qrBtn.addEventListener('click', openModal);
            qrModal.addEventListener('click', (e) => {
                if (e.target === qrModal) closeModal();
            });
        }
        if (qrClose) {
            qrClose.addEventListener('click', closeModal);
        }
        if (modalContent) {
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }

        const mainImage = this.querySelector('.detail-image');
        const thumbs = this.querySelectorAll('.thumb-btn');
        const prevBtn = this.querySelector('.carousel-prev');
        const nextBtn = this.querySelector('.carousel-next');
        let currentIndex = 0;

        const setImage = (idx) => {
            if (!mainImage || !imagenesCarrusel.length) return;
            const total = imagenesCarrusel.length;
            currentIndex = ((idx % total) + total) % total;
            mainImage.src = imagenesCarrusel[currentIndex];
            mainImage.setAttribute('data-index', String(currentIndex));
            mainImage.alt = `${product.nombre} ${currentIndex + 1}`;
            thumbs.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.index) === currentIndex));
        };
        if (prevBtn) {
            prevBtn.addEventListener('click', () => setImage(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => setImage(currentIndex + 1));
        }
        thumbs.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.dataset.index);
                setImage(idx);
            });
        });
        if (imagenesCarrusel.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }

        this.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn')) {
                this.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }
}

customElements.define('product-detail', ProductDetail);
