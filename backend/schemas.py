from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel


# Categorias
class CategoriaBase(BaseModel):
    nombre: str


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaOut(CategoriaBase):
    id: int

    class Config:
        orm_mode = True


# Imagenes
class ImagenBase(BaseModel):
    url_imagen: str
    es_principal: bool = False


class ImagenCreate(ImagenBase):
    pass


class ImagenOut(ImagenBase):
    id: int

    class Config:
        orm_mode = True


# Inventario
class InventarioBase(BaseModel):
    talla: str
    stock_actual: int = 0
    sku: Optional[str] = None


class InventarioCreate(InventarioBase):
    pass


class InventarioOut(InventarioBase):
    id: int

    class Config:
        orm_mode = True


# Productos
class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_minorista: float
    precio_mayorista: float
    cantidad_para_mayorista: int = 6
    categoria_id: int
    destacado: bool = False


class ProductoCrear(ProductoBase):
    pass


class ProductoActualizar(ProductoBase):
    pass


class ProductoOut(ProductoBase):
    id: int
    inventario: List[InventarioOut] = []
    imagenes: List[ImagenOut] = []

    class Config:
        orm_mode = True


# Mensajes de contacto
class MensajeContactoBase(BaseModel):
    nombre_cliente: str
    email: str
    telefono: Optional[str] = None
    mensaje: str
    interesado_en_mayorista: bool = False


class MensajeContactoCreate(MensajeContactoBase):
    pass


class MensajeContactoOut(MensajeContactoBase):
    id: int
    fecha_envio: Optional[datetime] = None

    class Config:
        orm_mode = True
