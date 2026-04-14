from django.urls import path

from .auth_views import login, me, signup


urlpatterns = [
    path("login/", login),
    path("me/", me),
    path("signup/", signup),
]
