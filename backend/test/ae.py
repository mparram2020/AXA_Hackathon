import os
import random
import requests
from datetime import datetime, timedelta

def test_aemet_endpoints():
    """
    Tests various AEMET API endpoints with random coordinates and prints the responses.
    """

    aemet_api_key = os.getenv("AEMET_API_KEY")
    if not aemet_api_key:
        print("Error: AEMET_API_KEY environment variable not set.")
        return

    # Spain's geographical boundaries (approximate)
    min_lat, max_lat = 36.0, 44.0
    min_lon, max_lon = -9.0, 5.0

    def get_random_coordinates():
        """Generates random coordinates within Spain's boundaries."""
        lat = random.uniform(min_lat, max_lat)
        lon = random.uniform(min_lon, max_lon)
        return lat, lon

    def get_random_date():
        """Generates a random date within the last week."""
        today = datetime.now()
        start_date = today - timedelta(days=7)
        random_date = start_date + timedelta(days=random.randint(0, 7))
        return random_date.strftime('%Y-%m-%d')

    endpoints = [
        {
            "url": "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/{municipio}",
            "params": {"municipio": "28079"},  # Madrid. You'll need to find municipio IDs
        },
        {
            "url": "https://opendata.aemet.es/opendata/api/observacion/convencional/todas",
            "params": {},
        },
        {
            "url": "https://opendata.aemet.es/opendata/api/valores/climatologicos/diarios/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/estacion/{idema}",
            "params": {
                "fechaIniStr": get_random_date(),
                "fechaFinStr": get_random_date(),
                "idema": "C3",  # An IDEMA station. You'll need to find valid station IDs
            },
        },
        {
            "url": "https://opendata.aemet.es/opendata/api/mapasygraficos/analisis",
            "params": {},
        },
        {
             "url": "https://opendata.aemet.es/opendata/api/avisos_cap/ultimoelaborado/area/{area}",
             "params": {
                "area": "canarias"
             }
        }
    ]

    for endpoint_data in endpoints:
        url = endpoint_data["url"]
        params = endpoint_data["params"]

        # Replace placeholders in URL with values
        formatted_url = url.format(**params)

        try:
            headers = {"api_key": aemet_api_key}
            response = requests.get(formatted_url, headers=headers)
            response.raise_for_status()  # Raise an exception for bad status codes

            print(f"Testing endpoint: {formatted_url}")
            print(response.json())  # Print the JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error calling endpoint {formatted_url}: {e}")

if __name__ == "__main__":
    test_aemet_endpoints()