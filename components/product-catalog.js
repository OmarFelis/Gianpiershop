class ProductCatalog extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section class="catalog-section">
                <div class="catalog-container">
                    <div class="section-header">
                        <category-icons></category-icons>
                    </div>
                    <h2 class="section-title">Novedades</h2>
                    <products-grid></products-grid>
                </div>
            </section>
        `;
    }
}

customElements.define('product-catalog', ProductCatalog);
