from ..services.nasa.nasa_services import get_astronomy_picture, search_near_earth_objects, get_solar_flares

# ============================================
# EVERY TOOL SHOULD GET REGISTERED HERE
# ============================================

tool_registry = {
    "get_astronomy_picture": {
        "handler": get_astronomy_picture,
        "description": (
            "Retrieve NASA's Astronomy Picture of the Day for a specific date. "
            "Use this when the user wants an interesting, visual, or notable "
            "astronomy discovery for a particular day."
        ),  
        "parameters": [
            {
                "name": "date",
                "description": (
                    "The date to retrieve the astronomy picture for, "
                    "in YYYY-MM-DD format. If omitted, use today's picture."
                ),
                "required": False
            }
        ]
    },
    "search_near_earth_objects": {
        "handler": search_near_earth_objects,
        "description": (
            "Find near-Earth objects, such as asteroids, that approach Earth "
            "within a specified date range. Use this when the user asks about "
            "asteroids, close approaches, potentially hazardous objects, "
            "or interesting objects passing near Earth."
        ),
        "parameters": [
            {
                "name": "start_date",
                "description": (
                    "The beginning of the date range to search, "
                    "in YYYY-MM-DD format."
                ),
                "required": True
            },
            {
                "name": "end_date",
                "description": (
                    "The end of the date range to search, "
                    "in YYYY-MM-DD format."
                ),
                "required": True
            }
        ]
    },
    "get_solar_flares": {
        "handler": get_solar_flares,
        "description": (
            "Retrieve solar flare activity recorded within a specified date range. "
            "Use this when the user asks about solar activity, solar flares, "
            "space weather, or interesting events occurring on the Sun."
        ),
        "parameters": [
            {
                "name": "start_date",
                "description": (
                    "The beginning of the date range to search, "
                    "in YYYY-MM-DD format."
                ),
                "required": True
            },
            {
                "name": "end_date",
                "description": (
                    "The end of the date range to search, "
                    "in YYYY-MM-DD format."
                ),
                "required": True
            }
        ]
    }
}

# =====================================================
# TOOLS DEFINITION FOR EVERY TOOL IN TOOL REGISTRY
# THE ACTUAL TOOLS THE LLM WOULD USE
# =====================================================

tools = [
    {
        "type": "function",
        "function": {
            "name": name,
            "description": func["description"],
            "parameters": {
                "type": "object",
                "properties": {
                    param["name"]: {
                        "type": "string",
                        "description": param["description"]
                    } for param in func["parameters"]
                },
                "required": [param["name"] for param in func["parameters"] if param["required"]]
            }
        }
    } for name, func in tool_registry.items()
]