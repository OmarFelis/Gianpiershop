class ProductsGrid extends HTMLElement {
    connectedCallback() {
        const products = JSON.parse(this.getAttribute('products') || '[]');
        const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        
        this.innerHTML = `
            <div class="products-grid">
                ${products.map(product => `
                    <div class="product-card" onclick="window.location.href='${basePath}detalle.html'">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">S/ ${product.price}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('products-grid', ProductsGrid);