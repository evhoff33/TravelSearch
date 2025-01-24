
def get_token_amadeus():
    return "mock_token"

def search_locations(keyword):
    return [{
        "name": "Test Location",
        "iataCode": "TST",
        "address": {
            "cityName": "Test City",
            "countryName": "Test Country"
        }
    }]

def search_hotels(cityCode, checkInDate, checkOutDate):
    return [{
        "name": "Test Hotel",
        "rating": "4",
        "address": "Test Address",
        "price": {"total": "100.00"}
    }]