from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    pass


class SpacePlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="space_plan")
    prompt = models.TextField()
    title = models.CharField(max_length=250)
    summary = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Discoveries(models.Model):
    space_plan = models.ForeignKey(SpacePlan, on_delete=models.CASCADE, related_name="discoveries")
    type = models.CharField(max_length=100)
    title = models.CharField(max_length=250)

    date = models.DateField(null=True, blank=True)

    summary = models.TextField()
    why_interesting = models.TextField()

    facts = models.JSONField(default=dict)

    source = models.URLField()

    media_type = models.CharField(max_length=50, null=True, blank=True)

    media_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.title