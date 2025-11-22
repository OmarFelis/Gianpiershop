class ProductCatalog extends HTMLElement {
    connectedCallback() {
        const products = JSON.parse(this.getAttribute('products') || '[]');
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        
        this.innerHTML = `
            <section class="catalog-section">
                <div class="catalog-container">
                    <div class="section-header">
                        <category-icons></category-icons>
                    </div>
                    <h2 class="section-title">Novedades</h2>
                    <products-grid products='${JSON.stringify(products)}'></products-grid>
                </div>
            </section>
        `;
    }
}

customElements.define('product-catalog', ProductCatalog);