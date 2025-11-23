class Breadcrumb extends HTMLElement {
    connectedCallback() {
        const items = JSON.parse(this.getAttribute('items') || '[]');
        
        this.innerHTML = `
            <nav class="breadcrumb">
                ${items.map((item, index) => `
                    <span class="breadcrumb-item ${index === items.length - 1 ? 'active' : ''}">
                        ${index === items.length - 1 ? item.name : `<a href="${item.url}">${item.name}</a>`}
                    </span>
                    ${index < items.length - 1 ? '<span class="breadcrumb-separator">></span>' : ''}
                `).join('')}
            </nav>
        `;
    }
}

customElements.define('breadcrumb-nav', Breadcrumb);