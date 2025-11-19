class RelatedProducts extends HTMLElement {
    connectedCallback() {
        const products = JSON.parse(this.getAttribute('products') || '[]');
        
        this.innerHTML = `
            <section class="related-products">
                <h2>Productos relacionados</h2>
                <products-grid products='${JSON.stringify(products)}'></products-grid>
            </section>
        `;
    }
}

customElements.define('related-products', RelatedProducts);