from datetime import datetime

def parse_discovery_date(value):
    if not value:
        return None

    return datetime.strptime(value, "%B %d, %Y").date()