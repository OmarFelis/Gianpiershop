from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import (
    Categoria,
    ImagenProducto,
    Inventario,
    MensajeContacto,
    Producto,
)
from schemas import (
    CategoriaCreate,
    CategoriaOut,
    ImagenCreate,
    ImagenOut,
    InventarioCreate,
    InventarioOut,
    MensajeContactoCreate,
    MensajeContactoOut,
    ProductoActualizar,
    ProductoCrear,
    ProductoOut,
)

app = FastAPI(title="API Catalogo Bikinis")


@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido a la API de Bikinis"}


# -------------------- Productos --------------------
@app.get("/productos", response_model=List[ProductoOut])
def obtener_productos(db: Session = Depends(get_db)):
    """Lista todos los productos con tallas e imágenes."""
    productos = (
        db.query(Producto)
        .options(
            joinedload(Producto.inventario),
            joinedload(Producto.imagenes),
        )
        .all()
    )
    return productos


@app.get("/productos/{producto_id}", response_model=ProductoOut)
def detalle_producto(producto_id: int, db: Session = Depends(get_db)):
    """Detalle de un producto, incluyendo inventario e imágenes."""
    producto = (
        db.query(Producto)
        .options(
            joinedload(Producto.inventario),
            joinedload(Producto.imagenes),
        )
        .filter(Producto.id == producto_id)
        .first()
    )

    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return producto


@app.post("/productos", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def crear_producto(producto: ProductoCrear, db: Session = Depends(get_db)):
    """Crea un producto usando SQLAlchemy ORM."""
    nuevo_producto = Producto(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto


@app.put("/productos/{producto_id}", response_model=ProductoOut)
def actualizar_producto(
    producto_id: int, producto: ProductoActualizar, db: Session = Depends(get_db)
):
    """Actualiza todos los campos de un producto."""
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for campo, valor in producto.dict().items():
        setattr(producto_db, campo, valor)

    db.commit()
    db.refresh(producto_db)
    return producto_db


@app.delete("/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    """Elimina un producto y sus relaciones."""
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(producto_db)
    db.commit()
    return None


# -------------------- Categorias --------------------
@app.get("/categorias", response_model=List[CategoriaOut])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).all()


@app.post("/categorias", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    existente = db.query(Categoria).filter(Categoria.nombre == categoria.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="La categoría ya existe")
    nueva_categoria = Categoria(**categoria.dict())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria


@app.put("/categorias/{categoria_id}", response_model=CategoriaOut)
def actualizar_categoria(
    categoria_id: int, categoria: CategoriaCreate, db: Session = Depends(get_db)
):
    categoria_db = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria_db:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    categoria_db.nombre = categoria.nombre
    db.commit()
    db.refresh(categoria_db)
    return categoria_db


@app.delete("/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria_db = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria_db:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    db.delete(categoria_db)
    db.commit()
    return None


# -------------------- Inventario --------------------
def _get_producto_or_404(db: Session, producto_id: int) -> Producto:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@app.get(
    "/productos/{producto_id}/inventario", response_model=List[InventarioOut]
)
def listar_inventario(producto_id: int, db: Session = Depends(get_db)):
    _get_producto_or_404(db, producto_id)
    return (
        db.query(Inventario)
        .filter(Inventario.producto_id == producto_id)
        .all()
    )


@app.post(
    "/productos/{producto_id}/inventario",
    response_model=InventarioOut,
    status_code=status.HTTP_201_CREATED,
)
def agregar_inventario(
    producto_id: int, item: InventarioCreate, db: Session = Depends(get_db)
):
    _get_producto_or_404(db, producto_id)
    nuevo_item = Inventario(producto_id=producto_id, **item.dict())
    db.add(nuevo_item)
    db.commit()
    db.refresh(nuevo_item)
    return nuevo_item


@app.put("/inventario/{inventario_id}", response_model=InventarioOut)
def actualizar_inventario(
    inventario_id: int, item: InventarioCreate, db: Session = Depends(get_db)
):
    inventario_db = db.query(Inventario).filter(Inventario.id == inventario_id).first()
    if not inventario_db:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")

    for campo, valor in item.dict().items():
        setattr(inventario_db, campo, valor)

    db.commit()
    db.refresh(inventario_db)
    return inventario_db


@app.delete("/inventario/{inventario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_inventario(inventario_id: int, db: Session = Depends(get_db)):
    inventario_db = db.query(Inventario).filter(Inventario.id == inventario_id).first()
    if not inventario_db:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")

    db.delete(inventario_db)
    db.commit()
    return None


# -------------------- Imágenes --------------------
@app.get(
    "/productos/{producto_id}/imagenes", response_model=List[ImagenOut]
)
def listar_imagenes(producto_id: int, db: Session = Depends(get_db)):
    _get_producto_or_404(db, producto_id)
    return (
        db.query(ImagenProducto)
        .filter(ImagenProducto.producto_id == producto_id)
        .all()
    )


@app.post(
    "/productos/{producto_id}/imagenes",
    response_model=ImagenOut,
    status_code=status.HTTP_201_CREATED,
)
def agregar_imagen(
    producto_id: int, imagen: ImagenCreate, db: Session = Depends(get_db)
):
    _get_producto_or_404(db, producto_id)
    nueva_imagen = ImagenProducto(producto_id=producto_id, **imagen.dict())
    db.add(nueva_imagen)
    db.commit()
    db.refresh(nueva_imagen)
    return nueva_imagen


@app.put("/imagenes/{imagen_id}", response_model=ImagenOut)
def actualizar_imagen(
    imagen_id: int, imagen: ImagenCreate, db: Session = Depends(get_db)
):
    imagen_db = (
        db.query(ImagenProducto).filter(ImagenProducto.id == imagen_id).first()
    )
    if not imagen_db:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    for campo, valor in imagen.dict().items():
        setattr(imagen_db, campo, valor)

    db.commit()
    db.refresh(imagen_db)
    return imagen_db


@app.delete("/imagenes/{imagen_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_imagen(imagen_id: int, db: Session = Depends(get_db)):
    imagen_db = (
        db.query(ImagenProducto).filter(ImagenProducto.id == imagen_id).first()
    )
    if not imagen_db:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    db.delete(imagen_db)
    db.commit()
    return None


# -------------------- Mensajes de contacto --------------------
@app.post(
    "/mensajes_contacto",
    response_model=MensajeContactoOut,
    status_code=status.HTTP_201_CREATED,
)
def crear_mensaje_contacto(
    mensaje: MensajeContactoCreate, db: Session = Depends(get_db)
):
    nuevo_mensaje = MensajeContacto(**mensaje.dict())
    db.add(nuevo_mensaje)
    db.commit()
    db.refresh(nuevo_mensaje)
    return nuevo_mensaje


@app.get(
    "/mensajes_contacto", response_model=List[MensajeContactoOut]
)
def listar_mensajes_contacto(db: Session = Depends(get_db)):
    return db.query(MensajeContacto).order_by(MensajeContacto.fecha_envio.desc()).all()


@app.get(
    "/mensajes_contacto/{mensaje_id}", response_model=MensajeContactoOut
)
def obtener_mensaje_contacto(mensaje_id: int, db: Session = Depends(get_db)):
    mensaje_db = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.id == mensaje_id)
        .first()
    )
    if not mensaje_db:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    return mensaje_db

# -------------------- Contacto --------------------
@app.post(
    "/mensajes_contacto",
    response_model=MensajeContactoOut,
    status_code=status.HTTP_201_CREATED,
)
def crear_mensaje_contacto(
    mensaje: MensajeContactoCreate, db: Session = Depends(get_db)
):
    """Crear nuevo mensaje de contacto desde el formulario público."""
    nuevo_mensaje = MensajeContacto(**mensaje.dict())
    db.add(nuevo_mensaje)
    db.commit()
    db.refresh(nuevo_mensaje)
    return nuevo_mensaje


@app.get(
    "/mensajes_contacto", response_model=List[MensajeContactoOut]
)
def listar_mensajes_contacto(db: Session = Depends(get_db)):
    """Listar todos los mensajes ordenados por fecha (más reciente primero)."""
    return db.query(MensajeContacto).order_by(MensajeContacto.fecha_envio.desc()).all()


@app.get(
    "/mensajes_contacto/{mensaje_id}", response_model=MensajeContactoOut
)
def obtener_mensaje_contacto(mensaje_id: int, db: Session = Depends(get_db)):
    """Obtener un mensaje específico por ID."""
    mensaje_db = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.id == mensaje_id)
        .first()
    )
    if not mensaje_db:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    return mensaje_db

@app.delete(
    "/mensajes_contacto/{mensaje_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_mensaje_contacto(mensaje_id: int, db: Session = Depends(get_db)):
    """Eliminar un mensaje de contacto."""
    mensaje_db = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.id == mensaje_id)
        .first()
    )
    if not mensaje_db:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    
    db.delete(mensaje_db)
    db.commit()
    return None


@app.get("/mensajes_contacto/filtrar/mayoristas", response_model=List[MensajeContactoOut])
def listar_interesados_mayorista(db: Session = Depends(get_db)):
    """Listar solo los mensajes de clientes interesados en ventas mayoristas."""
    return (
        db.query(MensajeContacto)
        .filter(MensajeContacto.interesado_en_mayorista == True)
        .order_by(MensajeContacto.fecha_envio.desc())
        .all()
    )


@app.get("/mensajes_contacto/buscar/email/{email}", response_model=List[MensajeContactoOut])
def buscar_por_email(email: str, db: Session = Depends(get_db)):
    """Buscar todos los mensajes de un email específico."""
    mensajes = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.email == email)
        .order_by(MensajeContacto.fecha_envio.desc())
        .all()
    )
    if not mensajes:
        raise HTTPException(
            status_code=404, 
            detail=f"No se encontraron mensajes para el email: {email}"
        )
    return mensajes


@app.get("/mensajes_contacto/estadisticas/resumen")
def obtener_estadisticas_mensajes(db: Session = Depends(get_db)):
    """Obtener estadísticas generales de los mensajes de contacto."""
    from datetime import datetime, timedelta
    
    total = db.query(MensajeContacto).count()
    interesados_mayorista = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.interesado_en_mayorista == True)
        .count()
    )
    
    # Mensajes de los últimos 7 días
    hace_7_dias = datetime.now() - timedelta(days=7)
    recientes = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.fecha_envio >= hace_7_dias)
        .count()
    )
    
    # Mensajes del último mes
    hace_30_dias = datetime.now() - timedelta(days=30)
    ultimo_mes = (
        db.query(MensajeContacto)
        .filter(MensajeContacto.fecha_envio >= hace_30_dias)
        .count()
    )
    
    return {
        "total_mensajes": total,
        "interesados_mayorista": interesados_mayorista,
        "mensajes_ultima_semana": recientes,
        "mensajes_ultimo_mes": ultimo_mes,
        "porcentaje_mayorista": round((interesados_mayorista / total * 100), 2) if total > 0 else 0
    }


@app.get("/mensajes_contacto/recientes/ultimos")
def obtener_ultimos_mensajes(
    limite: int = 10, 
    db: Session = Depends(get_db)
):
    """Obtener los últimos N mensajes (por defecto 10)."""
    if limite > 100:
        raise HTTPException(
            status_code=400, 
            detail="El límite máximo es 100 mensajes"
        )
    
    mensajes = (
        db.query(MensajeContacto)
        .order_by(MensajeContacto.fecha_envio.desc())
        .limit(limite)
        .all()
    )
    
    return {
        "total_mostrados": len(mensajes),
        "mensajes": [
            {
                "id": m.id,
                "nombre_cliente": m.nombre_cliente,
                "email": m.email,
                "asunto": m.asunto,
                "fecha_envio": m.fecha_envio,
                "interesado_en_mayorista": m.interesado_en_mayorista
            }
            for m in mensajes
        ]
    }