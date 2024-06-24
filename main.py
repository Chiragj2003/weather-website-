import requests
from api_key import key

def forward_geocode(api_key, query):
    base_url = "http://dev.virtualearth.net/REST/v1/Locations"
    params = {
        "q": query,
        "key": key
    }

    response = requests.get(base_url, params=params)
    print(response.url)

    if response.status_code == 200:
        data = response.json()
        if data.get("resourceSets") and len(data["resourceSets"]) > 0:
            resources = data["resourceSets"][0].get("resources")
            if resources and len(resources) > 0:
                location = resources[0].get("point", {}).get("coordinates")
                return location  # Returns a tuple (latitude, longitude)
        else:
            print("No results found for the query:", query)
    else:
        print("Error in API request:", response.status_code, response.text)
    return None

if __name__ == "__main__":
    API_KEY = "YOUR_BING_MAPS_API_KEY"
    address = "Haridwar"

    location = forward_geocode(API_KEY, address)
    if location:
        latitude, longitude = location
        print("Latitude:", latitude)
        print("Longitude:", longitude)
