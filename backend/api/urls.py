from django.urls import path
from .views import CreateUserView, SpacePlanListView, SpacePlanDetailDestroyView, SpacePlanCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", CreateUserView.as_view(), name="index"),
    path("auth/token/", TokenObtainPairView.as_view(), name="access_token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("plans/", SpacePlanListView.as_view(), name="space_plans"),
    path("plans/<int:pk>/", SpacePlanDetailDestroyView.as_view(), name="space_plan_detail_view"),
    path("plans/create/", SpacePlanCreateView.as_view(), name='space_plan_create_view')
]