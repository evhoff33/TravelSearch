from geopy import Nominatim

def get_location_info(location):
    location_info = None

    geolocator = Nominatim(user_agent="travelplannerdjango@boli.dev")
    location_info = geolocator.geocode(location, exactly_one=True, addressdetails=True)

    if location_info:
        result = [
            location_info.latitude,         # Index 0: Latitude
            location_info.longitude,        # Index 1: Longitude
            location_info.address,          # Index 2: Address (full formatted)
            location_info.raw.get('display_name'),  # Index 3: Display name
            location_info.raw.get('boundingbox'),   # Index 4: Bounding box (if any)
            location_info.raw.get('osm_type'),      # Index 5: OSM type (e.g., node, way)
            location_info.raw.get('osm_id'),        # Index 6: OSM ID
        ]
        return result
    else:
        return None




def get_address_from_coordinates(coordinates):
    geolocator = Nominatim(user_agent="travelplannerdjango@boli.dev")
    location_info = geolocator.reverse(coordinates, exactly_one=True, addressdetails=True)

    if location_info:
        return location_info.address
    else:
        return None