class CategoryIcons extends HTMLElement {
    connectedCallback() {
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        
        this.innerHTML = `
            <div class="category-icons">
                <div class="category-square">
                    <div class="category-item">
                        <div class="icon"><img src="${basePath}public/assets-img/bikini1.png" alt="Bikinis"></div>
                        <span>Bikinis</span>
                    </div>
                </div>
                <div class="category-square">
                    <div class="category-item">
                        <div class="icon"><img src="${basePath}public/assets-img/bikini2.png" alt="Enteros"></div>
                        <span>Enteros</span>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('category-icons', CategoryIcons);