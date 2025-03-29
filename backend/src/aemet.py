import requests
import json
import os

# Replace this with your actual API Key
API_KEY = os.environ.get("AEMET_API_KEY")
BASE_URL = 'https://opendata.aemet.es/opendata/api/'

# Example endpoint: weather observation in a specific location
# You can change the endpoint as per your needs, like forecast, alert, etc.
endpoint = 'observacion/convencional/todas'


# Set headers with the API Key
headers = {
    'api_key': API_KEY
}


# Make a request to get the data
response = requests.get(BASE_URL + endpoint, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    # The response will contain a URL where you can access the data
    data_url = response.json().get('datos')
    
    # Fetch the actual data from the provided URL
    data_response = requests.get(data_url)
    
    if data_response.status_code == 200:
        # Load the JSON data
        data = data_response.json()
        
        # Print or process the data as needed
        print(json.dumps(data, indent=4))
    else:
        print(f"Error fetching data: {data_response.status_code}")
else:
    print(f"Error with the API request: {response.status_code}")


def get_weather_data(lat: float, lon: float) -> dict:
    """
    Fetch current weather observation data using AEMET API.
    """
    endpoint = 'observacion/convencional/todas'
    response = requests.get(BASE_URL + endpoint, headers=headers)

    if response.status_code == 200:
        data_url = response.json().get('datos')
        data_response = requests.get(data_url)
        if data_response.status_code == 200:
            return data_response.json()
        else:
            return {"error": f"Error fetching weather data: {data_response.status_code}"}
    else:
        return {"error": f"Error with the weather API request: {response.status_code}"}


def get_forecast_data(municipio: str) -> dict:
    """
    Fetch daily weather forecasts for a specific municipality using AEMET API.
    """
    endpoint = f'prediccion/especifica/municipio/diaria/{municipio}'
    response = requests.get(BASE_URL + endpoint, headers=headers)

    if response.status_code == 200:
        data_url = response.json().get('datos')
        data_response = requests.get(data_url)
        if data_response.status_code == 200:
            return data_response.json()
        else:
            return {"error": f"Error fetching forecast data: {data_response.status_code}"}
    else:
        return {"error": f"Error with the forecast API request: {response.status_code}"}


def get_climatological_data(fecha_ini: str, fecha_fin: str, idema: str) -> dict:
    """
    Fetch daily climatological data for a specific station using AEMET API.
    """
    endpoint = f'valores/climatologicos/diarios/datos/fechaini/{fecha_ini}/fechafin/{fecha_fin}/estacion/{idema}'
    response = requests.get(BASE_URL + endpoint, headers=headers)

    if response.status_code == 200:
        data_url = response.json().get('datos')
        data_response = requests.get(data_url)
        if data_response.status_code == 200:
            return data_response.json()
        else:
            return {"error": f"Error fetching climatological data: {data_response.status_code}"}
    else:
        return {"error": f"Error with the climatological API request: {response.status_code}"}
