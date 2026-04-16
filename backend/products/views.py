from django.db import IntegrityError
from django.db.models import Q
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import ListingReport, Product, Bid
from .permissions import get_or_create_profile, is_seller
from .serializers import ProductSerializer, ProductContactSerializer, BidSerializer, ListingReportSerializer


def perform_create(serializer, request):
    profile, _ = get_or_create_profile(request.user)
    phone = profile.phone

    product_name = serializer.validated_data.get("product_name") or serializer.validated_data.get("name", "")
    hindi_name = serializer.validated_data.get("hindi_name") or serializer.validated_data.get("hindi", "")

    serializer.save(
        user=request.user,
        seller=request.user.username,
        contact_phone=phone,
        product_name=product_name,
        name=product_name,
        hindi_name=hindi_name,
        hindi=hindi_name,
    )


@api_view(['GET', 'POST'])
def get_products(request):
    # GET -> fetch data
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        listing_type = request.GET.get('type', '').strip().upper()
        category_query = request.GET.get('category', '').strip()
        location_query = request.GET.get('location', '').strip()
        max_price = request.GET.get('max_price', '').strip()
        products = Product.objects.all().order_by('-created_at')

        # Optional search keeps the old response unchanged when query is empty
        if search_query:
            products = products.filter(
                Q(name__icontains=search_query)
                | Q(product_name__icontains=search_query)
                | Q(hindi__icontains=search_query)
                | Q(hindi_name__icontains=search_query)
            )

        # Optional type filter keeps the old response unchanged when no filter is sent
        if listing_type in {'BUY', 'SELL'}:
            products = products.filter(listing_type=listing_type)

        # Optional category filter
        if category_query:
            products = products.filter(category__iexact=category_query)

        if location_query:
            products = products.filter(location__icontains=location_query)

        if max_price:
            products = products.filter(price_per_kg__lte=max_price)

        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

    # POST -> create new product
    if request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not is_seller(request.user):
            return Response(
                {"detail": "Only sellers can create listings."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Check KYC verification status for sellers
        profile = getattr(request.user, "profile", None)
        if profile and profile.kyc_status != "verified":
            return Response(
                {"detail": "Please verify your account before performing this action."},
                status=status.HTTP_403_FORBIDDEN,
            )

        payload = request.data.copy()
        listing_type = payload.get('listing_type')

        # Keep old and new fields in sync so existing UI logic continues to work
        if listing_type:
            payload['listing_type'] = str(listing_type).upper()
            payload['type'] = str(listing_type).lower()
        elif payload.get('type'):
            payload['listing_type'] = str(payload['type']).upper()

        if payload.get('product_name') and not payload.get('name'):
            payload['name'] = payload['product_name']
        elif payload.get('name') and not payload.get('product_name'):
            payload['product_name'] = payload['name']

        if payload.get('hindi_name') and not payload.get('hindi'):
            payload['hindi'] = payload['hindi_name']
        elif payload.get('hindi') and not payload.get('hindi_name'):
            payload['hindi_name'] = payload['hindi']

        payload.pop('seller', None)
        payload.pop('phone', None)
        payload.pop('contact_phone', None)

        serializer = ProductSerializer(data=payload, context={"request": request})
        if serializer.is_valid():
            perform_create(serializer, request)
            return Response(
                ProductSerializer(serializer.instance, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_product_contact(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    serializer = ProductContactSerializer(product)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def report_product(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    serializer = ListingReportSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        serializer.save(product=product, reporter=request.user)
    except IntegrityError:
        return Response({"detail": "Already reported"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bids(request):
    """Fetch all bids received for products owned by the current user."""
    bids = Bid.objects.filter(product__user=request.user).order_by('-created_at')
    # Add product name to each bid for UI display
    data = []
    for bid in bids:
        bid_data = BidSerializer(bid).data
        bid_data['product_name'] = bid.product.name
        data.append(bid_data)
    return Response(data)


@api_view(['GET', 'POST'])
def manage_bids(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    if request.method == 'GET':
        bids = product.bids.all().order_by('-created_at')
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        payload = request.data.copy()
        payload['product'] = product.id
        serializer = BidSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
