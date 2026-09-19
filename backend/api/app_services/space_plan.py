from django.db import transaction
from ..models import SpacePlan, Discoveries
from datetime import date

# =================================
# THIS IS TO SAVE THE RESULT TO DB
# =================================


@transaction.atomic
def save_space_plan(user, prompt, space_plan):
    plan = SpacePlan.objects.create(
        user=user,
        prompt=prompt,
        title=space_plan.title,
        summary=space_plan.summary
    )

    for discovery in space_plan.discoveries:
        if discovery.media:
            media_type = discovery.media.media_type
            media_url = discovery.media.media_url 
        else:
            media_type = None
            media_url = None

        Discoveries.objects.create(
            space_plan=plan,
            type=discovery.type,
            title=discovery.title,
            date=date.fromisoformat(discovery.date) if discovery.date else None, # Convert date to YYYY-MM-DD format or None
            summary=discovery.summary,
            why_interesting=discovery.why_interesting,
            facts=discovery.facts,
            source=discovery.source,
            media_type=media_type,
            media_url=media_url
        )

    return plan