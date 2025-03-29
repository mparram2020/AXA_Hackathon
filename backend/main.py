from fastapi import FastAPI, Query
from typing import Dict
from src.aemet import get_weather_data, get_forecast_data
from gemini import generate_insurance_recommendations

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to the Insurance Prediction API"}

@app.get("/predict")
def predict_insurance(lat: float = Query(..., description="Latitude of the location"),
                      lon: float = Query(..., description="Longitude of the location")) -> Dict:
    """
    Predict useful insurance specifications based on location coordinates.
    """
    # Fetch weather data and forecast data using AEMET API
    weather_data = get_weather_data(lat, lon)
    forecast_data = get_forecast_data(lat, lon)
    
    # Combine weather and forecast data
    combined_data = {
        "current_weather": weather_data,
        "forecast": forecast_data
    }
    
    # Generate detailed insurance recommendations using Gemini
    recommendations = generate_insurance_recommendations(combined_data)

    return {
        "location": {"latitude": lat, "longitude": lon},
        "weather_data": combined_data,
        "insurance_recommendations": recommendations
    }
