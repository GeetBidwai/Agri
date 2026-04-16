from django.urls import path

from .auth_views import login, logout, me, signup


urlpatterns = [
    path("login/", login),
    path("logout/", logout),
    path("me/", me),
    path("signup/", signup),
]
