import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NASA_API_KEY")

NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"
NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed"
NASA_FLR_URL = "https://api.nasa.gov/DONKI/FLR"


def get(url, params, timeout=15):
    try:
        response = httpx.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json(), None

    except httpx.HTTPStatusError as err:
        status = err.response.status_code
        if status == 429:
            message = "NASA API rate limit reached. Try again later."
        elif status in [401, 403]:
            message = "NASA API key was rejected. Check NASA_API_KEY."
        else:
            message = f"NASA API returned an error (status {status})."
        
        return None, message

    except httpx.RequestError:
        return None, "Network Error: Could not reach the NASA API."


# GET ASTRONOMY PICTURES USING NASA'S APOD
def get_astronomy_picture(date=None):
    qparams = {
        "api_key": API_KEY
    }

    if date:
        qparams["date"] = date

    data, error = get(NASA_APOD_URL, qparams)

    if error:
        return {
            "error": error
        }

    try:
        return {
            "date": data["date"],
            "title": data["title"],
            "explanation": data["explanation"],
            "image_url": data["url"],
            "media_type": data["media_type"],
            "source": "NASA"
        }
    except KeyError:
        return {
            "error": "Unexpected NASA API response."
        }


# GET NEAR EART OBJECTS USING NASA'S NEOWS
def search_near_earth_objects(start_date, end_date):
    qparams = {
        "api_key": API_KEY,
        "start_date": start_date,
        "end_date": end_date
    }

    data, error = get(NASA_NEO_URL, qparams)

    if error:
        return {
            "error": error
        }

    objects = []

    try:
        for date, asteroids in data["near_earth_objects"].items():
            for asteroid in asteroids:
                objects.append({
                    "id": asteroid["id"],
                    "name": asteroid["name"],
                    "date": date,
                    "estimated_diameter_km": {
                        "min": asteroid["estimated_diameter"]["kilometers"]["estimated_diameter_min"],
                        "max": asteroid["estimated_diameter"]["kilometers"]["estimated_diameter_max"]
                    },
                    "miss_distance_km": asteroid["close_approach_data"][0]["miss_distance"]["kilometers"],
                    "is_potentially_hazardous": asteroid["is_potentially_hazardous_asteroid"],
                    "nasa_jpl_url": asteroid["nasa_jpl_url"]
                })
    except KeyError:
        return {
            "error": "Unexpected NASA API response."
        }

    return {
        "count": len(objects),
        "objects": objects
    }


# GET SOLAR FLARES USING NASA'S DONKI FLR
def get_solar_flares(start_date, end_date):
    qparams = {
        "api_key": API_KEY,
        "start_date": start_date,
        "end_date": end_date
    }

    data, error = get(NASA_FLR_URL, qparams)

    if error:
        return {
            "error": error
        }

    flares = []

    try:
        for flare in data:
            flares.append({
                "id": flare["flrID"],
                "start_time": flare["beginTime"],
                "peak_time": flare["peakTime"],
                "end_time": flare["endTime"],
                "class": flare["classType"],
                "source_location": flare.get("sourceLocation", ""),
                "active_region": flare.get("activeRegionNum", ""),
                "note": flare.get("note", ""),
                "url": flare["link"]
            })
    except KeyError:
        return {
            "error": "Unexpected NASA API response."
        }

    return {
        "count": len(flares),
        "flares": flares
    }
