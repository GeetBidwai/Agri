from django.urls import path

from .views import get_product_contact, get_products, manage_bids

urlpatterns = [
    path('', get_products),
    path('<int:product_id>/contact/', get_product_contact),
    path('<int:product_id>/bids/', manage_bids),
]
