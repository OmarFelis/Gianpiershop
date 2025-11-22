from pydantic import BaseModel
from typing import List, Optional


# Esquema para el Inventario (Tallas)
class InventarioSchema(BaseModel):
    talla: str
    stock_actual: int

# Esquema para las Imágenes
class ImagenSchema(BaseModel):
    url_imagen: str
    es_principal: bool

# ... (debajo de lo que ya tienes en la foto)

# Esquema Principal de Producto
class ProductoSchema(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio_minorista: float
    precio_mayorista: float
    categoria_id: int
    
    # Aquí anidamos las listas (Un producto tiene tallas y fotos)
    # Nota: Esto requerirá un poco de lógica extra en la consulta SQL
    # Para empezar simple, devolvamos los datos básicos primero.
    
    class Config:
        orm_mode = True