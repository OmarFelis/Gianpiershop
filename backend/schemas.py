from pydantic import BaseModel
from typing import Optional

# Este modelo define qué datos te tiene que enviar el Frontend (React/HTML)
class ProductoCrear(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_minorista: float
    precio_mayorista: float
    cantidad_para_mayorista: int = 6
    categoria_id: int
    destacado: bool = False