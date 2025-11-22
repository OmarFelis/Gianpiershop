from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import middleware

# REEMPLAZA ESTOS DATOS CON LOS DE TU CPANEL
USUARIO = "root"
PASSWORD = "root"
HOST = "localhost:3306" # En cPanel suele ser localhost
NOMBRE_BD = "testgiampiershop"

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{USUARIO}:{PASSWORD}@{HOST}/{NOMBRE_BD}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de BD en cada petición
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()