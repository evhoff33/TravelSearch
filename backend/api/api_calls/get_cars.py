import requests
import os
from dotenv import load_dotenv


load_dotenv()
rapidapi_key = os.getenv('RAPIDAPI_VINCE')

def get_pickup_entity_id(location):
    url = "https://sky-scanner3.p.rapidapi.com/cars/auto-complete"

    params = {"query": location} # parameters

    headers = {"x-rapidapi-key": rapidapi_key, "x-rapidapi-host": "sky-scanner3.p.rapidapi.com"}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if "data" in data and len(data["data"]) > 0:
            entity_id = data["data"][0]["entity_id"]
            return entity_id
        else:
            raise Exception("DIDNT WORK no valid entity id found")
    except requests.exceptions.RequestException as e:
        print(f"error: {e}")
        return {"error": str(e)}


def find_cars(pickup_location, pickup_date, dropoff_date, pickup_time, dropoff_time):
    # Get the entity ID for the pickup location
    pickup_entity_id = get_pickup_entity_id(pickup_location)

    # If there was an error retrieving the entity ID, return the error dictionary
    if isinstance(pickup_entity_id, dict) and "error" in pickup_entity_id:
        return pickup_entity_id

    # Strip the entity ID to avoid unexpected whitespaces
    pickup_entity_id = pickup_entity_id.strip()

    # Print the entity ID to ensure it is correct
    print(f"Pickup Entity ID: {pickup_entity_id}")

    # Define URL for the car search API
    url = "https://sky-scanner3.p.rapidapi.com/cars/search"

    # Define parameters for the car search request with corrected casing
    params = {
        "pickUpDate": pickup_date,     # Format: mm/dd/yyyy
        "pickUpTime": pickup_time,     # Format: --:-- -- (e.g., 10:00 AM)
        "dropOffDate": dropoff_date,   # Format: mm/dd/yyyy
        "dropOffTime": dropoff_time,   # Format: --:-- -- (e.g., 02:00 PM)
        "pickUpEntityId": pickup_entity_id,  # Corrected casing here
        "dropOffEntityId": pickup_entity_id  # Corrected casing here
    }

    # Print the parameters to ensure they are correctly formed
    print(f"Request Parameters: {params}")

    headers = {
        "x-rapidapi-key": rapidapi_key,
        "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
        "Content-Type": "application/json"  # Added header
    }

    try:
        # Make the GET request to the car search API
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an error for unsuccessful status codes
        car_data = response.json()
        return car_data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return {"error": str(e)}


    
if __name__ == "__main__":
    # Example data to test car search (use 24-hour format for times)
    pickup_location = "New York"  # Replace with any valid location
    pickup_date = "2024-12-05"    # Format: YYYY-MM-DD
    dropoff_date = "2024-12-10"   # Format: YYYY-MM-DD
    pickup_time = "10:00"         # 24-hour format (HH:MM)
    dropoff_time = "14:00"        # 24-hour format (HH:MM)

    # Get the entity ID for the location
    pickup_entity_id = get_pickup_entity_id(pickup_location)

    # Proceed if the entity ID is valid
    if isinstance(pickup_entity_id, dict) and "error" in pickup_entity_id:
        print(f"Error retrieving entity ID: {pickup_entity_id['error']}")
    else:
        # Call find_cars with the retrieved entity ID
        car_data = find_cars(pickup_location, pickup_date, dropoff_date, pickup_time, dropoff_time)
        if isinstance(car_data, dict) and "error" in car_data:
            print(f"Error retrieving car data: {car_data['error']}")
        else:
            print(f"Car rental data: {car_data}")


