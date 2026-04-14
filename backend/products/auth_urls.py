from django.urls import path

from .auth_views import login, signup


urlpatterns = [
    path("login/", login),
    path("signup/", signup),
]
