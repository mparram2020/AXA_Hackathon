from fastapi import FastAPI, Query, HTTPException
from typing import Dict
from pydantic import BaseModel
from src.aemet import get_weather_data, get_forecast_data, get_climatological_data
from gemini import generate_insurance_recommendations

app = FastAPI()

class AccidentDescription(BaseModel):
    accident_description: str

@app.get("/")
def root():
    return {"message": "Welcome to the Insurance Prediction API"}

@app.get("/predict")
def predict_insurance(lat: float = Query(..., description="Latitude of the location"),
                      lon: float = Query(..., description="Longitude of the location"),
                      municipio: str = Query(..., description="Municipality name"),
                      idema: str = Query(..., description="Station ID for climatological data"),
                      fecha_ini: str = Query(..., description="Start date for climatological data (YYYY-MM-DD)"),
                      fecha_fin: str = Query(..., description="End date for climatological data (YYYY-MM-DD)")) -> Dict:
    """
    Predict specific insurance coverage based on location coordinates and weather data.
    """
    try:
        # Fetch weather observation data
        weather_data = get_weather_data(lat, lon)
        
        # Fetch daily forecast data for the municipality
        forecast_data = get_forecast_data(municipio)
        
        # Fetch climatological data for the specified station and date range
        climatological_data = get_climatological_data(fecha_ini, fecha_fin, idema)
        
        # Extract relevant weather-related information
        rain_info = weather_data.get("rain", "No data")
        fire_risk = forecast_data.get("fire_risk", "No data")
        region = weather_data.get("region", "Unknown region")
        
        # Combine extracted data
        aemet_info = {
            "rain_info": rain_info,
            "fire_risk": fire_risk,
            "region": region,
            "climatological_data": climatological_data
        }
        
        # Debug print for AEMET info (limited to relevant fields)
        print("AEMET Info (Debug):", aemet_info)
        
        # Pass AEMET info to Gemini for generating specific insurance coverage
        recommendations = generate_insurance_recommendations(aemet_info)
        
        # Debug print for Gemini result
        print("Gemini Recommendations (Debug):", recommendations)
        
        # Return the response
        return {
            "location": {"latitude": lat, "longitude": lon},
            "aemet_info": aemet_info,
            "insurance_recommendations": recommendations
        }
    except Exception as e:
        # Handle errors and return a meaningful message
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the request.")

@app.post("/process_accident")
def process_accident(accident: AccidentDescription) -> Dict:
    """
    Process an accident description and generate a JSON response with facts and unanswered questions.
    """
    try:
        # Load insurance data from seguro.md
        with open("data/seguro.md", "r", encoding="utf-8") as file:
            insurance_data = file.read()
        
        # Prepare data for Gemini
        gemini_input = {
            "accident_description": accident.accident_description,
            "insurance_data": insurance_data
        }
        
        # Generate response using Gemini
        response = generate_insurance_recommendations(gemini_input)
        
        # Debug print for Gemini result
        print("Gemini Accident Processing (Debug):", response)
        
        # Return the response
        return {
            "accident_description": accident.accident_description,
            "insurance_response": response
        }
    except Exception as e:
        # Handle errors and return a meaningful message
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the accident description.")
