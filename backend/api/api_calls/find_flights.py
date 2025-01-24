import requests
import os
from dotenv import load_dotenv


load_dotenv()
rapidapi_key = os.getenv('RAPIDAPI_VINCE')

def find_flights(airport_code_from, airport_code_to, date):

    url = "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights"

    querystring = {
        "sourceAirportCode": airport_code_from,
        "destinationAirportCode": airport_code_to,
        "date": date,
        "itineraryType":"ONE_WAY",
        "sortOrder":"ML_BEST_VALUE",
        "numAdults":"1","numSeniors":"1",
        "classOfService":"ECONOMY",
        "pageNumber":"1",
        "nearby":"yes",
        "nonstop":"yes",
        "currencyCode":"USD",
        "region":"USA"}
    headers = {
       	"x-rapidapi-key": rapidapi_key,
    	"x-rapidapi-host": "tripadvisor16.p.rapidapi.com"
    }

    print("sending API request")
    response = requests.get(url, headers=headers, params=querystring)

    try:
        response.raise_for_status()  # Raise an error for bad responses
        api_data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        api_data = {"error": str(e)}

    #print("TRIPADVISOR FLIGHTS DATA:")
    #print(api_data)
    return api_data


