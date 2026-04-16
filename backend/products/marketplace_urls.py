from django.urls import path

from .marketplace_views import create_listing, kyc_status, list_listings, listing_detail, place_bid, upload_kyc


urlpatterns = [
    path("kyc/upload/", upload_kyc),
    path("kyc/status/", kyc_status),
    path("listings/create/", create_listing),
    path("listings/", list_listings),
    path("listings/<int:listing_id>/", listing_detail),
    path("bids/place/", place_bid),
]
