class ProductCatalog extends HTMLElement {
    connectedCallback() {
        const products = JSON.parse(this.getAttribute('products') || '[]');
        
        this.innerHTML = `
            <section class="catalog-section">
                <div class="catalog-container">
                    <div class="section-header">
                        <div class="category-icons">
                            <div class="category-item">
                                <div class="icon">
                                    <img src="public/assets-img/bikini1.png" alt="Bikinis" class="icon-image">
                                </div>
                                <span>Bikinis</span>
                            </div>
                            <div class="category-item">
                                <div class="icon"><img src="public/assets-img/bikini2.png" alt="Enteros" class="icon-image"></div>
                                <span>Enteros</span>
                            </div>
                        </div>
                    </div>
                    <h2 class="section-title">Novedades</h2>
                    <div class="products-grid">
                        ${products.map(product => `
                            <div class="product-card">
                                <img src="${product.image}" alt="${product.name}" class="product-image">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-price">S/ ${product.price}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('product-catalog', ProductCatalog);