class ProductCatalog extends HTMLElement {
    connectedCallback() {
        const products = this.getAttribute('products') || '[]';
        
        this.innerHTML = `
            <section class="catalog-section">
                <div class="catalog-container">
                    <div class="section-header">
                        <category-icons></category-icons>
                    </div>
                    <products-grid products='${products}'></products-grid>
                </div>
            </section>
        `;
    }
}

customElements.define('product-catalog', ProductCatalog);