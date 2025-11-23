import { getProducts } from '../services/api-services.js';

class ProductsGrid extends HTMLElement {
    connectedCallback() {
        this.renderLoading();
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        const staticProducts = this.getAttribute('products');
        if (staticProducts) {
            this.renderStaticProducts(staticProducts);
        } else {
            this.loadProducts();
        }
    }

    async loadProducts() {
        try {
            const products = await getProducts();
            const categoryId = this.getAttribute('category-id');
            const filtered =
                categoryId && categoryId !== 'all'
                    ? products.filter((p) => String(p.categoria_id) === String(categoryId))
                    : products;
            this.renderProducts(filtered);
        } catch (err) {
            console.error(err);
            this.renderError();
        }
    }

    renderStaticProducts(productsAttr) {
        try {
            const parsed = JSON.parse(productsAttr);
            if (!Array.isArray(parsed)) {
                throw new Error('products debe ser un arreglo');
            }
            this.renderProducts(parsed);
        } catch (err) {
            console.error('No se pudo renderizar products-grid con products estático', err);
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
                    const imagen = this.getImageUrl(
                        (product.imagenes && product.imagenes[0]?.url_imagen) ||
                        product.image
                    );
                    const precio = product.precio_minorista ?? product.precio ?? product.price ?? '0.00';
                    const tallas = (product.inventario || []).map(t => t.talla).slice(0, 3);
                    const masTallas = (product.inventario || []).length > 3;
                    return `
                        <a class="product-card" href="${this.basePath}pages/detalle.html?id=${product.id}">
                            <div class="product-thumb">
                                <img src="${imagen}" alt="${product.nombre}" loading="lazy">
                            </div>
                            <div class="product-body">
                                <h3 class="product-title">${product.nombre}</h3>
                                ${tallas.length ? `
                                    <div class="product-sizes">
                                        ${tallas.map(t => `<span class="size-chip">${t}</span>`).join('')}
                                        ${masTallas ? `<span class="size-chip more">+${(product.inventario.length - 3)}</span>` : ''}
                                    </div>
                                ` : ''}
                                <p class="product-price">S/ ${precio}</p>
                            </div>
                        </a>
                    `;
                }).join('')}
            </div>
        `;
    }

    getImageUrl(path) {
        if (!path) return `${this.basePath}public/productos/prd1.png`;
        const isAbsolute = /^(https?:)?\/\//.test(path) || path.startsWith('/');
        return isAbsolute ? path : `${this.basePath}${path}`;
    }
}

customElements.define('products-grid', ProductsGrid);
