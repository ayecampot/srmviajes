from pathlib import Path
from PIL import Image
import os

# ==========================================
# CONFIGURACIÓN
# ==========================================

CARPETA = r"D:\IMAGENES SRMVIAJES"   # <-- Cambiar
LIMITE_KB = 350
CALIDAD_WEBP = 85

# ==========================================

limite_bytes = LIMITE_KB * 1024

total_original = 0
total_webp = 0
convertidas = 0

extensiones = {".png", ".jpg", ".jpeg", ".gif"}

for archivo in Path(CARPETA).rglob("*"):

    if archivo.suffix.lower() not in extensiones:
        continue

    tamaño = archivo.stat().st_size

    if tamaño < limite_bytes:
        continue

    salida = archivo.with_suffix(".webp")

    try:
        with Image.open(archivo) as img:

            # Evita problemas con transparencias/modos raros
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

            img.save(
                salida,
                "WEBP",
                quality=CALIDAD_WEBP,
                method=6
            )

        tamaño_webp = salida.stat().st_size

        total_original += tamaño
        total_webp += tamaño_webp
        convertidas += 1

        ahorro = (1 - tamaño_webp / tamaño) * 100

        print(f"{archivo.name}")
        print(f"   {tamaño/1024:.0f} KB -> {tamaño_webp/1024:.0f} KB ({ahorro:.1f}% menos)\n")

    except Exception as e:
        print(f"Error con {archivo}: {e}")

print("="*50)
print(f"Convertidas: {convertidas}")

if convertidas:
    print(f"Original: {total_original/1024/1024:.2f} MB")
    print(f"WebP:     {total_webp/1024/1024:.2f} MB")
    print(f"Ahorro:   {(1-total_webp/total_original)*100:.1f}%")