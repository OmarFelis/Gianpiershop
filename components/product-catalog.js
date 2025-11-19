class ProductCatalog extends HTMLElement {
    connectedCallback() {
        const products = this.getAttribute('products') || '[]';
        
        this.innerHTML = `
            <section class="catalog-section">
                <div class="catalog-container">
                    <div class="section-header">
<<<<<<< HEAD
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
=======
                        <category-icons></category-icons>
>>>>>>> a100fb57f56acec7166d6aec0f6fdc3ba4ce893e
                    </div>
                    <products-grid products='${products}'></products-grid>
                </div>
            </section>
        `;
    }
}

customElements.define('product-catalog', ProductCatalog);