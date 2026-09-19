from .models import User, SpacePlan, Discoveries
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Username must be at least 4 characters long.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
            
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


# Used inside Space Planner Serializer to serialize every discovery
class DiscoveriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discoveries
        fields = [
            "id", "type", "title",
            "date", "summary", "why_interesting",
            "facts", "source", "media_type", "media_url"
        ] 
          

# Main DB Serializer
class SpacePlanSerializer(serializers.ModelSerializer):
    discoveries = DiscoveriesSerializer(many=True, read_only=True)

    class Meta:
        model = SpacePlan
        fields = ["id", "prompt", "title", "summary", "discoveries", "created_at", "updated_at"]


# User prompt serializer
class SpacePlanRequestSerializer(serializers.Serializer):
    prompt = serializers.CharField(
        max_length=2000,
        allow_blank=False,
        trim_whitespace=True,
    )