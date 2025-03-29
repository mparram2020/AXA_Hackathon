import os
import json
import base64
from google import genai
from google.genai import types
from PIL import Image

def process_image_with_gemini(image_path: str) -> dict:
    """
    Procesa una imagen usando Gemini para identificar el modelo del tractor, analizar el problema del seguro y determinar lo ocurrido.
    """
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("La variable de entorno GEMINI_API_KEY no está configurada.")
        
        client = genai.Client(api_key=api_key)
        model = "gemini-2.0-flash"
        
        # Abrir y convertir la imagen para asegurar compatibilidad
        try:
            with Image.open(image_path) as img:
                converted_image_path = "/tmp/converted_image.png"
                img.save(converted_image_path, format="PNG")
                print(f"Imagen convertida y guardada en {converted_image_path}")
        except Exception as e:
            print(f"Error al convertir la imagen: {e}")
            raise ValueError("No se pudo convertir la imagen a un formato compatible.")
        
        # Leer y cargar la imagen convertida
        try:
            with open(converted_image_path, "rb") as image_file:
                image_data = image_file.read()
                print(f"Imagen cargada exitosamente, tamaño: {len(image_data)} bytes")
        except Exception as e:
            print(f"Error al leer la imagen: {e}")
            raise ValueError("No se pudo leer la imagen.")
        
        # Preparar entrada para Gemini
        input_text = """
        Analiza la imagen proporcionada para identificar el modelo del tractor, determinar el problema del seguro y explicar lo ocurrido.
        Proporciona los siguientes detalles en formato JSON:
        - `modelo_tractor` (string): El modelo identificado del tractor.
        - `evaluacion_daños` (objeto): Un desglose detallado de los daños observados en la imagen.
            - `daños_vehiculo` (array de strings): Lista de daños al tractor.
            - `daños_terceros` (array de strings): Lista de daños a propiedades o personas de terceros.
        - `analisis_incidente` (string): Una explicación detallada de lo ocurrido basada en la imagen.
        - `recomendaciones_seguro` (array de strings): Recomendaciones para coberturas o reclamaciones de seguro basadas en el análisis.
        """
        try:
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=input_text),
                        types.Part.from_bytes(data=image_data, mime_type="image/png"),
                    ],
                ),
            ]
        except Exception as e:
            print(f"Error al crear las partes del contenido: {e}")
            raise
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="application/json",
        )
        
        # Generar respuesta
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:  # Asegurarse de que chunk.text no sea None
                response_text += chunk.text
        
        # Analizar y devolver la respuesta JSON
        try:
            return json.loads(response_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"No se pudo analizar la respuesta JSON: {response_text}") from e
    except Exception as e:
        # Registrar el error para depuración
        print(f"Error en process_image_with_gemini: {e}")
        raise

def process_image_for_insurance_creation(image_path: str) -> dict:
    """
    Process an image to extract data for insurance creation, including tractor model, condition, color, year, etc.
    """
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("La variable de entorno GEMINI_API_KEY no está configurada.")
        
        client = genai.Client(api_key=api_key)
        model = "gemini-2.0-flash"
        
        # Open and convert the image to ensure compatibility
        try:
            with Image.open(image_path) as img:
                converted_image_path = "/tmp/converted_image.png"
                img.save(converted_image_path, format="PNG")
                print(f"Imagen convertida y guardada en {converted_image_path}")
        except Exception as e:
            print(f"Error al convertir la imagen: {e}")
            raise ValueError("No se pudo convertir la imagen a un formato compatible.")
        
        # Read and load the converted image
        try:
            with open(converted_image_path, "rb") as image_file:
                image_data = image_file.read()
                print(f"Imagen cargada exitosamente, tamaño: {len(image_data)} bytes")
        except Exception as e:
            print(f"Error al leer la imagen: {e}")
            raise ValueError("No se pudo leer la imagen.")
        
        # Prepare input for Gemini
        input_text = """
        Analiza la imagen proporcionada para extraer datos relevantes para la creación de un seguro.
        Proporciona los siguientes detalles en formato JSON:
        - `modelo_tractor` (string): El modelo identificado del tractor.
        - `condicion` (string): Una descripción del estado físico del tractor.
        - `color` (string): El color del tractor.
        - `año` (integer): El año de fabricación del tractor.
        - `descripcion_adicional` (string): Cualquier información adicional relevante observada en la imagen.
        """
        try:
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=input_text),
                        types.Part.from_bytes(data=image_data, mime_type="image/png"),
                    ],
                ),
            ]
        except Exception as e:
            print(f"Error al crear las partes del contenido: {e}")
            raise
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="application/json",
        )
        
        # Generate response
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:  # Ensure chunk.text is not None
                response_text += chunk.text
        
        # Parse and return the JSON response
        try:
            return json.loads(response_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"No se pudo analizar la respuesta JSON: {response_text}") from e
    except Exception as e:
        # Log the error for debugging
        print(f"Error en process_image_for_insurance_creation: {e}")
        raise
