from django.shortcuts import render
from .models import User, SpacePlan, Discoveries
from .app_services.space_plan import save_space_plan
from .engine.space_planner import run_space_planner

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer, SpacePlanSerializer, SpacePlanRequestSerializer

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

class SpacePlanListView(generics.ListAPIView):
    serializer_class = SpacePlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SpacePlan.objects.filter(user=user).order_by('-created_at')


class SpacePlanDetailDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = SpacePlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SpacePlan.objects.filter(user=user)


class SpacePlanCreateView(generics.CreateAPIView):
    serializer_class = SpacePlanRequestSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.validated_data["prompt"]

        # Calling the main space plan engine
        space_plan = run_space_planner(prompt)

        # Save it to db
        saved_plan = save_space_plan(
            user=request.user,
            prompt=prompt,
            space_plan=space_plan
        )

        response_serializer = SpacePlanSerializer(saved_plan)

        # Respond right away
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )