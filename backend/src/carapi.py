import requests

vehicle_id = '123456'  # Replace with the actual vehicle ID
access_token = 'your_access_token'  # Replace with your valid access token

url = f'https://offers.system.trans.eu/api/rest/v1/vehicles/{vehicle_id}'
headers = {
    'Accept': 'application/hal+json',
    'Authorization': f'Bearer {access_token}'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    vehicle_data = response.json()
    print(vehicle_data)
else:
    print(f'Error: {response.status_code}')
