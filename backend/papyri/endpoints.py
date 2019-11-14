from django.urls import path, include
from rest_framework import routers
from .api import RegistrationAPI, LoginAPI, UserAPI

urlpatterns = [
    path('register/', RegistrationAPI.as_view()),
    path('login/', LoginAPI.as_view()),
    path('user/', UserAPI.as_view())
]