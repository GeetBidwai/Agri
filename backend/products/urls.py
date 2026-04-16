from django.urls import path

from .views import get_product_contact, get_products, manage_bids, report_product

urlpatterns = [
    path('', get_products),
    path('<int:product_id>/contact/', get_product_contact),
    path('<int:product_id>/report/', report_product),
    path('<int:product_id>/bids/', manage_bids),
]
