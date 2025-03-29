import json
import json
import os
from fastapi import FastAPI, Query, HTTPException, File, UploadFile, Body
from typing import Dict
from pydantic import BaseModel
from gemini import generate_insurance_recommendations
from src.image_proc import process_image_with_gemini, process_image_for_insurance_creation

import tempfile
import speech_recognition as sr  # Using SpeechRecognition for transcription
from pydub import AudioSegment  # Import pydub for audio conversion

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

@app.post("/create_personalized_insurance")
def create_personalized_insurance(user_input: str = Body(..., embed=True)) -> Dict:
    """
    Create a personalized insurance plan based on the data in seguro.md and user-provided input.
    """
    try:
        # Load insurance data from seguro.md
        with open("data/seguro.md", "r", encoding="utf-8") as file:
            insurance_data = file.read()

        # Prepare data for Gemini
        gemini_input = {
            "user_input": user_input,
            "insurance_data": insurance_data
        }

        # Generate response using Gemini
        response = generate_insurance_recommendations(gemini_input)

        # Debug print for Gemini result
        print("Gemini Personalized Insurance (Debug):", response)

        # Return the response
        return {
            "user_input": user_input,
            "personalized_insurance": response
        }
    except Exception as e:
        # Handle errors and return a meaningful message
        print(f"Error in /create_personalized_insurance endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the personalized insurance.")

@app.post("/analyze_vehicle_condition")
def analyze_vehicle_condition(description: str = Body(..., embed=True)) -> Dict:
    """
    Analyze the vehicle's condition and determine coverage based on the data in cobertura.txt.
    """
    try:
        # Load coverage data from cobertura.txt
        with open("data/cobertura.txt", "r", encoding="utf-8") as file:
            coverage_data = file.read()

        # Prepare data for Gemini
        gemini_input = {
            "description": description,
            "coverage_data": coverage_data
        }

        # Generate response using Gemini
        response = generate_insurance_recommendations(gemini_input)

        # Debug print for Gemini result
        print("Gemini Vehicle Condition Analysis (Debug):", response)

        # Return the response
        return {
            "description": description,
            "coverage_analysis": response
        }
    except Exception as e:
        # Handle errors and return a meaningful message
        print(f"Error in /analyze_vehicle_condition endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the vehicle condition.")

@app.post("/analyze_report")
async def analyze_report(file: UploadFile = File(...)) -> Dict:
    """
    Analyze the audio report by transcribing it and determining the next steps.
    """
    temp_audio_path = None
    temp_wav_path = None

    # List of important questions
    important_questions = [
        "¿Dónde ocurrió el accidente?",
        "¿Hubo heridos?",
        "¿Cuál es el estado del vehículo?",
        "¿Cuántos vehículos estuvieron involucrados?",
    ]

    # Simulate a session to track unanswered questions
    session = {"unanswered_questions": important_questions}

    try:
        # Save the uploaded audio file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as temp_audio_file:
            temp_audio_file.write(await file.read())
            temp_audio_path = temp_audio_file.name

        # Convert the audio file to WAV format
        temp_wav_path = temp_audio_path.replace(".m4a", ".wav")
        audio = AudioSegment.from_file(temp_audio_path, format="m4a")
        audio.export(temp_wav_path, format="wav")

        # Transcribe the WAV audio file
        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_wav_path) as source:
            audio_data = recognizer.record(source)
            transcription = recognizer.recognize_google(audio_data, language="es-ES")

        # Debug print for transcription
        print(f"Transcription: {transcription}")

        # Analyze the transcription to determine which questions are still unanswered
        for question in session["unanswered_questions"]:
            if question.lower() in transcription.lower():
                session["unanswered_questions"].remove(question)

        # If there are no more unanswered questions, return a completion response
        if not session["unanswered_questions"]:
            return {
                "status": "okey",
                "message": "El reporte está completo. Procede al siguiente paso.",
            }

        # Otherwise, return the remaining questions
        return {
            "status": "incomplete",
            "questions": session["unanswered_questions"],
        }

    except sr.UnknownValueError:
        raise HTTPException(status_code=400, detail="No se pudo entender el audio. Inténtalo de nuevo.")
    except sr.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el audio: {e}")
    except Exception as e:
        print(f"Error in /analyze_report endpoint: {e}")
        raise HTTPException(status_code=500, detail="Ocurrió un error al analizar el reporte.")
    finally:
        # Clean up the temporary audio files
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        if temp_wav_path and os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)