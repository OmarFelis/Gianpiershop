class ProductCatalog extends HTMLElement {
    connectedCallback() {
        const staticProducts = this.getAttribute('products');

        this.innerHTML = `
                <div class="catalog-container">
                    <div class="section-header">
                        <category-icons></category-icons>
                    </div>
                    <products-grid></products-grid>
                </div>
        `;

        if (staticProducts) {
            const grid = this.querySelector('products-grid');
            if (grid) {
                grid.setAttribute('products', staticProducts);
            }
        }

        // Enlazar filtro de categorías (capturado a nivel window)
        this._onCategorySelected = (e) => {
            const categoryId = e.detail.categoryId;
            const grid = this.querySelector('products-grid');
            if (grid) {
                grid.setAttribute('category-id', categoryId);
                if (!grid.getAttribute('products')) {
                    grid.loadProducts && grid.loadProducts();
                }
            }
        };
        window.addEventListener('categorySelected', this._onCategorySelected);
    }

    disconnectedCallback() {
        this._onCategorySelected &&
            window.removeEventListener('categorySelected', this._onCategorySelected);
    }
}

customElements.define('product-catalog', ProductCatalog);
