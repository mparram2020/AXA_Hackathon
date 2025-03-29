import json
import os
from fastapi import FastAPI, Query, HTTPException, File, UploadFile, Body
from typing import Dict
from pydantic import BaseModel
from src.aemet import get_weather_data, get_forecast_data, get_climatological_data
from gemini import generate_insurance_recommendations
from src.image_proc import process_image_with_gemini, process_image_for_insurance_creation

INSURANCE_FILE = "/home/guillermo/hackathon/AXA_Hackathon/backend/data/insurances.json"

app = FastAPI()

class AccidentDescription(BaseModel):
    accident_description: str

class InsuranceData(BaseModel):
    modelo_tractor: str
    condicion: str
    color: str
    año: int
    descripcion_adicional: str
    coordinates: tuple[float, float]
    garaje: bool

@app.get("/")
def root():
    return {"message": "Welcome to the Insurance Prediction API"}

@app.post("/save_insurance")
def save_insurance(insurance: InsuranceData) -> Dict:
    """
    Save new insurance data to a JSON file.
    """
    try:
        # Load existing insurances
        if os.path.exists(INSURANCE_FILE):
            with open(INSURANCE_FILE, "r", encoding="utf-8") as file:
                insurances = json.load(file)
        else:
            insurances = []

        # Add new insurance
        insurances.append(insurance.dict())

        # Save back to the file
        with open(INSURANCE_FILE, "w", encoding="utf-8") as file:
            json.dump(insurances, file, indent=4, ensure_ascii=False)

        return {"message": "Insurance data saved successfully."}
    except Exception as e:
        print(f"Error in /save_insurance endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while saving the insurance data.")

@app.get("/load_insurances")
def load_insurances() -> Dict:
    """
    Load all saved insurances from the JSON file.
    """
    try:
        # Load insurances from the file
        if os.path.exists(INSURANCE_FILE):
            with open(INSURANCE_FILE, "r", encoding="utf-8") as file:
                insurances = json.load(file)
        else:
            insurances = []

        return {"insurances": insurances}
    except Exception as e:
        print(f"Error in /load_insurances endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while loading the insurance data.")

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

@app.post("/process_image")
async def process_image(file: UploadFile = File(...)) -> Dict:
    """
    Process an image to identify the tractor model, analyze the insurance problem, and determine what happened.
    """
    try:
        # Save the uploaded file temporarily
        file_location = f"/tmp/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        
        # Debug print for file location
        print(f"File saved at {file_location}")
        
        # Process the image using Gemini
        response = process_image_with_gemini(file_location)
        
        # Debug print for Gemini result
        print("Gemini Image Processing (Debug):", response)
        
        # Return the response
        return {
            "file_name": file.filename,
            "image_analysis": response
        }
    except Exception as e:
        # Log the error for debugging
        print(f"Error in /process_image endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")

@app.post("/process_image_for_insurance")
async def process_image_for_insurance(file: UploadFile = File(...)) -> Dict:
    """
    Process an image to extract data for insurance creation, including tractor model, condition, color, year, etc.
    """
    try:
        # Save the uploaded file temporarily
        file_location = f"/tmp/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        
        # Debug print for file location
        print(f"File saved at {file_location}")
        
        # Process the image using Gemini
        response = process_image_for_insurance_creation(file_location)
        
        # Debug print for Gemini result
        print("Gemini Insurance Creation Processing (Debug):", response)
        
        # Return the response
        return {
            "file_name": file.filename,
            "insurance_data": response
        }
    except Exception as e:
        # Log the error for debugging
        print(f"Error in /process_image_for_insurance endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the image for insurance creation.")
