from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text # Para escribir SQL directo
from database import get_db
from typing import List
from fastapi import status
from schemas import ProductoCrear

app = FastAPI(title="API Catalogo Bikinis")

@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido a la API de Bikinis"}

@app.get("/productos")
def obtener_productos(db: Session = Depends(get_db)):
    """
    Obtiene todos los productos con su precio y categoría.
    """
    # 1. Ejecutamos el query SQL directo
    resultado = db.execute(text("SELECT * FROM productos"))
    
    # 2. Convertimos los resultados a una lista de diccionarios
    # (En producción haríamos esto con Modelos ORM, pero así entiendes qué pasa)
    lista_productos = []
    for row in resultado:
        # Convertimos la fila de la BD a un diccionario Python
        producto = {
            "id": row.id,
            "nombre": row.nombre,
            "precio_unitario": row.precio_minorista,
            "precio_mayorista": row.precio_mayorista,
            "categoria_id": row.categoria_id,
            "destacado": row.destacado
        }
        lista_productos.append(producto)
        
    return lista_productos

@app.get("/productos/{producto_id}")
def detalle_producto(producto_id: int, db: Session = Depends(get_db)):
    """
    Obtiene el detalle, incluyendo TALLAS y FOTOS
    """
    # Buscar info basica
    prod = db.execute(text(f"SELECT * FROM productos WHERE id = {producto_id}")).first()
    
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Buscar tallas (Inventario)
    tallas = db.execute(text(f"SELECT talla, stock_actual FROM inventario WHERE producto_id = {producto_id}"))
    lista_tallas = [{"talla": t.talla, "stock": t.stock_actual} for t in tallas]
    
    # Buscar fotos
    fotos = db.execute(text(f"SELECT url_imagen FROM imagenes_producto WHERE producto_id = {producto_id}"))
    lista_fotos = [f.url_imagen for f in fotos]

    return {
        "info": {
            "nombre": prod.nombre,
            "descripcion": prod.descripcion,
            "precio": prod.precio_minorista
        },
        "tallas_disponibles": lista_tallas,
        "galeria": lista_fotos
    }

    #validar producto ya existe
@app.post("/productos", status_code=status.HTTP_201_CREATED)
def crear_producto(producto: ProductoCrear, db: Session = Depends(get_db)):
    
    sql = text("""
        INSERT INTO productos 
        (nombre, descripcion, precio_minorista, precio_mayorista, cantidad_para_mayorista, categoria_id, destacado)
        VALUES 
        (:nom, :desc, :p_min, :p_may, :cant, :cat, :dest)
    """)

    # Ejecutar insert
    db.execute(sql, {
        "nom": producto.nombre,
        "desc": producto.descripcion,
        "p_min": producto.precio_minorista,
        "p_may": producto.precio_mayorista,
        "cant": producto.cantidad_para_mayorista,
        "cat": producto.categoria_id,
        "dest": producto.destacado
    })

    # Confirmar cambios
    db.commit()

    # Obtener el ID del nuevo producto
    nuevo_id = db.execute(text("SELECT LAST_INSERT_ID()")).scalar()

    return {
        "mensaje": "Producto creado exitosamente",
        "id_nuevo": nuevo_id
    }

@app.put("/productos/{producto_id}")
def actualizar_producto(producto_id: int, producto: ProductoCrear, db: Session = Depends(get_db)):

    # Verificar que el producto existe
    existe = db.execute(text("SELECT id FROM productos WHERE id = :id"), {"id": producto_id}).first()
    if not existe:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    sql = text("""
        UPDATE productos SET 
            nombre = :nom,
            descripcion = :desc,
            precio_minorista = :p_min,
            precio_mayorista = :p_may,
            cantidad_para_mayorista = :cant,
            categoria_id = :cat,
            destacado = :dest
        WHERE id = :id
    """)

    db.execute(sql, {
        "nom": producto.nombre,
        "desc": producto.descripcion,
        "p_min": producto.precio_minorista,
        "p_may": producto.precio_mayorista,
        "cant": producto.cantidad_para_mayorista,
        "cat": producto.categoria_id,
        "dest": producto.destacado,
        "id": producto_id
    })

    db.commit()

    return {"mensaje": "Producto actualizado correctamente"}

@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):

    # Verificar si existe
    existe = db.execute(text("SELECT id FROM productos WHERE id = :id"), {"id": producto_id}).first()
    if not existe:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    sql = text("DELETE FROM productos WHERE id = :id")
    db.execute(sql, {"id": producto_id})
    db.commit()

    return {"mensaje": "Producto eliminado correctamente"}

