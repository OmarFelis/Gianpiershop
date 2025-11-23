import { getCategories } from '../services/api-services.js';

class CategoryFilter extends HTMLElement {
    connectedCallback() {
        this.renderLoading();
        this.loadCategories();
    }

    async loadCategories() {
        try {
            const categories = await getCategories();
            this.renderCategories(categories);
        } catch (err) {
            console.error(err);
            this.renderError();
        }
    }

    renderLoading() {
        this.innerHTML = `
            <div class="category-filter">
                <h3>Categorías</h3>
                <p>Cargando...</p>
            </div>
        `;
    }

    renderError() {
        this.innerHTML = `
            <div class="category-filter">
                <h3>Categorías</h3>
                <p>No pudimos cargar las categorías.</p>
            </div>
        `;
    }

    renderCategories(categories) {
        if (!categories || !categories.length) {
            this.innerHTML = `
                <div class="category-filter">
                    <h3>Categorías</h3>
                    <p>No hay categorías.</p>
                </div>
            `;
            return;
        }

        const allOption = { id: 'all', nombre: 'Todos' };
        const listado = [allOption, ...categories];

        this.innerHTML = `
            <div class="category-filter">
                <h3>Categorías</h3>
                <div class="category-list">
                    ${listado
                        .map(
                            (category) => `
                        <button class="category-option" data-category="${category.id}">
                            <span>${category.nombre}</span>
                        </button>
                    `
                        )
                        .join('')}
                </div>
            </div>
        `;

        // Marcar "Todos" por defecto
        const defaultOption = this.querySelector('.category-option[data-category="all"]');
        defaultOption && defaultOption.classList.add('active');

        this.addEventListener('click', (e) => {
            if (e.target.closest('.category-option')) {
                const categoryId = e.target.closest('.category-option').dataset.category;
                this.querySelectorAll('.category-option').forEach(btn => btn.classList.remove('active'));
                e.target.closest('.category-option').classList.add('active');
                this.dispatchEvent(
                    new CustomEvent('categorySelected', {
                        detail: { categoryId },
                        bubbles: true,
                    })
                );
            }
        });
    }
}

customElements.define('category-filter', CategoryFilter);
