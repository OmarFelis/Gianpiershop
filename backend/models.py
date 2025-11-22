from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    TIMESTAMP,
    func,
)
from sqlalchemy.orm import relationship

from database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)

    productos = relationship("Producto", back_populates="categoria")


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio_minorista = Column(Float, nullable=False)
    precio_mayorista = Column(Float, nullable=False)
    cantidad_para_mayorista = Column(Integer, default=6)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    destacado = Column(Boolean, default=False)
    creado_en = Column(TIMESTAMP, server_default=func.current_timestamp())

    categoria = relationship("Categoria", back_populates="productos")
    inventario = relationship(
        "Inventario",
        back_populates="producto",
        cascade="all, delete-orphan",
        lazy="joined",
    )
    imagenes = relationship(
        "ImagenProducto",
        back_populates="producto",
        cascade="all, delete-orphan",
        lazy="joined",
    )


class Inventario(Base):
    __tablename__ = "inventario"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    talla = Column(String(10), nullable=False)
    stock_actual = Column(Integer, default=0)
    sku = Column(String(50), nullable=True)

    producto = relationship("Producto", back_populates="inventario")


class ImagenProducto(Base):
    __tablename__ = "imagenes_producto"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    url_imagen = Column(String(500), nullable=False)
    es_principal = Column(Boolean, default=False)

    producto = relationship("Producto", back_populates="imagenes")


class MensajeContacto(Base):
    __tablename__ = "mensajes_contacto"

    id = Column(Integer, primary_key=True, index=True)
    nombre_cliente = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=True)
    mensaje = Column(Text, nullable=False)
    interesado_en_mayorista = Column(Boolean, default=False)
    fecha_envio = Column(TIMESTAMP, server_default=func.current_timestamp())
