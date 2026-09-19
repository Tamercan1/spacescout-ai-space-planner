from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, SpacePlan, Discoveries

# register your models here
admin.site.register(User, UserAdmin)


@admin.register(SpacePlan)
class SpacePlanAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "created_at", "updated_at")
    list_filter = ("user", "created_at")
    search_fields = ("title", "prompt", "summary")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Discoveries)
class DiscoveriesAdmin(admin.ModelAdmin):
    list_display = ("title", "space_plan", "type", "date", "media_type")
    list_filter = ("type", "media_type", "date")
    search_fields = ("title", "summary", "why_interesting")
