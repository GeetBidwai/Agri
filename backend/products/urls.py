from django.urls import path

from .views import get_product_contact, get_products, manage_bids, report_product, get_user_bids

urlpatterns = [
    path('', get_products),
    path('user-bids/', get_user_bids),
    path('<int:product_id>/contact/', get_product_contact),
    path('<int:product_id>/report/', report_product),
    path('<int:product_id>/bids/', manage_bids),
]
