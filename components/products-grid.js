import { getProducts } from '../services/api-services.js';

class ProductsGrid extends HTMLElement {
    connectedCallback() {
        this.renderLoading();
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const products = await getProducts();
            this.renderProducts(products);
        } catch (err) {
            console.error(err);
            this.renderError();
        }
    }

    renderLoading() {
        this.innerHTML = `
            <div class="products-grid loading">
                <p>Cargando productos...</p>
            </div>
        `;
    }

    renderError() {
        this.innerHTML = `
            <div class="products-grid error">
                <p>No pudimos cargar los productos. Intenta de nuevo más tarde.</p>
            </div>
        `;
    }

    renderProducts(products) {
        if (!products || !products.length) {
            this.innerHTML = `
                <div class="products-grid empty">
                    <p>No hay productos disponibles.</p>
                </div>
            `;
            return;
        }

        this.innerHTML = `
            <div class="products-grid">
                ${products.map(product => {
                    const imagen = (product.imagenes && product.imagenes[0]?.url_imagen) || '../public/productos/prd1.png';
                    const precio = product.precio_minorista ?? product.precio ?? '0.00';
                    return `
                        <a class="product-card" href="${this.basePath}pages/detalle.html?id=${product.id}">
                            <img src="${imagen}" alt="${product.nombre}">
                            <h3>${product.nombre}</h3>
                            <p class="price">S/ ${precio}</p>
                        </a>
                    `;
                }).join('')}
            </div>
        `;
    }
}

customElements.define('products-grid', ProductsGrid);
