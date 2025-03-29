import base64
import os
import json
from google import genai
from google.genai import types

def generate_insurance_recommendations(data: dict) -> dict:
    """
    Generate detailed insurance recommendations or analyze vehicle condition using Gemini.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    
    client = genai.Client(api_key=api_key)
    model = "gemini-2.5-pro-exp-03-25"
    
    # Prepare input for Gemini
    input_text = f"""
    Dado el siguiente texto que describe la condición del vehículo y la información de cobertura proporcionada, sigue este protocolo rígido para generar un JSON con los siguientes campos:

    1. `coverage_analysis` (array de objetos): Cada objeto debe contener:
        - `item` (string): El nombre de la cobertura o exclusión.
        - `is_covered` (boolean): Indica si está cubierto o no.
        - `explanation` (string): Una breve explicación de por qué está cubierto o no.

    Descripción del vehículo:
    {data['description']}
    
    Información de cobertura:
    {data['coverage_data']}
    
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
        "description": "The car has minor scratches and a dent on the rear bumper.",
        "coverage_data": {
            "policy_number": "12345",
            "coverage": ["Collision", "Theft", "Weather-related damages"],
        },
    }
    recommendations = generate_insurance_recommendations(sample_data)
    print(recommendations)
