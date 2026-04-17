from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Bid, Product, SellerKYC
from .permissions import get_or_create_profile
from .serializers import BidSerializer, ProductSerializer, SellerKYCSerializer
from .views import perform_create


def _apply_listing_filters(request, queryset):
    category = request.GET.get("category", "").strip()
    location = request.GET.get("location", "").strip()
    min_price = request.GET.get("min_price", "").strip()
    max_price = request.GET.get("max_price", "").strip()

    if category:
        queryset = queryset.filter(category__iexact=category)

    if location:
        queryset = queryset.filter(location__icontains=location)

    if min_price:
        queryset = queryset.filter(price_per_kg__gte=min_price)

    if max_price:
        queryset = queryset.filter(price_per_kg__lte=max_price)

    return queryset


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_kyc(request):
    serializer = SellerKYCSerializer(data=request.data, context={"request": request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    kyc = serializer.save(user=request.user, status="Pending")
    return Response(SellerKYCSerializer(kyc, context={"request": request}).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kyc_status(request):
    kyc = SellerKYC.objects.filter(user=request.user).order_by("-created_at").first()
    if not kyc:
        return Response({"submitted": False, "status": "Not Submitted", "is_verified": False})

    profile, _ = get_or_create_profile(request.user)
    return Response(
        {
            **SellerKYCSerializer(kyc, context={"request": request}).data,
            "submitted": True,
            "is_verified": profile.is_verified,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_listing(request):
    profile, _ = get_or_create_profile(request.user)
    if not profile.is_verified:
        return Response(
            {"error": "Verification required to create listings"},
            status=status.HTTP_403_FORBIDDEN,
        )

    payload = request.data.copy()
    listing_type = payload.get("listing_type")

    if listing_type:
        payload["listing_type"] = str(listing_type).upper()

    if payload.get("price") and not payload.get("price_per_kg"):
        payload["price_per_kg"] = payload["price"]

    if payload.get("product_name") and not payload.get("name"):
        payload["name"] = payload["product_name"]

    serializer = ProductSerializer(data=payload, context={"request": request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    perform_create(serializer, request)
    return Response(
        ProductSerializer(serializer.instance, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def list_listings(request):
    queryset = Product.objects.all().order_by("-created_at")
    queryset = _apply_listing_filters(request, queryset)
    serializer = ProductSerializer(queryset, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
def listing_detail(request, listing_id):
    listing = get_object_or_404(Product, pk=listing_id)

    if request.method == "GET":
        return Response(ProductSerializer(listing, context={"request": request}).data)

    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if listing.user_id != request.user.id:
        return Response({"detail": "You can only manage your own listings."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    payload = request.data.copy()
    if payload.get("price") and not payload.get("price_per_kg"):
        payload["price_per_kg"] = payload["price"]
    if payload.get("product_name") and not payload.get("name"):
        payload["name"] = payload["product_name"]

    serializer = ProductSerializer(listing, data=payload, partial=True, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(ProductSerializer(serializer.instance, context={"request": request}).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_bid(request):
    listing_id = request.data.get("listing_id")
    bid_price = request.data.get("bid_price")

    if not listing_id or not bid_price:
        return Response({"detail": "listing_id and bid_price are required."}, status=status.HTTP_400_BAD_REQUEST)

    listing = get_object_or_404(Product, pk=listing_id)
    profile, _ = get_or_create_profile(request.user)

    serializer = BidSerializer(
        data={
            "buyer_name": request.user.username,
            "buyer_phone": profile.phone,
            "bid_price": bid_price,
            "quantity": request.data.get("quantity") or 1,
        }
    )
    if serializer.is_valid():
        serializer.save(product=listing)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
