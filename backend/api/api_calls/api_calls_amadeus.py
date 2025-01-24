import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_token_amadeus():
    client_id_amadeus = os.getenv('AMADEUS_CLIENT_ID')
    client_secret_amadeus = os.getenv('AMADEUS_CLIENT_SECRET')

    if not client_id_amadeus or not client_secret_amadeus:
        raise Exception("Amadeus credentials not found in environment variables")

    token_url = 'https://test.api.amadeus.com/v1/security/oauth2/token'
    token_data = {
        'grant_type': 'client_credentials',
        'client_id': client_id_amadeus,
        'client_secret': client_secret_amadeus
    }
    token_headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_url, data=token_data, headers=token_headers)
    token_info = response.json()
    access_token_amadeus = token_info.get('access_token')
    return access_token_amadeus

# Initialize the access token
access_token_amadeus = get_token_amadeus()

def make_api_request(url, params):
    global access_token_amadeus
    api_headers = {
        'Authorization': f'Bearer {access_token_amadeus}'
    }

    api_response = requests.get(url, params=params, headers=api_headers)
    api_data = api_response.json()

    # Check if the token has expired
    if 'errors' in api_data and any(error['code'] == 38192 for error in api_data['errors']):
        print("Access token expired. Obtaining a new token...")
        access_token_amadeus = get_token_amadeus()  # Get a new access token
        api_headers['Authorization'] = f'Bearer {access_token_amadeus}'  # Update headers with new token
        api_response = requests.get(url, params=params, headers=api_headers)  # Retry the request
        api_data = api_response.json()

    return api_data

def get_hotels(lat, long, rad):
    api_url = 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode'
    api_params = {
        'latitude': lat,
        'longitude': long,
        'radius': rad,
    }

    api_data = make_api_request(api_url, api_params)
    return api_data

def get_attrs(lat, long, rad):
    api_url = 'https://test.api.amadeus.com/v1/shopping/activities'
    api_params = {
        'latitude': lat,
        'longitude': long,
        'radius': rad,
    }

    api_data = make_api_request(api_url, api_params)
    return api_data

  
