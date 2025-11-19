class CategoryFilter extends HTMLElement {
    connectedCallback() {
        const categories = JSON.parse(this.getAttribute('categories') || '[]');
        
        this.innerHTML = `
            <div class="category-filter">
                <h3>Categorías</h3>
                <div class="category-list">
                    ${categories.map(category => `
                        <div class="category-option" data-category="${category.id}">
                            <span>${category.name}</span>
                            <span class="category-count">(${category.count})</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.addEventListener('click', (e) => {
            if (e.target.closest('.category-option')) {
                const categoryId = e.target.closest('.category-option').dataset.category;
                this.dispatchEvent(new CustomEvent('categorySelected', { 
                    detail: { categoryId },
                    bubbles: true 
                }));
            }
        });
    }
}

customElements.define('category-filter', CategoryFilter);