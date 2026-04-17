from django.urls import path

from .views import decide_bid, get_product_contact, get_products, manage_bids, product_detail, report_product, get_user_bids

urlpatterns = [
    path('', get_products),
    path('user-bids/', get_user_bids),
    path('<int:product_id>/', product_detail),
    path('<int:product_id>/contact/', get_product_contact),
    path('<int:product_id>/report/', report_product),
    path('<int:product_id>/bids/', manage_bids),
    path('<int:product_id>/bids/<int:bid_id>/decision/', decide_bid),
]
