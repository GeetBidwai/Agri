from django.db import IntegrityError
from django.db.models import Q
from django.db import transaction
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import ListingReport, Product, ProductImage, Bid
from .permissions import get_or_create_profile
from .serializers import ProductSerializer, ProductContactSerializer, BidSerializer, ListingReportSerializer


def sync_product_images(product, request):
    uploaded_images = request.FILES.getlist("images")
    if not uploaded_images:
        single_image = request.FILES.get("image")
        if single_image:
            uploaded_images = [single_image]

    if not uploaded_images:
        return

    for existing in product.images.all():
        existing.image.delete(save=False)
    product.images.all().delete()

    product_images = [ProductImage(product=product, image=image) for image in uploaded_images]
    ProductImage.objects.bulk_create(product_images)

    product.image = uploaded_images[0]
    product.save(update_fields=["image"])


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
    sync_product_images(serializer.instance, request)


@api_view(['GET', 'POST'])
def get_products(request):
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        listing_type = request.GET.get('type', '').strip().upper()
        category_query = request.GET.get('category', '').strip()
        location_query = request.GET.get('location', '').strip()
        max_price = request.GET.get('max_price', '').strip()
        products = Product.objects.all().order_by('-created_at')

        if search_query:
            products = products.filter(
                Q(name__icontains=search_query)
                | Q(product_name__icontains=search_query)
                | Q(hindi__icontains=search_query)
                | Q(hindi_name__icontains=search_query)
            )

        if listing_type in {'BUY', 'SELL'}:
            products = products.filter(listing_type=listing_type)

        if category_query:
            products = products.filter(category__iexact=category_query)

        if location_query:
            products = products.filter(location__icontains=location_query)

        if max_price:
            products = products.filter(price_per_kg__lte=max_price)

        serializer = ProductSerializer(products.prefetch_related('images'), many=True, context={"request": request})
        return Response(serializer.data)

    if request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        profile, _ = get_or_create_profile(request.user)
        if not profile.is_verified:
            return Response(
                {"error": "Verification required to create listings"},
                status=status.HTTP_403_FORBIDDEN,
            )

        payload = request.data.copy()
        listing_type = payload.get('listing_type')

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


@api_view(["GET", "PUT", "DELETE"])
def product_detail(request, product_id):
    product = get_object_or_404(Product.objects.prefetch_related('images'), pk=product_id)

    if request.method == "GET":
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data)

    if not request.user or not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if product.user_id != request.user.id:
        return Response(
            {"detail": "You can only manage your own products."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "DELETE":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    payload = request.data.copy()
    listing_type = payload.get("listing_type")

    if listing_type:
        payload["listing_type"] = str(listing_type).upper()
        payload["type"] = str(listing_type).lower()
    elif payload.get("type"):
        payload["listing_type"] = str(payload["type"]).upper()

    if payload.get("product_name") and not payload.get("name"):
        payload["name"] = payload["product_name"]
    elif payload.get("name") and not payload.get("product_name"):
        payload["product_name"] = payload["name"]

    if payload.get("hindi_name") and not payload.get("hindi"):
        payload["hindi"] = payload["hindi_name"]
    elif payload.get("hindi") and not payload.get("hindi_name"):
        payload["hindi_name"] = payload["hindi"]

    payload.pop("seller", None)
    payload.pop("phone", None)
    payload.pop("contact_phone", None)
    payload.pop("user", None)
    payload.pop("is_verified", None)
    payload.pop("created_at", None)
    payload.pop("images", None)

    serializer = ProductSerializer(product, data=payload, partial=True, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        sync_product_images(serializer.instance, request)
        serializer.instance.refresh_from_db()
        return Response(ProductSerializer(serializer.instance, context={"request": request}).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    data = []
    for bid in bids:
        bid_data = BidSerializer(bid).data
        bid_data['product_name'] = bid.product.name
        bid_data['product_id'] = bid.product_id
        data.append(bid_data)
    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def decide_bid(request, product_id, bid_id):
    product = get_object_or_404(Product, pk=product_id)
    bid = get_object_or_404(Bid, pk=bid_id, product=product)

    if product.user_id != request.user.id:
        return Response(
            {"detail": "You can only manage bids for your own products."},
            status=status.HTTP_403_FORBIDDEN,
        )

    action = str(request.data.get("action", "")).strip().lower()
    if action not in {"accept", "reject"}:
        return Response(
            {"detail": "Invalid action."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if bid.status != "pending":
        return Response(
            {"detail": f"This bid has already been {bid.status}."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        if action == "accept":
            bid.status = "accepted"
            bid.save(update_fields=["status"])

            Bid.objects.filter(product=product, status="pending").exclude(pk=bid.pk).update(status="rejected")

            if product.status != "sold":
                product.status = "sold"
                product.save(update_fields=["status"])
        else:
            bid.status = "rejected"
            bid.save(update_fields=["status"])

    return Response(BidSerializer(bid).data, status=status.HTTP_200_OK)


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
