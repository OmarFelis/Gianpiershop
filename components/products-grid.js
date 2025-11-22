import { getProducts } from '../services/sheets-service.js';

class ProductsGrid extends HTMLElement {

    renderProducts(products) {
        this.innerHTML = `
            <div class="products-grid">
                ${products.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">$${product.price}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('products-grid', ProductsGrid);