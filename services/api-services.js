const API_URL = 'http://localhost:8000';
export async function getProducts() {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error('Error al cargar productos');
    return res.json();
}
export async function getProduct(id) {
    const res = await fetch(`${API_URL}/productos/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
}
