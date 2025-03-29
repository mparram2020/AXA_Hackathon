import base64
import os
import json
from google import genai
from google.genai import types

def generate_insurance_recommendations(data: dict) -> dict:
    """
    Generate detailed insurance recommendations using Gemini.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    
    client = genai.Client(api_key=api_key)
    model = "gemini-2.0-flash"
    
    # Prepare input for Gemini
    input_text = f"""
    Based on the following weather and forecast data, generate detailed insurance recommendations:
    {data}
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
        response_text += chunk.text
    
    # Parse and return the JSON response
    return json.loads(response_text)

if __name__ == "__main__":
    sample_data = {
        "location": "New York",
        "forecast": "Heavy rain expected for the next 3 days",
        "temperature": "15°C",
    }
    recommendations = generate_insurance_recommendations(sample_data)
    print(recommendations)
