from django.urls import path

from .views import get_product_contact, get_products

urlpatterns = [
    path('', get_products),
    path('<int:product_id>/contact/', get_product_contact),
]
