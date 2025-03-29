import base64
import os
import json
from google import genai
from google.genai import types

def generate_insurance_recommendations(data: dict) -> dict:
    """
    Generate detailed insurance recommendations or process accident descriptions using Gemini.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    
    client = genai.Client(api_key=api_key)
    model = "gemini-2.5-pro-exp-03-25"
    
    # Prepare input for Gemini
    input_text = f"""
    Dado el siguiente caso de accidente y la información del seguro proporcionada, sigue este protocolo rígido para generar un JSON con los siguientes campos:

    1. `facts` (array de strings): Extrae exactamente los puntos factuales necesarios para que la compañía de seguros pueda procesar el caso. 
       Incluye información como:
       - Fecha y hora del accidente.
       - Lugar exacto del accidente.
       - Tipo de vehículo involucrado.
       - Daños sufridos por el vehículo.
       - Daños sufridos por terceros (personas o propiedades).
       - Causa del accidente (si es conocida).
       - Condiciones climáticas en el momento del accidente.
       - Uso del vehículo en el momento del accidente (particular/profesional).
       - Cualquier otra información relevante del caso.

    2. `unanswered_questions` (array de strings): Incluye únicamente preguntas necesarias para completar los puntos factuales que no se pudieron determinar a partir de la descripción del accidente. 
       Si todos los puntos factuales están completos, este campo debe estar vacío.

    Caso de accidente:
    {data['accident_description']}
    
    Información del seguro:
    {data['insurance_data']}
    
    Genera el JSON de salida.
    """
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=input_text),
            ],
        ),
    ]
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
        raise ValueError(f"Failed to parse JSON response: {response_text}") from e

if __name__ == "__main__":
    sample_data = {
        "accident_description": "A tractor collided with a tree during heavy rain.",
        "insurance_data": {
            "policy_number": "12345",
            "coverage": ["Collision", "Weather-related damages"],
        },
    }
    recommendations = generate_insurance_recommendations(sample_data)
    print(recommendations)
