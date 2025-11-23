class RelatedProducts extends HTMLElement {
    connectedCallback() {
        // Reutiliza el grid, que ya carga desde la API
        this.innerHTML = `
            <section class="related-products">
                <h2>Productos relacionados</h2>
                <products-grid></products-grid>
            </section>
        `;
    }
}

customElements.define('related-products', RelatedProducts);
