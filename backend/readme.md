# 1. Crear el entorno virtual (se creará una carpeta llamada venv)
python -m venv venv

# 2. Activarlo (Verás que aparece un (venv) verde a la izquierda)
.\venv\Scripts\activate

# 3. Ahora instala las cosas DENTRO de este entorno
pip install fastapi uvicorn sqlalchemy pymysql o pip requirements.txt

# 4. Ahora sí funcionará el comando directo
uvicorn main:app --reload

# 5. En la url escribe /http://127.0.0.1:8000/docs#/